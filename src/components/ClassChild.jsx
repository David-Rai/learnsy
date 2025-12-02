import React from "react";
import { toast } from "react-toastify";
import { useClassStore } from "../context/store";
import supabase from "../config/supabase";

// Icons
import { GraduationCap, ChevronRight, Users, BookOpen } from "lucide-react";

const ClassChild = ({ c }) => {
  const { setCurrentClass } = useClassStore();

  const handleClick = async () => {
    await fetchCategories();
  };

  const fetchCategories = async () => {
    const classId = c.id;

    const { data: links, error } = await supabase
      .from("class_category")
      .select("category_id")
      .eq("class_id", classId);

    if (error) return;

    if (!links.length) {
      // toast.info("No Subjects");
      return;
    }

    const categoryIds = links.map((item) => item.category_id);

    const { data: categories, error: catError } = await supabase
      .from("category")
      .select()
      .in("id", categoryIds);

    if (catError) return;

    setCurrentClass({
      isSelected: true,
      name: c.name,
      categories,
    });
  };

  return (
    <div
      onClick={handleClick}
      className="group relative flex flex-row sm:flex-col items-center sm:justify-between 
                 p-4 sm:p-5 md:p-6 lg:p-7 rounded-2xl cursor-pointer 
                 h-auto sm:h-60 md:h-64 lg:h-72 w-full md:w-1/3
                 bg-white/10 backdrop-blur-xl border border-white/20
                 hover:bg-white/20 hover:border-primary/50 hover:shadow-[0_0_25px_var(--color-primary)] hover:shadow-primary/20
                 transition-all duration-300 ease-out sm:hover:-translate-y-2 overflow-hidden"
    >
      {/* Hover Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r sm:bg-gradient-to-b from-primary/0 via-primary/5 to-primary/0 
                      translate-x-[-100%] sm:translate-x-0 sm:translate-y-[-100%] 
                      group-hover:translate-x-[100%] sm:group-hover:translate-y-[100%] 
                      transition-transform duration-1000 ease-in-out" />

      {/* ICON SECTION */}
      <div className="flex-shrink-0 relative z-10 mr-4 sm:mr-0 sm:flex-1 sm:flex sm:items-center sm:justify-center sm:w-full">
        <div className="flex items-center justify-center 
                        w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 
                        rounded-xl md:rounded-2xl
                        bg-gradient-to-br from-primary/20 to-primary/10 
                        border border-primary/20 group-hover:border-primary/40 
                        sm:group-hover:scale-110 transition-all duration-300 shadow-lg shadow-primary/5">
          <GraduationCap className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-primary group-hover:text-primary/80 transition-colors" />
        </div>
      </div>

      {/* TEXT SECTION */}
      <div className="flex flex-col items-start sm:items-center gap-2 sm:gap-3 md:gap-4 w-full relative z-10 min-w-0">
        {/* Class name */}
        <h1 className="text-lg sm:text-lg md:text-xl lg:text-2xl font-bold text-white tracking-wide 
                       text-left sm:text-center capitalize truncate w-full 
                       group-hover:text-primary/90 transition-colors">
          {c.name}
        </h1>

        {/* Meta info */}
        <div className="flex items-center sm:justify-center gap-2 md:gap-3 flex-wrap">
          {c.student_count > 0 && (
            <span className="flex items-center gap-1.5 px-2.5 py-1 md:px-3 md:py-1.5 rounded-full 
                           bg-black/20 border border-white/5 text-xs md:text-sm font-medium text-gray-300 
                           group-hover:bg-black/40 transition-colors">
              <Users className="w-3 h-3 md:w-4 md:h-4 text-primary" />
              {c.student_count}
            </span>
          )}

          {c.category_count > 0 && (
            <span className="flex items-center gap-1.5 px-2.5 py-1 md:px-3 md:py-1.5 rounded-full 
                           bg-black/20 border border-white/5 text-xs md:text-sm font-medium text-gray-300 
                           group-hover:bg-black/40 transition-colors">
              <BookOpen className="w-3 h-3 md:w-4 md:h-4 text-primary/80" />
              {c.category_count} <span className="hidden sm:inline">Subjects</span>
            </span>
          )}
        </div>
      </div>

      {/* Decorative background element (Desktop only) */}
      <div className="hidden sm:block absolute -bottom-10 -right-10 w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 
                      bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-colors duration-500" />

      {/* Mobile Arrow */}
      <ChevronRight className="sm:hidden w-5 h-5 text-gray-500 group-hover:text-primary ml-auto transition-colors" />
    </div>
  );
};

export default ClassChild;
