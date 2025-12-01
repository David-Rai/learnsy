import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { checkUser } from "../utils/checkUser";
import { useState, useEffect } from "react";
import supabase from "../config/supabase";
import { useNavigate } from "react-router";
import useHomeStore from "../context/store";

const Report = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { user, setUser } = useHomeStore();

  //checking user
  useEffect(() => {
    checkUser().then((result) => {
      if (result.exist) {
        console.log("user valid to report");
        return setUser(result.user);
      }
      console.log("user is not valid to report");
      navigate("/signin");
    });
  }, []);

  //Sending to the backend
  const onSubmit = async (data) => {
    const { title, description } = data;
    const {
      id: user_id,
      user_metadata: { username },
    } = user;
    const res = await supabase
      .from("reports")
      .insert({ title, description, user_id, username });
    if (res.error) {
      return toast.error(res.error.message);
    }
    toast.success("successfully added");
    navigate("/goto_profile");
  };

  return (
    <main
      className="h-full w-full bg-bg flex items-center
    flex-col gap-4
    justify-center custom-scrollbar md:h-full"
    >
      <h1 className="text-xl">Report</h1>

      {/* Title and description */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="rounded-md 
      text-text flex flex-col items-center justify-center px-2
      gap-5
      "
      >
        <input
          type="text"
          className="input"
          placeholder="Title"
          {...register("title", { required: "Title is required" })}
        />
        {errors.title && (
          <p className="text-red-500  w-full">{errors.title.message}</p>
        )}
        <textarea
          rows="4"
          cols="50"
          className="input"
          placeholder="Description"
          {...register("description", { required: "Description is required" })}
        ></textarea>
        {errors.description && (
          <p className="text-red-500 w-full">{errors.description.message}</p>
        )}
        <button type="submit" className="button bg-primary">
          Submit
        </button>
      </form>
    </main>
  );
};

export default Report;
