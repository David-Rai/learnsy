import supabase from '../../config/supabase';
import React, { useEffect, useState } from 'react';
import checkMember from '../../utils/checkMember';
import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { PlusCircle } from 'lucide-react';
import useHomeStore from '../../context/store';
import Loader from '../../components/Loader';

const AddQuestion = () => {
    const { categories, setCategories } = useHomeStore();
    const [newCategory, setNewCategory] = useState('');
    const [lessons, setLessons] = useState([]);
    const [newLesson, setNewLesson] = useState('');
    const [isChecked, setIsChecked] = useState(false);

    const { register, handleSubmit, watch, formState: { errors }, reset } = useForm();
    const optionType = watch('optionType');
    const selectedCategory = watch('category');
    const selectedLesson = watch('lesson');
    const navigate = useNavigate();

    // ✅ Protecting route
    const check = async () => {
        const res = await checkMember();
        if (!res) return navigate('/');
        setIsChecked(true);
    };

    // ✅ Get categories
    const getCategories = async () => {
        const { error, data } = await supabase.rpc('get_categories_with_count');
        if (error) {
            console.error('Error fetching categories:', error);
            return setCategories([]);
        }
        setCategories(data);
    };

    // ✅ Get lessons when category changes
    const getLessons = async (category) => {
        if (!category || category === 'new') {
            setLessons([]);
            return;
        }
        const { data, error } = await supabase
            .from('questions')
            .select('lesson')
            .eq('category', category);

        if (error) {
            console.error('Error fetching lessons:', error);
            setLessons([]);
        } else {

            const newLessons = [...new Set(data.map(item => item.lesson.trim()))];
            setLessons(newLessons || []);
        }
    };

    // ✅ On form submit
    const onSubmit = async (data) => {
        // Handle new category
        if (data.category === 'new' && newCategory.trim()) {
            setCategories([...categories, { name: newCategory.trim() }]);
            data.category = newCategory.trim();
        }

        // Handle new lesson
        if (data.lesson === 'new' && newLesson.trim()) {
            data.lesson = newLesson.trim();
        }

        console.log('📝 New Question:', data);

        const { category, question, hint, lesson, correct, optionType } = data;
        let a, options = []
        if (optionType === 'truefalse') {
            a = correct
            options = ['true', 'false']
        } else {
            a = data[data.correct];
            options = [data.optionA, data.optionB, data.optionC, data.optionD]
        }

        //saving into supabase
        const res = await supabase.from('questions')
            .insert({
                q: question,
                a,
                hint,
                category,
                lesson,
                options
            })

        console.log(res)

        //clearning the fiedls
        reset({
            question: '',
            hint: '',
            optionA: '',
            optionB: '',
            optionC: '',
            optionD: '',
        });

    }

    // 🌀 Initial fetch
    useEffect(() => {
        check();
        if (categories.length === 0) {
            getCategories();
        }
    }, []);

    // 🌀 Fetch lessons when category changes
    useEffect(() => {
        getLessons(selectedCategory);
    }, [selectedCategory]);

    return isChecked ? (
        <div className="h-full w-full p-6 bg-bg rounded-2xl shadow-lg space-y-6 sm:p-4 flex items-center justify-center flex-col overflow-y-scroll custom-scrollbar">
            <h2 className="text-2xl font-bold text-white mb-4 text-center sm:text-lg">Add a New Question</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="w-[50%] space-y-4 flex flex-col sm:space-y-3 ">

                {/* Category Select */}
                <div className="flex flex-col">
                    <label className="text-sm text-gray-300 mb-1">Category</label>
                    <select
                        {...register('category', { required: 'Select a category' })}
                        className={`p-3 rounded-lg bg-gray-800 text-white border ${errors.category ? 'border-red-500' : 'border-gray-700'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    >
                        <option value="">Select Category</option>
                        {categories.map((cat, idx) => (
                            <option key={idx} value={cat.name}>{cat.name}</option>
                        ))}
                        <option value="new">+ New Category</option>
                    </select>

                    {selectedCategory === 'new' && (
                        <input
                            type="text"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            placeholder="Enter new category"
                            className="mt-2 p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    )}
                    {errors.category && <span className="text-red-500 text-sm mt-1">{errors.category.message}</span>}
                </div>

                {/* Lesson Select */}
                {selectedCategory && selectedCategory !== '' && (
                    <div className="flex flex-col">
                        <label className="text-sm text-gray-300 mb-1">Lesson</label>
                        <select
                            {...register('lesson', { required: 'Select a lesson' })}
                            className={`p-3 rounded-lg bg-gray-800 text-white border ${errors.lesson ? 'border-red-500' : 'border-gray-700'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        >
                            <option value="">Select Lesson</option>
                            {lessons.map((lesson, idx) => (
                                <option key={idx} value={lesson}>{lesson}</option>
                            ))}
                            <option value="new">+ New Lesson</option>
                        </select>

                        {selectedLesson === 'new' && (
                            <input
                                type="text"
                                value={newLesson}
                                onChange={(e) => setNewLesson(e.target.value)}
                                placeholder="Enter new lesson"
                                className="mt-2 p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        )}
                        {errors.lesson && <span className="text-red-500 text-sm mt-1">{errors.lesson.message}</span>}
                    </div>
                )}

                {/* Question Field */}
                <div className="flex flex-col">
                    <label className="text-sm text-gray-300 mb-1">Question</label>
                    <input
                        type="text"
                        {...register('question', { required: 'Question is required' })}
                        placeholder="Type your question here..."
                        className={`p-3 rounded-lg bg-gray-800 text-white border ${errors.question ? 'border-red-500' : 'border-gray-700'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                    {errors.question && <span className="text-red-500 text-sm mt-1">{errors.question.message}</span>}
                </div>

                {/* Hint Field */}
                <div className="flex flex-col">
                    <label className="text-sm text-gray-300 mb-1">Hint</label>
                    <input
                        type="text"
                        {...register('hint', { required: 'Hint is required' })}
                        placeholder="Type your hint here..."
                        className={`p-3 rounded-lg bg-gray-800 text-white border ${errors.hint ? 'border-red-500' : 'border-gray-700'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                    {errors.hint && <span className="text-red-500 text-sm mt-1">{errors.hint.message}</span>}
                </div>

                {/* Option Type */}
                <div className="flex flex-col">
                    <label className="text-sm text-gray-300 mb-1">Options Type</label>
                    <select
                        {...register('optionType', { required: 'Select option type' })}
                        className={`p-3 rounded-lg bg-gray-800 text-white border ${errors.optionType ? 'border-red-500' : 'border-gray-700'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    >
                        <option value="">Select Type</option>
                        <option value="truefalse">True / False</option>
                        <option value="four">4 Options</option>
                    </select>
                    {errors.optionType && <span className="text-red-500 text-sm mt-1">{errors.optionType.message}</span>}
                </div>

                {/* Options for 4 type */}
                {optionType === 'four' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {['optionA', 'optionB', 'optionC', 'optionD'].map((opt, idx) => (
                            <div key={opt} className="flex flex-col">
                                <label className="text-sm text-gray-300 mb-1">Option {['A', 'B', 'C', 'D'][idx]}</label>
                                <input
                                    type="text"
                                    {...register(opt, { required: `Option ${['A', 'B', 'C', 'D'][idx]} is required` })}
                                    placeholder={`Option ${['A', 'B', 'C', 'D'][idx]}`}
                                    className="p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        ))}
                    </div>
                )}

                {/* Correct Answer */}
                <div className="flex flex-col">
                    <label className="text-sm text-gray-300 mb-1">Correct Answer</label>
                    <select
                        {...register('correct', { required: 'Select the correct answer' })}
                        className={`p-3 rounded-lg bg-gray-800 text-white border ${errors.correct ? 'border-red-500' : 'border-gray-700'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    >
                        <option value="">Select Correct Answer</option>
                        {optionType === 'four' && (
                            <>
                                <option value="optionA">Option A</option>
                                <option value="optionB">Option B</option>
                                <option value="optionC">Option C</option>
                                <option value="optionD">Option D</option>
                            </>
                        )}
                        {optionType === 'truefalse' && (
                            <>
                                <option value="true">True</option>
                                <option value="false">False</option>
                            </>
                        )}
                    </select>
                    {errors.correct && <span className="text-red-500 text-sm mt-1">{errors.correct.message}</span>}
                </div>

                <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 rounded-lg hover:scale-105 transition-transform"
                >
                    <PlusCircle className="w-5 h-5" /> Add Question
                </button>
            </form>
        </div>
    ) : <Loader />;
};

export default AddQuestion;
