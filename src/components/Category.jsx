import useHomeStore from "../context/store";
import React from "react";
import { Book, ChevronLeft } from 'lucide-react';
import supabase from "../config/supabase";
import { toast } from "react-toastify";

const Category = ({ c }) => {
    const {
        setCurrentCategory,
        currentCategory,
        currentLesson,
        setCurrentLesson

    } = useHomeStore()

    const { name, image, totalquestion } = c;

    //Starting of categoru selection
    const handleStart = async () => {
        //fetch all the lessons of this categories
        const { data, error } = await supabase
            .from("questions")
            .select("lesson", { distinct: true })
            .eq('category', name)

        const newLessons = [...new Set(data.map(item => item.lesson.trim()))];

        if (newLessons.length === 0) return toast.error("no lessons")


        //setting the selected category
        setCurrentCategory({
            isSelected: true,
            name,
            lessonOptions: newLessons
        })

        // console.log("current selected category", useHomeStore.getState().currentCategory)
    }

    return (
        <div className="flex flex-col w-full md:w-[20%]
     h-[250px] overflow-hidden rounded-2xl
      bg-gray-800 shadow-lg transition-transform hover:scale-105
      cursor-pointer
      "
            onClick={handleStart}
        >

            {/* Image */}
            <img
                src={image}
                alt={name}
                className="h-[60%] w-full object-cover"
            />

            {/* Details */}
            <div className="flex flex-col justify-center p-4 w-full bg-gray-900">
                {/* Category Name */}
                <h2 className="text-white text-lg md:text-xl font-bold mb-2 truncate">
                    {name}
                </h2>

                {/* Questions Count */}
                <div className="flex items-center gap-2 text-white font-medium">
                    <Book className="w-5 h-5 text-green-400" />
                    <span>{totalquestion || 0} Questions</span>
                </div>
            </div>

        </div>
    );
};


export default Category