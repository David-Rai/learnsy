import React, { useEffect, useState } from "react";
import supabase from "../config/supabase";

const Reviews = () => {
  const [reports, setReports] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: reportsData, error: reportsError } = await supabase
        .from("reports")
        .select("*");
      const { data: feedbacksData, error: feedbacksError } = await supabase
        .from("feedbacks")
        .select("*");

      if (!reportsError) setReports(reportsData);
      if (!feedbacksError) setFeedbacks(feedbacksData);
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) return <div className="text-center py-10">Loading...</div>;

  const renderCard = (item) => (
    <div
      key={item.id}
      className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 w-full sm:w-[45%] md:w-[30%] m-2 flex flex-col"
    >
      <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">{item.username}</h3>
      <h4 className="font-medium text-gray-700 dark:text-gray-300">{item.title}</h4>
      <p className="text-gray-600 dark:text-gray-400 mt-2">{item.description}</p>
    </div>
  );

  return (
    <main className="min-h-screen w-full bg-bg text-text p-4 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">Reviews & Reports</h1>

      <div className="flex flex-wrap justify-center mb-6">
        <div className="bg-blue-500 text-white rounded-lg px-4 py-2 m-2">
          Reports: {reports.length}
        </div>
        <div className="bg-green-500 text-white rounded-lg px-4 py-2 m-2">
          Feedbacks: {feedbacks.length}
        </div>
      </div>

      <div className="flex flex-wrap justify-center w-full">
        {reports.map(renderCard)}
        {feedbacks.map(renderCard)}
      </div>
    </main>
  );
};

export default Reviews;
