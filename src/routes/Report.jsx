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
        console.log(result.user)
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
  <main className="min-h-screen w-full bg-bg flex flex-col items-center justify-center gap-6 px-4 py-10 custom-scrollbar">
  <h1 className="text-2xl font-semibold">Report</h1>

  <form
    onSubmit={handleSubmit(onSubmit)}
    className="w-full max-w-md flex flex-col gap-4 text-text"
  >
    <input
      type="text"
      className="input w-full"
      placeholder="Title"
      {...register("title", { required: "Title is required" })}
    />
    {errors.title && (
      <p className="text-red-500 text-sm">{errors.title.message}</p>
    )}

    <textarea
      rows="4"
      className="input w-full resize-none"
      placeholder="Description"
      {...register("description", { required: "Description is required" })}
    ></textarea>
    {errors.description && (
      <p className="text-red-500 text-sm">{errors.description.message}</p>
    )}

    <button type="submit" className="button bg-primary w-full">
      Submit
    </button>
  </form>
</main>

  );
};

export default Report;
