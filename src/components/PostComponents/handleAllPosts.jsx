// src/components/XAllPosts.jsx
import { useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:5000";

function formatTime(iso) {
  const now = new Date();
  const d   = new Date(iso);
  const diff = (now - d) / 1000;
  if (diff < 60)    return `${Math.floor(diff)}s`;
  if (diff < 3600)  return `${Math.floor(diff/60)}m`;
  if (diff < 86400) return `${Math.floor(diff/3600)}h`;
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default function XAllPosts() {
  const [posts, setPosts]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Not authenticated");
        setLoading(false);
        return;
      }

      try {
        const { data: me } = await axios.get(
          `${BASE_URL}/api/auth/me`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const coupleId = me.coupleId ?? me.user?.coupleId;
        if (!coupleId) throw new Error("No coupleId found");

        const { data: feed } = await axios.get(
          `${BASE_URL}/api/posts/${coupleId}/public`
        );
        const list = Array.isArray(feed) ? feed : feed.posts ?? [];
        setPosts(list);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.error || err.message);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  if (loading) return <div className="p-6 text-center text-gray-500">Loading…</div>;
  if (error)   return <div className="p-6 text-center text-red-500">{error}</div>;
  if (posts.length === 0)
    return <div className="p-6 text-center text-gray-500">No posts to show.</div>;

  return (
    <div className="max-w-4xl mx-auto mt-6 bg-white rounded-lg shadow">
      <header className="p-4 border-b">
        <h2 className="text-xl font-bold">Home</h2>
      </header>

      {posts.map((post) => (
        <div
          key={post._id}
          className="flex space-x-3 px-4 py-3 hover:bg-gray-50 transition"
        >
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="h-10 w-10 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-700 font-bold">
              {post.author.name.charAt(0).toUpperCase()}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex items-center space-x-2 text-sm">
              <span className="font-semibold text-gray-900">{post.author.name}</span>
              <span className="text-gray-500">
                @{post.author.name.toLowerCase().replace(/\s+/g, "")}
              </span>
              <span className="text-gray-500">·</span>
              <span className="text-gray-500">{formatTime(post.createdAt)}</span>
            </div>

            <p className="mt-1 text-gray-800">{post.content}</p>

            {/* Media: single image vs slider */}
            {post.mediaURL?.length === 1 && (
              <img
                src={post.mediaURL[0]}
                alt="attachment"
                className="mt-3 w-full h-60 md:h-80 object-cover rounded-lg"
              />
            )}

            {post.mediaURL?.length > 1 && (
               <div
                  className="
                     mt-3
                     overflow-x-auto snap-x snap-mandatory
                     flex space-x-2 py-2
                     scrollbar-thin scrollbar-thumb-gray-300
                     bg-neutral-100 p-1
                  "
                  style={{ WebkitOverflowScrolling: "touch" }}
               >
                  {post.mediaURL.map((url, idx) => (
                     <div
                     key={idx}
                     className="
                        flex-shrink-0
                        snap-center
                        w-48 sm:w-56 md:w-64 lg:w-72
                        aspect-square
                        rounded-lg
                        overflow-hidden
                     "
                     >
                     <img
                        src={url}
                        alt={`attachment-${idx}`}
                        className="w-full h-full object-cover"
                     />
                     </div>
                  ))}
               </div>
               )}
          </div>
        </div>
      ))}
    </div>
  );
}