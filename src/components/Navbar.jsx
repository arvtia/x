import { useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:5000";

const Navbar = () => {
  const [connected, setConnected] = useState(false);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        // 1️⃣ Get user info
        const { data: me } = await axios.get(`${BASE_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const coupleId = me.coupleId ?? me.user?.coupleId;
        if (!coupleId) {
          setConnected(false);
          return;
        }

        setConnected(true);

        // 2️⃣ Fetch couple members
        const { data } = await axios.get(`${BASE_URL}/api/couple/${coupleId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setMembers(data.couple.members || []);
      } catch (err) {
        console.error("Navbar fetch error:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="max-w-4xl mx-auto sticky top-0 z-50 bg-white">
      <div className="flex z-50 justify-between items-center py-4 px-6 border-b border-neutral-200">
        {/* Logo + App Name */}
        <div className="flex gap-2 items-center">
          <div className="size-10 backdrop-blur-md bg-indigo-200 rounded-md p-2 cursor-pointer hover:bg-indigo-300 transition shadow-lg shadow-indigo-200/50"></div>

          <div className="flex flex-col space-y-px">
            <div className="text-lg font-semibold">Couple's Journey</div>

            {/* Connection Status */}
            <div
              className={`flex gap-1 items-center p-1 px-2 rounded-full w-fit ${
                connected ? "bg-green-100" : "bg-red-100"
              }`}
            >
              <div className="w-fit relative">
                <div
                  className={`size-4 rounded-full opacity-20 animate-pulse ${
                    connected ? "bg-green-300" : "bg-red-300"
                  }`}
                ></div>
                <div
                  className={`size-2 absolute inset-y-1 inset-x-1 rounded-full z-30 ${
                    connected ? "bg-green-500" : "bg-red-500"
                  }`}
                ></div>
              </div>
              <div
                className={`text-[10px] font-semibold ${
                  connected ? "text-green-700" : "text-red-700"
                }`}
              >
                {connected ? "Connected" : "Disconnected"}
              </div>
            </div>
          </div>
        </div>

        {/* Profile Icons */}
        <div className="flex -space-x-3">
          {members.map((m) => (
            <div
              key={m._id}
              className="size-10 bg-neutral-200 rounded-full flex items-center justify-center cursor-pointer hover:bg-neutral-300 transition ring-1 ring-neutral-300 hover:ring-2 hover:ring-white font-bold text-gray-700"
              title={m.name}
            >
              {m.name?.charAt(0).toUpperCase()}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Navbar;