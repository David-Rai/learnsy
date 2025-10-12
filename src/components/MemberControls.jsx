import { useNavigate } from 'react-router';
import { LayoutDashboard } from 'lucide-react';
import React from 'react';
import useHomeStore from '../context/store';

const MemberControls = () => {
  const navigate = useNavigate()
  const { setActiveTab, activeTab } = useHomeStore()

  return (
    <div className='w-full'>

      {/* Member main section */}
      <button
        key='member'
        onClick={() => {
          setActiveTab('member');
          navigate('/member');
        }}
        className={`flex items-center gap-3 py-3 w-full px-4 mb-2 rounded-lg transition-colors cursor-pointer ${activeTab === 'member'
          ? "text-text bg-primary"
          : "text-gray-400 hover:text-white hover:bg-gray-800"
          }`}
      >
        <span className="text-lg"><LayoutDashboard /></span>
        <span className="font-medium">Member</span>
      </button>
    </div>
  )
}

export default MemberControls
