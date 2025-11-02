import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { useRef } from "react";
import supabase from "../../config/supabase";
import checkAdmin from "../../utils/checkAdmin";
import { CircleUser, Trash, Users } from "lucide-react";

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const newRoleRef = useRef(null);
  const [isRoleChanging, setIsRoleChanging] = useState({
    status: false,
    selected_user: null,
  });
  const members =
    users.length > 0 ? users.filter((u) => u.role === "member") : 0;
  const total_members = members.length;

  const check = async () => {
    const res = await checkAdmin();
    if (!res) return navigate("/");
    getAllAuthUsers();
  };

  useEffect(() => {
    check();
  }, []);

  async function getAllAuthUsers() {
    console.log("getting users data")
    const { data, error } = await supabase
      .from("board")
      .select("*")
      .order("point", { ascending: false });
    if (error) {
      console.error("Error fetching auth users:", error);
      return [];
    }
    setUsers(data);
  }

  const handleDelete = async (userId) => {
    try {
      const { error: rpcError } = await supabase.rpc("delete_user_cascade", {
        uid: userId,
      });
      if (rpcError) throw rpcError;
      const { error: authError } = await supabase.auth.admin.deleteUser(userId);
      if (authError) throw authError;

      getAllAuthUsers();
      console.log("User deleted successfully");
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  const filteredUsers = users.filter((u) =>
    (u.username || "").toLowerCase().includes(search.toLowerCase())
  );

  const toggleChangeRole = (u) => {
    setIsRoleChanging({ status: !isRoleChanging.status, selected_user: u });
  };

  const changeRole = async (u) => {
    const { user_id } = u;
    const newRole = newRoleRef.current.value;
    if (newRoleRef.current) {
      const { error, data } = await supabase
        .from("board")
        .update({ role: newRole })
        .eq("user_id", user_id);

      if (error) {
        return toast.error(error.message);
      }

      toggleChangeRole(null)
      toast.success("successfully updated");
      getAllAuthUsers()
    }
  };
  return (
    <main className="h-full w-full flex flex-row custom-scrollbar">
      <main className="h-full w-full flex flex-col overflow-y-scroll curstom-scrollbar">
        {/* User data */}
        <section className="w-full min-h-[40%] flex items-center justify-center py-4 gap-x-4 text-gray-300">
          <div className="h-full w-[30%] bg-secondary rounded-2xl flex items-center justify-center border border-primary/10">
            <div className="h-full w-[40%] flex items-center justify-center">
              <CircleUser className="size-16 text-primary" />
            </div>
            <div className="flex flex-col h-full w-[60%] justify-center gap-1 items-start pr-4">
              <p className="text-sm text-muted-foreground font-medium uppercase tracking-wide">
                Total users
              </p>
              <h1 className="text-4xl font-bold text-foreground">
                {users.length > 0 ? users.length : "0"}
              </h1>
            </div>
          </div>

          <div className="h-full w-[30%] bg-secondary rounded-2xl flex items-center justify-center border border-green-500/10">
            <div className="h-full w-[40%] flex items-center justify-center">
              <CircleUser className="size-16 text-green-500" />
            </div>
            <div className="flex flex-col h-full w-[60%] justify-center gap-1 items-start pr-4">
              <p className="text-sm text-muted-foreground font-medium uppercase tracking-wide">
                Active Now
              </p>
              <h1 className="text-4xl font-bold text-green-500">
                {total_members}
              </h1>
            </div>
          </div>

          <div className="h-full w-[30%] bg-secondary rounded-2xl flex items-center justify-center border border-blue-500/10">
            <div className="h-full w-[40%] flex items-center justify-center">
              <CircleUser className="size-16 text-blue-500" />
            </div>
            <div className="flex flex-col h-full w-[60%] justify-center gap-1 items-start pr-4">
              <p className="text-sm text-muted-foreground font-medium uppercase tracking-wide">
                This Week
              </p>
              <h1 className="text-4xl font-bold text-blue-500">
                {users.length > 0 ? Math.floor(users.length * 0.15) : 0}
              </h1>
            </div>
          </div>
        </section>

        {/* All users */}
        <section className="flex w-full flex-col gap-6 pl-5">
          <div className="flex items-center justify-between w-[65%]">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-foreground">All Users</h1>
              <div className="px-3 py-1 bg-primary/10 rounded-full">
                <span className="text-sm font-medium text-primary">
                  {users.length}
                </span>
              </div>
            </div>
            <input
              type="text"
              placeholder="Search user..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-3 py-2 rounded-md bg-secondary text-white text-sm outline-none border border-primary/10 w-48 text-foreground"
            />
          </div>

          {filteredUsers.length > 0 ? (
            <div className="flex flex-col gap-3">
              {filteredUsers.map((u, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-secondary/50 py-4 px-5 rounded-xl w-[65%] border border-primary/10"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`
                      flex items-center justify-center w-12 h-12 rounded-full font-bold text-sm
                      ${index === 0 ? "bg-yellow-500 text-yellow-950" : ""}
                      ${index === 1 ? "bg-gray-400 text-gray-900" : ""}
                      ${index === 2 ? "bg-amber-700 text-amber-50" : ""}
                      ${index > 2 ? "bg-primary/10 text-primary" : ""}
                    `}
                    >
                      #{index + 1}
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="font-semibold text-base text-foreground text-white">
                        {u.username || "Unnamed"}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-primary/10 text-xs font-medium text-primary">
                          {u.role}
                        </span>
                        <button
                          className="text-white cursor-pointer"
                          onClick={() => toggleChangeRole(u)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            class="lucide lucide-square-pen-icon lucide-square-pen"
                          >
                            <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="flex flex-col items-end">
                      <span className="text-xs text-muted-foreground uppercase tracking-wide text-white">
                        Points
                      </span>
                      <span className="text-xl font-bold text-primary">
                        {u.point?.toLocaleString() || 0}
                      </span>
                    </div>

                    <button
                      className="flex items-center justify-center w-10 h-10 rounded-lg text-muted-foreground text-red-500 bg-red-500/10 transition-all duration-300"
                      onClick={() => handleDelete(u.user_id)}
                      aria-label={`Delete ${u.username}`}
                    >
                      <Trash size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-6 bg-secondary/30 rounded-2xl border-2 border-dashed border-secondary w-[65%]">
              <div className="w-16 h-16 mb-4 rounded-full bg-muted/50 flex items-center justify-center">
                <Users size={32} className="text-muted-foreground" />
              </div>
              <p className="text-lg font-medium text-muted-foreground mb-1">
                No users found
              </p>
            </div>
          )}
        </section>

        {/* Change role */}
       {isRoleChanging?.status && (
  <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-900 bg-opacity-90 p-4 z-50">
    <div className="bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-sm flex flex-col items-center gap-4">
      <img
        src={isRoleChanging.selected_user.avatar}
        alt={isRoleChanging.selected_user.username}
        className="w-24 h-24 rounded-full object-cover"
      />
      <h1 className="text-xl font-semibold text-white">
        {isRoleChanging.selected_user.username}
      </h1>
      <p className="text-gray-300">
        Current role: <span className="font-medium">{isRoleChanging.selected_user.role}</span>
      </p>
      <label htmlFor="new-role" className="text-gray-200 self-start">
        Choose a new role:
      </label>
      <select
        id="new-role"
        ref={newRoleRef}
        className="w-full bg-gray-700 text-white p-2 rounded"
      >
        <option value="admin">Admin</option>
        <option value="user">User</option>
        <option value="member">Member</option>
      </select>
      <button
        onClick={() => changeRole(isRoleChanging.selected_user)}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded mt-2"
      >
        Save
      </button>
    </div>
  </div>
)}

      </main>
    </main>
  );
};

export default Dashboard;
