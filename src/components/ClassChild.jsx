import React from "react";
import { toast } from "react-toastify";
import { useClassStore } from "../context/store";
import supabase from "../config/supabase";

// Rendering Each class node
const ClassChild = ({ c }) => {
  const { setCurrentClass } = useClassStore();

  //On Click of any Class
  const handleClick = async () => {
    fetchCategories()
  };

  //Fetching All categories
  const fetchCategories=async ()=>{
    const class_id = c.id;
    //Fetch the categories of this class from db
    const { error, data } = await supabase
      .from("class_category")
      .select("category_id")
      .eq("class_id", class_id);

    if (error) {
      return;
    }

    if(data.length === 0){
      return toast.info("No Subjects")
    }

    const ids = data.map((d) => d.category_id);

    const res = await supabase.from("category").select().in("id", ids);
    if(res.error) return

    //setting the currentClass and rendering it
    setCurrentClass({
      isSelected:true,
      name:c.name,
      categories:res.data
    })
    // console.log(res.data)
    
  }
  return (
    <>
      <div
        className="flex bg-secondary py-3 pl-3 rounded-md cursor-pointer"
        onClick={handleClick}
      >
        <h1 className="text-text capitalize">{c.name}</h1>
      </div>
    </>
  );
};

export default ClassChild;
