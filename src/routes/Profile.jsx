import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router";
import supabase from "../config/supabase";
import useHomeStore from "../context/store";
import { getStats } from "../utils/getStats";
import Loader from "../components/Loader";
import BottomNav from "../components/BottomNav";
import Sidebar from "../components/Sidebar";
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
        <span className="text-sm font-medium text-[var(--color-text)]">{label}</span>
        <span className="text-sm font-semibold text-[var(--color-text)]">{value}</span>
      </div>
      <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${animatedPercentage}%`, backgroundColor: colorMap[type] }}
        />
      </div>
    </div>
  );
});

const BackIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const MenuIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01" />
  </svg>
);

const MobileHeader = ({ username, onBack, onMenu }) => (
  <nav className="md:hidden w-full h-16 flex items-center justify-between px-4 border-b border-gray-700 bg-[var(--color-bg)]">
    <button onClick={onBack} className="p-2 hover:bg-[var(--color-secondary)] rounded-lg transition-colors duration-200">
      <BackIcon />
    </button>
    <h1 className="text-lg font-semibold text-[var(--color-text)] truncate max-w-[140px]">{username}</h1>
    <button onClick={onMenu} className="p-2 hover:bg-[var(--color-secondary)] rounded-lg transition-colors duration-200">
      <MenuIcon />
    </button>
  </nav>
);

const Profile = () => {
  const { user, setUser } = useHomeStore();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = useCallback(async () => {
    try {
      setLoading(true);
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (currentUser) {
        setUser(currentUser);
        const userStats = await getStats(currentUser.id);
        setStats(userStats);
      } else {
        navigate("/signup");
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
    } finally {
      setLoading(false);
    }
  }, [setUser, navigate]);

  useEffect(() => { fetchUserData(); }, [fetchUserData]);

  const handleBack = () => navigate(-1);
  const handleMenu = () => console.log('Menu clicked');

  if (loading) return <Loader />;

  const statConfigs = [
    { label: "Accuracy", value: stats?.accuracy ? `${stats.accuracy.toFixed(1)}%` : '0%', type: 'primary', max: 100, delay: 100 },
    { label: "Total Questions", value: stats?.total || 0, type: 'primary', max: Math.max(stats?.total || 0, 100), delay: 200 },
    { label: "Correct Answers", value: stats?.correct || 0, type: 'right', max: Math.max(stats?.total || 0, 100), delay: 300 },
    { label: "Wrong Answers", value: stats?.wrong || 0, type: 'wrong', max: Math.max(stats?.total || 0, 100), delay: 400 },
    { label: "Total Points", value: stats?.point || 0, type: 'primary', max: Math.max(stats?.point || 0, 1000), delay: 500 },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] flex">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen">
        {/* <MobileHeader username={user?.user_metadata?.username} onBack={handleBack} onMenu={handleMenu} /> */}
        <main className="flex-1 px-4 md:px-8 py-6 md:py-8 overflow-y-scroll custom-scrollbar">
          <div className="max-w-5xl mx-auto">
            <div className="bg-secondary rounded-3xl shadow-2xl p-6 md:p-8 lg:p-10 border-b-4 border-gray-800">
              <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-12">
                <div className="flex flex-col items-center lg:items-start lg:w-1/3">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-[var(--color-primary)] rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
                    <img
                      src={user?.user_metadata?.avatar || avatar}
                      alt="Profile"
                      className="relative rounded-full w-32 h-32 md:w-40 md:h-40 object-cover border-4 border-[var(--color-primary)] shadow-xl"
                    />
                  </div>
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mt-6 mb-2 text-center lg:text-left drop-shadow-lg">
                    {user?.user_metadata?.username || user?.user_metadata?.full_name || 'Anonymous'}
                  </h2>
                  <div className="flex items-center gap-2 bg-[var(--color-primary)] text-white px-4 py-2 rounded-full font-bold text-sm md:text-base shadow-lg border-b-4 border-purple-700">
                    <span>🏆</span>
                    <span>Rank #{stats?.rank || 'N/A'}</span>
                  </div>
                </div>
                <div className="lg:w-2/3 w-full max-w-2xl grid grid-cols-1 gap-4 md:gap-5">
                  {statConfigs.map(stat => (
                    <StatBar key={stat.label} {...stat} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
        <div className="md:hidden"><BottomNav /></div>
      </div>
    </div>
  );
};

export default Profile;
