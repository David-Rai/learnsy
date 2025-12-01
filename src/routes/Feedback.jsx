import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { checkUser } from "../utils/checkUser";
import { useState, useEffect } from "react";
import supabase from "../config/supabase";
import { useNavigate } from "react-router";
import useHomeStore from "../context/store";
import { MessageSquare, Send, AlertCircle, Heart } from "lucide-react";

const Feedback = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { user, setUser } = useHomeStore();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkUser().then((result) => {
      if (result.exist) {
        console.log("user valid to give feedback");
        return setUser(result.user);
      }
      console.log("user is not valid to give feedback");
      navigate("/signin");
    });
  }, []);

  const onSubmit = async (data) => {
    setIsLoading(true);
    const { title, description } = data;
    const {
      id: user_id,
      user_metadata,
    } = user;
    const username=user_metadata.name ? user_metadata.name : user_metadata.username

    const res = await supabase
      .from("feedbacks")
      .insert({ title, description, user_id, username });
    
    setIsLoading(false);
    
    if (res.error) {
      return toast.error(res.error.message);
    }
    toast.success("Feedback submitted successfully!");
    navigate("/goto_profile");
  };

  return (
<main className="h-[120vh] w-full bg-gradient-to-br from-bg via-bg to-primary/10 flex flex-col items-center justify-start gap-8 px-4 py-8 sm:py-12 custom-scrollbar relative overflow-x-hidden overflow-y-auto">

      {/* Animated background elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl animate-[float_6s_ease-in-out_infinite]"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-primary/8 rounded-full blur-3xl animate-[float_8s_ease-in-out_infinite]"></div>
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-primary/5 rounded-full blur-2xl animate-[float_7s_ease-in-out_infinite]"></div>

      {/* Header */}
      <div className="opacity-0 animate-[fadeIn_0.6s_ease-out_forwards] relative z-10 mt-4">
        <div className="flex items-center gap-3 mb-3 justify-center opacity-0 animate-[slideDown_0.6s_ease-out_0.1s_forwards]">
          <div className="relative">
            <MessageSquare className="w-8 h-8 sm:w-10 sm:h-10 text-primary animate-[pulse_2s_ease-in-out_infinite]" />
            <Heart className="w-4 h-4 text-primary absolute -top-1 -right-1 animate-[heartbeat_1.5s_ease-in-out_infinite]" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Share Your Suggestions
          </h1>
        </div>
        <p className="text-center text-text/60 text-sm sm:text-base opacity-0 animate-[fadeIn_0.6s_ease-out_0.3s_forwards]">
          We value your thoughts and suggestions
        </p>
      </div>

      {/* Form Card */}
      <div className="w-full max-w-md sm:max-w-lg flex flex-col gap-5 sm:gap-6 text-text opacity-0 animate-[slideUp_0.6s_ease-out_0.2s_forwards] relative z-10">
        <div className="bg-bg/60 backdrop-blur-2xl rounded-3xl sm:rounded-[2rem] p-6 sm:p-8 shadow-2xl border border-primary/20 transition-all duration-500 hover:shadow-primary/30 hover:border-primary/30">
          {/* Title Input */}
          <div className="mb-5 sm:mb-6 group">
            <label className="block text-text/80 text-sm font-medium mb-2 ml-1 opacity-0 animate-[fadeIn_0.6s_ease-out_0.35s_forwards]">
              Title
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/50 group-focus-within:text-primary transition-all duration-300">
                <MessageSquare className="w-5 h-5" />
              </div>
              <input
                type="text"
                className="w-full pl-12 pr-4 py-3 sm:py-4 bg-bg/50 border-2 border-primary/20 rounded-2xl transition-all duration-300 focus:ring-2 focus:ring-primary/50 focus:border-primary focus:scale-[1.02] hover:border-primary/30 opacity-0 animate-[fadeIn_0.6s_ease-out_0.4s_forwards] text-white placeholder:text-white/40"
                placeholder="Enter a descriptive title..."
                {...register("title", { required: "Title is required" })}
              />
            </div>
            {errors.title && (
              <div className="flex items-center gap-2 mt-2 text-red-500 text-sm animate-[shake_0.3s_ease-in-out]">
                <AlertCircle className="w-4 h-4" />
                <p>{errors.title.message}</p>
              </div>
            )}
          </div>

          {/* Description Textarea */}
          <div className="mb-5 sm:mb-6 group">
            <label className="block text-text/80 text-sm font-medium mb-2 ml-1 opacity-0 animate-[fadeIn_0.6s_ease-out_0.45s_forwards]">
              Description
            </label>
            <div className="relative">
              <textarea
                rows="5"
                className="w-full p-4 bg-bg/50 border-2 border-primary/20 rounded-2xl resize-none transition-all duration-300 focus:ring-2 focus:ring-primary/50 focus:border-primary focus:scale-[1.02] hover:border-primary/30 opacity-0 animate-[fadeIn_0.6s_ease-out_0.5s_forwards] sm:rows-6 text-white placeholder:text-white/40"
                placeholder="Share your experience, ideas, or suggestions..."
                {...register("description", { required: "Description is required" })}
              ></textarea>
            </div>
            {errors.description && (
              <div className="flex items-center gap-2 mt-2 text-red-500 text-sm animate-[shake_0.3s_ease-in-out]">
                <AlertCircle className="w-4 h-4" />
                <p>{errors.description.message}</p>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={isLoading}
            onClick={handleSubmit(onSubmit)}
            className="w-full py-4 rounded-2xl font-semibold text-base sm:text-lg text-white bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/40 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed opacity-0 animate-[fadeIn_0.6s_ease-out_0.6s_forwards] relative overflow-hidden group"
          >
            <span className={`flex items-center justify-center gap-2 ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}>
              <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              Submit
            </span>
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          50% { transform: translateX(8px); }
          75% { transform: translateX(-8px); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-20px) scale(1.1); }
        }

        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }
      `}</style>
    </main>
  );
};

export default Feedback;