import React, { useState, useEffect, lazy } from "react";
import { useMemo } from "react";
import ClassChild from "../components/ClassChild.jsx";
import { ToastContainer } from "react-toastify";
import useHomeStore, { useClassStore } from "../context/store.js";
import Loader from "../components/Loader.jsx";
import supabase from "../config/supabase.js";
import AllCategories from "../components/AllCategories.jsx";

const NewExplore = () => {
  const {currentClass}=useClassStore()
  const { allClasses, setClasses } = useClassStore();

  const [searchTerm, setSearchTerm] = useState(""); // state for search

  // Initially fetching all the classes
  useEffect(() => {
    if (allClasses.length === 0) {
      getAllClasses();
    }
  }, []);

  //Fetching all classes
  const getAllClasses = async () => {
    const {data,error} = await supabase.from("class").select().order('type',{assending:true})

    if(error){
      return setClasses([])
    }
    setClasses(data)
    // console.log("All classes",data);
  };



  //Filtering the classes on search parameters
  const filteredClasses = useMemo(() => {
    return allClasses.filter((c) =>
      c.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allClasses, searchTerm]);


  return (
    <main className="h-full bg-bg w-full flex flex-col overflow-hidden">
      {
         currentClass.isSelected ? 
          (<AllCategories/>)
          :
          (
        <div className="h-full flex flex-col overflow-hidden">
          {/* Search Bar */}
          <header className="flex-shrink-0 bg-secondary px-4 py-4 md:py-6 shadow-lg">
            <div className="max-w-4xl mx-auto">
              <input
                type="text"
                placeholder="Search class..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 md:py-4 rounded-2xl border-b-4 border-gray-700 text-white bg-bg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary transition-all text-base md:text-lg font-medium"
              />
            </div>
          </header>

          {/* All Classes Section */}
          <section className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="p-4 md:p-6">
              {filteredClasses.length > 0 ? (
                <div className="flex flex-col md:flex-row md:flex-wrap md:gap-5 gap-3 md:gap-4 justify-center max-w-6xl mx-auto">
                  {filteredClasses.map((c, index) => (
                    <ClassChild c={c} key={c.id || index} />
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-32 md:h-40">
                  <Loader />
                </div>
              )}
            </div>
          </section>
        </div>
        )}

      <ToastContainer autoClose={200} />
    </main>
  );
};

export default NewExplore;
