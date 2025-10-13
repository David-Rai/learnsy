import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import getCategories from '../../utils/supabase/getCategories';
import supabase from '../../config/supabase';
import checkMember from '../../utils/checkMember';
import { CircleUser } from 'lucide-react';
import useHomeStore, { useMemberStore } from '../../context/store';
import Loader from '../../components/Loader';
import { useForm } from 'react-hook-form';

const Member = () => {
  const navigate = useNavigate();
  const { categories } = useHomeStore();
  const { question_count, setQuestionCount, uploads = [], setUploads } = useMemberStore();
  const upload_count = uploads.length || 0
  const [isChecked, setIsChecked] = useState(false);
  const [editing, setEditing] = useState(null);

  const { register, handleSubmit, reset } = useForm();

  useEffect(() => { check(); }, []);

  const check = async () => {
    const res = await checkMember();
    if (!res) return navigate('/');
    setIsChecked(true);
    if (categories.length === 0) getCategories();
    if (question_count === 0) getQuestions();
    if (uploads.length === 0) getYourUploads();
  };

  const getQuestions = async () => {
    const { count } = await supabase.from("questions").select("*", { count: 'exact' });
    if (!count) return;
    setQuestionCount(count);
  };

  const getYourUploads = async () => {
    const { user } = useHomeStore.getState();
    const memberId = user.id;
    const { data, error } = await supabase.from('questions').select('*').eq('uploaded_by', memberId);
    if (error) return;
    if (data) setUploads(data);
  };

  const handleEdit = (item) => {
    setEditing(item);
    reset(item); // populate react-hook-form
  };

  const handleClose = () => setEditing(null);

  const onSubmit = async (data) => {
    const { id, q, category, lesson, hint } = data;
    const { error } = await supabase
      .from('questions')
      .update({ q, category, lesson, hint })
      .eq('id', id);
    if (error) return;
    setUploads(prev => prev.map(item => item.id === id ? { ...item, q, category, lesson, hint } : item));
    setEditing(null);
  };

  return isChecked ? (
    <main className='h-full w-full bg-bg overflow-y-scroll custom-scrollbar'>

      {/* Total categories,questions */}
      <section className='w-full h-[40%] flex items-center justify-center py-4 gap-x-4 text-gray-300'>

        {/* total categories  */}
        <div className='group relative h-full w-[30%] bg-gradient-to-br from-secondary to-secondary/50 rounded-2xl flex items-center justify-center overflow-hidden border border-transparent hover:border-primary/20 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1'>
          <div className='absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
          <div className='h-full w-[40%] flex items-center justify-center relative z-10'>
            <div className='relative'>
              <CircleUser className='size-20 text-primary transition-all duration-500 group-hover:scale-110 group-hover:rotate-6' />
              <div className='absolute inset-0 bg-primary/20 blur-2xl rounded-full scale-0 group-hover:scale-150 transition-transform duration-700' />
            </div>
          </div>
          <div className='flex flex-col h-full w-[60%] justify-center gap-1 items-start relative z-10 pr-4'>
            <p className='text-sm text-muted-foreground font-medium uppercase tracking-wide'>Total Categories</p>
            <h1 className='text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent transition-all duration-500 group-hover:scale-110 origin-left'>
              {categories.length > 0 ? <span className='inline-block tabular-nums'>{categories.length}</span> : '0'}
            </h1>
          </div>
          <div className='absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700' />
        </div>

        {/* total questions */}
        <div className='group relative h-full w-[30%] bg-gradient-to-br from-secondary to-secondary/50 rounded-2xl flex items-center justify-center overflow-hidden border border-transparent hover:border-green-500/20 transition-all duration-500 hover:shadow-2xl hover:shadow-green-500/10 hover:-translate-y-1'>
          <div className='absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
          <div className='h-full w-[40%] flex items-center justify-center relative z-10'>
            <div className='relative'>
              <CircleUser className='size-20 text-green-500 transition-all duration-500 group-hover:scale-110 group-hover:-rotate-6' />
              <div className='absolute top-2 right-2 w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50' />
              <div className='absolute inset-0 bg-green-500/20 blur-2xl rounded-full scale-0 group-hover:scale-150 transition-transform duration-700' />
            </div>
          </div>
          <div className='flex flex-col h-full w-[60%] justify-center gap-1 items-start relative z-10 pr-4'>
            <p className='text-sm text-muted-foreground font-medium uppercase tracking-wide'>Total Questions</p>
            <h1 className='text-4xl font-bold bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent transition-all duration-500 group-hover:scale-110 origin-left'>
              <span className='inline-block tabular-nums'>{question_count}</span>
            </h1>
          </div>
          <div className='absolute top-0 right-0 w-24 h-24 bg-green-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700' />
        </div>

        {/* your upload count */}
        <div className='group relative h-full w-[30%] bg-gradient-to-br from-secondary to-secondary/50 rounded-2xl flex items-center justify-center overflow-hidden border border-transparent hover:border-green-500/20 transition-all duration-500 hover:shadow-2xl hover:shadow-green-500/10 hover:-translate-y-1'>
          <div className='absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
          <div className='h-full w-[40%] flex items-center justify-center relative z-10'>
            <div className='relative'>
              <CircleUser className='size-20 text-purple-500 transition-all duration-500 group-hover:scale-110 group-hover:-rotate-6' />
              <div className='absolute top-2 right-2 w-3 h-3 bg-purple-400 rounded-full animate-pulse shadow-lg shadow-green-400/50' />
              <div className='absolute inset-0 bg-green-500/20 blur-2xl rounded-full scale-0 group-hover:scale-150 transition-transform duration-700' />
            </div>
          </div>
          <div className='flex flex-col h-full w-[60%] justify-center gap-1 items-start relative z-10 pr-4'>
            <p className='text-sm text-muted-foreground font-medium uppercase tracking-wide'>Total Uploads</p>
            <h1 className='text-4xl font-bold bg-gradient-to-r from-purple-500 to-purple-600 bg-clip-text text-transparent transition-all duration-500 group-hover:scale-110 origin-left'>
              <span className='inline-block tabular-nums'>{upload_count}</span>
            </h1>
          </div>
          <div className='absolute top-0 right-0 w-24 h-24 bg-green-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700' />
        </div>
      </section>


      {/* Add question page navigate */}
      <div>
        <button onClick={() => navigate('/addQuestion')} className='option-button'>Add Question</button>
      </div>


      {/* Your uploads section */}
      <section className="p-4 w-full">
        <h1 className="text-2xl font-bold mb-4">Your uploads</h1>
        <div className="space-y-4">
          {uploads.length > 0 ? (
            uploads.map((item) => (
              <div key={item.id} className="border rounded-lg p-4 shadow-sm bg-white relative">
                <h2 className="text-lg font-semibold">{item.q}</h2>
                <p className="text-sm text-gray-600 mb-2">Category: <span className="font-medium">{item.category}</span> | Lesson: <span className="font-medium">{item.lesson}</span></p>
                <p className="text-sm text-gray-500 mb-2">Hint: {item.hint}</p>
                <div className="flex flex-wrap gap-2 mb-2">
                  {item.options.map((opt, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 rounded text-sm">{opt}</span>
                  ))}
                </div>
                <p className="text-xs text-gray-400">Uploaded: {new Date(item.created_at).toLocaleString()}</p>
                <button onClick={() => handleEdit(item)} className="absolute top-2 right-2 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">Edit</button>
              </div>
            ))
          ) : (
            <p className="text-gray-500">You haven’t uploaded any questions yet.</p>
          )}
        </div>
      </section>

      {/* Edit section */}
      {editing && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={handleClose}></div>
          <form onSubmit={handleSubmit(onSubmit)} className="relative bg-white rounded-lg p-6 w-full max-w-md z-10 shadow-lg space-y-4">
            <h2 className="text-xl font-bold">Edit Question</h2>
            <input type="hidden" {...register("id")} />
            <div className="space-y-2">
              <label className="block text-sm font-medium">Question</label>
              <input type="text" {...register("q")} className="w-full border px-3 py-2 rounded" />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">Category</label>
              <input type="text" {...register("category")} className="w-full border px-3 py-2 rounded" />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">Lesson</label>
              <input type="text" {...register("lesson")} className="w-full border px-3 py-2 rounded" />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">Hint</label>
              <input type="text" {...register("hint")} className="w-full border px-3 py-2 rounded" />
            </div>
            <div className="flex justify-end space-x-2">
              <button type="button" onClick={handleClose} className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400">Cancel</button>
              <button type="submit" className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600">Save</button>
            </div>
          </form>
        </div>
      )}

    </main>
  ) : <Loader />;
};

export default Member;
