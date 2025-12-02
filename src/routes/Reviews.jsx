import React, { useEffect, useState } from "react";
import supabase from "../config/supabase";

const Reviews = () => {
  const [reports, setReports] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const { data: reportsData } = await supabase.from("reports").select("*");
      const { data: feedbacksData } = await supabase.from("feedbacks").select("*");

      setReports(reportsData || []);
      setFeedbacks(feedbacksData || []);
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) return <div className="text-center py-10">Loading...</div>;

const Card = ({ item }) => (
  <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 w-full sm:w-[45%] md:w-[30%] m-2">
    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
      {item.username}
    </h4>

    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-1">
      {item.title}
    </h3>

    <p className="text-gray-600 dark:text-gray-400 mt-3">
      {item.description}
    </p>
  </div>
);


  return (
    <main className="min-h-screen w-full bg-bg text-text overflow-y-scroll custom-scrollbar p-4 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-8">Reviews & Reports</h1>

      <div className="flex flex-wrap justify-center mb-10">
        <div className="bg-blue-500 text-white rounded-lg px-4 py-2 m-2">
          Reports: {reports.length}
        </div>
        <div className="bg-green-500 text-white rounded-lg px-4 py-2 m-2">
          Feedbacks: {feedbacks.length}
        </div>
      </div>

      {/* Reports Section */}
      <section className="w-full max-w-5xl mb-10">
        <h2 className="text-xl font-semibold mb-4">Reports</h2>
        <div className="flex flex-wrap justify-center">
          {reports.map((item) => (
            <Card key={item.id} item={item} />
          ))}
        </div>
      </section>

      {/* Feedbacks Section */}
      <section className="w-full max-w-5xl">
        <h2 className="text-xl font-semibold mb-4">Feedbacks</h2>
        <div className="flex flex-wrap justify-center">
          {feedbacks.map((item) => (
            <Card key={item.id} item={item} />
          ))}
        </div>
      </section>
    </main>
  );
};

export default Reviews;
  