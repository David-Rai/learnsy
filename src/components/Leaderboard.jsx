// Leaderboard.jsx
import { ChevronDown } from "lucide-react";
import React, { useEffect } from "react";
import supabase from "../config/supabase";
import { Trophy } from "lucide-react";
import { useLeaderStore } from "../context/store";
import TopLeader from "./leaders/TopLeaders";
import MidLeader from "./leaders/MidLeaders";
import Loader from "./Loader";

const Leaderboard = () => {
  const leaders = useLeaderStore((state) => state.leaders) || [];
  const setLeaders = useLeaderStore((state) => state.setLeaders);
  const rankedLeaders = leaders.map((user) => {
    const correct = user.total_questions - user.wrong_questions;
    const accuracy = (correct / user.total_questions) * 100; // Accuracy %

    // Combined score: 70% points + 30% accuracy
    const rankScore = user.points * 0.7 + accuracy * 0.3;

    return { ...user, accuracy, rankScore };
  });

  // Fetch leaderboard once on mount
  useEffect(() => {
    if (leaders.length === 0) fetchLeaders();
  }, [leaders.length, setLeaders]);

  //Fetch leaders
  const fetchLeaders = async () => {
    try {
      const { data, error } = await fetchLeadersRPC();
      if (error) {
        console.error(error);
        return;
      }
      setLeaders(data);
      const increaseFetchLimit = useLeaderStore.getState().increaseFetchLimit;
      increaseFetchLimit();
    } catch (err) {
      console.error(err);
    }
  };

  // RPC call to Supabase
  const fetchLeadersRPC = async () => {
    const FETCH_LIMIT = useLeaderStore.getState().FETCH_LIMIT;
    return await supabase.rpc("get_leaderboard_stats").limit(FETCH_LIMIT + 5);
  };

  //loader
  if (leaders.length === 0) {
    return <Loader />;
  }

  //Rendder more
  const handleRenderMore = () => {
    fetchLeaders();
  };

  return (
  <main className="h-full bg-bg text-text md:flex md:pb-0">
  <div className="h-full md:h-full pb-6 overflow-x-hidden custom-scrollbar w-full">
    {/* Header */}
    <header className="bg-secondary shadow-lg py-6 md:py-8 px-4 mb-6">
      <div className="max-w-4xl mx-auto text-center">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="p-3 bg-bg rounded-full shadow-xl border-b-4 border-yellow-600">
            <Trophy className="w-8 h-8 md:w-10 md:h-10 text-yellow-400" />
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-yellow-400 drop-shadow-lg">
            Leaderboard
          </h1>
        </div>
        <p className="text-sm md:text-base text-gray-300 font-medium">
          Top performers this season
        </p>
      </div>
  </header>

    {/* Leaders List */}
    <section className="px-4 mb-6">
      {/* Top Leader */}
      {rankedLeaders[0] && <TopLeader l={rankedLeaders[0]} rank={1} />}

      {/* Other Leaders */}
      <div className="flex flex-col gap-3 mt-4">
        {rankedLeaders.slice(1).map((l, index) => (
          <MidLeader key={index} l={l} rank={index + 2} />
        ))}
      </div>
    </section>

    {/* Load More Button */}
    <div className="px-4 pb-4">
      <button
        onClick={handleRenderMore}
        className="w-full max-w-4xl mx-auto py-3 px-6 bg-secondary hover:bg-opacity-80 text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
      >
        <ChevronDown className="w-5 h-5" />
        <span>Load More</span>
      </button>
    </div>
  </div>
</main>
  );
};

export default Leaderboard;
