import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router";
import { useNavigate } from "react-router";
import supabase from "../config/supabase";
import { getStats } from "../utils/getStats";
import Loader from "../components/Loader";
import avatar from "../../public/profiles/1.jpg";

const StatBar = React.memo(({ label, value, max = 100, type, delay = 0 }) => {
  const [animatedPercentage, setAnimatedPercentage] = useState(0);

  useEffect(() => {
    const percentage = Math.min((parseFloat(value) / max) * 100, 100);
    const timer = setTimeout(() => setAnimatedPercentage(percentage), delay);
    return () => clearTimeout(timer);
  }, [value, max, delay]);

  const colorMap = {
    primary: "var(--color-primary)",
    right: "var(--color-right)",
    wrong: "var(--color-wrong)",
  };

  return (
    <div className="w-full p-4 bg-[var(--color-secondary)] rounded-lg hover:bg-opacity-80 transition-all duration-300">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-[var(--color-text)]">
          {label}
        </span>
        <span className="text-sm font-semibold text-[var(--color-text)]">
          {value}
        </span>
      </div>
      <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{
            width: `${animatedPercentage}%`,
            backgroundColor: colorMap[type],
          }}
        />
      </div>
    </div>
  );
});

const Profile = () => {
  const navigate=useNavigate()
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const { user_id } = useParams();
  const [loading, setLoading] = useState(true);

  //Fetching User data
  const fetchUserData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("board")
        .select()
        .eq("user_id", user_id);

      if (error) {
        console.log(error);
      }

      if (data) {
        setUser(data[0]);
        const userStats = await getStats(data[0].user_id);
        setStats(userStats);
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const statConfigs = [
    {
      label: "Accuracy",
      value: stats?.accuracy ? `${stats.accuracy.toFixed(1)}%` : "0%",
      type: "primary",
      max: 100,
      delay: 100,
    },
    {
      label: "Total Questions",
      value: stats?.total || 0,
      type: "primary",
      max: Math.max(stats?.total || 0, 100),
      delay: 200,
    },
    {
      label: "Correct Answers",
      value: stats?.correct || 0,
      type: "right",
      max: Math.max(stats?.total || 0, 100),
      delay: 300,
    },
    {
      label: "Wrong Answers",
      value: stats?.wrong || 0,
      type: "wrong",
      max: Math.max(stats?.total || 0, 100),
      delay: 400,
    },
    {
      label: "Total Points",
      value: stats?.point || 0,
      type: "primary",
      max: Math.max(stats?.point || 0, 1000),
      delay: 500,
    },
  ];
  
  const handleReport=()=>{
 navigate("/report")
  }
  const handleFeedback=()=>{
   navigate('/feedback')
  }

  return !user?.id ? (
    <Loader />
  ) : (
    <main className="h-full bg-bg text-text flex">
      <div className="flex-1 flex flex-col h-full">
        <section className="flex-1 md:px-8 py-6 md:py-8 overflow-y-scroll custom-scrollbar">
          <div className="max-w-5xl mx-auto">
            <div className="rounded-3xl shadow-2xl p-4 md:p-8 lg:p-10">
              <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-12">
                {/* LEFT — Profile */}
                <section className="flex flex-col items-center lg:items-start lg:w-1/3">
                  {/* Avatar */}
                  <div className="relative group">
                    <div className="absolute inset-0 bg-[var(--color-primary)] rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
                    <img
                      src={user?.avatar || avatar}
                      alt="Profile"
                      className="relative rounded-full w-32 h-32 md:w-40 md:h-40 object-cover border-4 border-[var(--color-primary)] shadow-xl"
                    />
                  </div>

                  {/* Username */}
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mt-6 mb-2 capitalize text-center lg:text-left drop-shadow-lg">
                    {user?.username || "Anonymous"}
                  </h2>

                  {/* Rank */}
                  <div className="flex items-center gap-2 bg-primary px-3 py-2 text-white rounded-full font-bold text-sm md:text-base shadow-lg">
                    <span>🏆</span>
                    <span>Rank #{stats?.rank || "N/A"}</span>
                  </div>
                    <i className="py-2 text-gray-400">Give me your reports,suggestions</i>
                  {/* NEW BUTTONS */}
                  <div className="flex gap-3 t-2 ">
                    {/* Report Button */}
                    <button
                      onClick={handleReport}
                      className="px-4 py-2 cursor-pointer bg-red-500 text-white rounded-full text-sm font-semibold shadow-lg hover:bg-red-600 transition"
                    >
                      Report
                    </button>

                    {/* Feedback Button */}
                    <button
                      onClick={handleFeedback}
                      className="px-4 pb-2 hover:cursor-pointer bg-primary text-white rounded-full text-sm font-semibold shadow-lg hover:bg-primary-dark transition"
                    >
                      Suggestion
                    </button>
                  </div>
                </section>

                {/* RIGHT — Stats */}
                <section className="lg:w-2/3 w-full max-w-2xl grid grid-cols-1 gap-4 md:gap-5">
                  {statConfigs.map((stat) => (
                    <StatBar key={stat.label} {...stat} />
                  ))}
                </section>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Profile;
