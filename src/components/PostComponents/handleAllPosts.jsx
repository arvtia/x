// src/components/XAllPosts.jsx
import { useState, useEffect } from "react";
import axios from "axios";
// make sure you've loaded Bootstrap Icons CSS globally:
import CommentThread from "../commentthreads/CommentThread";

const BASE_URL = import.meta.env.VITE_BASE_URL;

// “2h” / “3d” / “Sep 17”
function formatTime(iso) {
  const now = new Date();
  const d   = new Date(iso);
  const diff = (now - d) / 1000;
  if (diff < 60)    return `${Math.floor(diff)}s`;
  if (diff < 3600)  return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default function XAllPosts() {
  const [posts, setPosts]             = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState("");
  const [userId, setUserId]           = useState("");
  const [openCommentsFor, setOpenCommentsFor] = useState(null);
  const [commentInputs, setCommentInputs]     = useState({});

  // Fetch user + feed
  useEffect(() => {
    const init = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Not authenticated");

        // 1) Me → _id & coupleId
        const { data: me } = await axios.get(
          `${BASE_URL}/api/auth/me`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const uid      = me._id ?? me.user?._id;
        const coupleId = me.coupleId ?? me.user?.coupleId;
        if (!uid || !coupleId) throw new Error("Invalid auth response");
        setUserId(uid);

        // 2) Public posts
        const { data: feed } = await axios.get(
          `${BASE_URL}/api/posts/${coupleId}/public`
        );
        const raw = Array.isArray(feed) ? feed : feed.posts ?? [];

        // Normalize counts, love-status & preserve comments array
        const norm = raw.map((p) => ({
          ...p,
          lovesCount:    p.loves?.length || 0,
          hasLoved:      p.loves?.includes(uid),
          shareCount:    p.shareCount ?? 0,
          commentsCount: p.comments?.length || 0,
          comments:      p.comments || []
        }));
        setPosts(norm);
      } catch (err) {
        console.error("Init failed:", err);
        setError(err.response?.data?.error || err.message);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  // Handlers
  const lovePost = async (postId) => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post(
        `${BASE_URL}/api/posts/${postId}/love`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId
            ? { ...p, lovesCount: data.loves, hasLoved: data.hasLoved }
            : p
        )
      );
    } catch (err) {
      console.error("love API error:", err);
    }
  };

  const sharePost = async (postId) => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post(
        `${BASE_URL}/api/posts/${postId}/share`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId ? { ...p, shareCount: data.shareCount } : p
        )
      );
    } catch (err) {
      console.error("share API error:", err);
    }
  };

   const addComment = async (postId) => {
  const content = commentInputs[postId]?.trim();
  if (!content) return;

  try {
    const token = localStorage.getItem("token");
    // Post the comment
    await axios.post(
      `${BASE_URL}/api/posts/${postId}/comment`,
      { content },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // Fetch updated comments for this post
    const { data: updatedPost } = await axios.get(
      `${BASE_URL}/api/posts/${postId}`
    );

    setPosts((prev) =>
      prev.map((p) =>
        p._id === postId
          ? {
             ...p,
             comments: updatedPost.comments || [],
             commentsCount: updatedPost.comments?.length || 0,
            }
          : p
      )
    );

    // clear the textarea
    setCommentInputs((ci) => ({ ...ci, [postId]: "" }));
  } catch (err) {
    console.error("[addComment] failed:", err.response?.data || err.message);
  }
 };

  const handleNewReply = (postId, parentCommentId, reply) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p._id !== postId) return p;

        // Deep clone and insert reply under correct comment
        function insertReply(comments) {
          return comments.map((c) => {
            if (c._id === parentCommentId) {
              return { ...c, replies: [...c.replies, reply] };
            }
            if (c.replies?.length) {
              return { ...c, replies: insertReply(c.replies) };
            }
            return c;
          });
        }

        return {
          ...p,
          comments: insertReply(p.comments),
          commentsCount: p.commentsCount + 1
        };
      })
    );
  };




  // Loading / error / empty
  if (loading)
    return <div className="p-6 text-center text-gray-500">Loading…</div>;
  if (error)
    return <div className="p-6 text-center text-red-500">{error}</div>;
  if (!posts.length)
    return <div className="p-6 text-center text-gray-500">No posts to show.</div>;

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow">
      <header className="p-4 border-b">
        <h2 className="text-xl font-bold">Your Posts</h2>
      </header>

      {posts.map((post) => (
         <div
            key={post._id}
            className="px-4 py-5 hover:bg-gray-50 transition border-b"
         >
            {/* Header & Content */}
            <div className="flex items-start space-x-3">
               {/* Avatar */}
               <div className="flex-shrink-0">
               <div className="h-10 w-10 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-700 font-bold">
                  {post.author.name.charAt(0).toUpperCase()}
               </div>
               </div>

               {/* Main Content */}
               <div className="flex-1 min-w-0">
               {/* Author + Timestamp */}
               <div className="flex items-center space-x-2 text-sm">
                  <span className="font-semibold text-gray-900">
                     {post.author.name}
                  </span>
                  <span className="text-gray-500">
                     @{post.author.name.toLowerCase().replace(/\s+/g, "")}
                  </span>
                  <span className="text-gray-500">·</span>
                  <span className="text-gray-500">{formatTime(post.createdAt)}</span>
               </div>

               {/* Text */}
               <p className="mt-2 text-gray-800 break-words">{post.content}</p>

               {/* Media */}
               {post.mediaURL?.length === 1 && (
                  <div className="mt-3 rounded-lg overflow-hidden">
                     <img
                     src={post.mediaURL[0]}
                     alt=""
                     className="w-full h-auto max-h-[500px] object-contain rounded-lg"
                     />
                  </div>
               )}

               {post.mediaURL?.length > 1 && (
                  <div
                     className="mt-3 w-full max-w-full overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300"
                     style={{ WebkitOverflowScrolling: "touch" }}
                  >
                     <div className="inline-flex space-x-3 snap-x snap-mandatory px-1">
                     {post.mediaURL.map((url, idx) => (
                        <div
                           key={idx}
                           className="
                           flex-none snap-center
                           w-40 sm:w-56 md:w-64 lg:w-72
                           aspect-square rounded-lg overflow-hidden
                           bg-gray-100
                           "
                        >
                           <img
                           src={url}
                           alt=""
                           className="w-full h-full object-cover"
                           />
                        </div>
                     ))}
                     </div>
                  </div>
               )}

               {/* Action Bar */}
               <div className="flex items-center space-x-6 mt-4 text-gray-600 text-lg">
                  {/* Love */}
                  <button
                     onClick={() => lovePost(post._id)}
                     className="flex items-center space-x-1 hover:text-red-500"
                  >
                     <i
                     className={
                        post.hasLoved
                           ? "bi bi-heart-fill text-red-500"
                           : "bi bi-heart"
                     }
                     />
                     {post.lovesCount > 0 && (
                     <span className="text-sm">{post.lovesCount}</span>
                     )}
                  </button>

                  {/* Comments */}
                  <button
                     onClick={() =>
                     setOpenCommentsFor(
                        openCommentsFor === post._id ? null : post._id
                     )
                     }
                     className="flex items-center space-x-1 hover:text-blue-500"
                  >
                     <i className="bi bi-chat-left-text" />
                     {post.commentsCount > 0 && (
                     <span className="text-sm">{post.commentsCount}</span>
                     )}
                  </button>

                  {/* Share */}
                  <button
                     onClick={() => sharePost(post._id)}
                     className="flex items-center space-x-1 hover:text-green-500"
                  >
                     <i className="bi bi-share" />
                     <span className="text-sm">{post.shareCount}</span>
                  </button>
               </div>

               {/* Comments Thread */}
               {openCommentsFor === post._id && (
                  <div className="mt-4 pl-4 border-l-2 border-gray-200">
                     {/* --- Added: UI for posting a new comment --- */}
                     <div className="mb-2">
                       {/* Textarea for comment input, bound to commentInputs state */}
                       <textarea
                         className="w-full border rounded p-2 resize-none"
                         rows={2}
                         placeholder="Write a comment..."
                         value={commentInputs[post._id] || ""}
                         onChange={e =>
                           setCommentInputs(ci => ({ ...ci, [post._id]: e.target.value }))
                         }
                       />
                       {/* Button to post comment, calls addComment handler */}
                       <button
                         className="mt-1 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                         onClick={() => addComment(post._id)}
                         disabled={!(commentInputs[post._id] && commentInputs[post._id].trim())}
                       >
                         Post Comment
                       </button>
                     </div>
                     {/* --- End of added comment input UI --- */}
                     {/* Existing comment thread component for replies and display */}
                     <CommentThread
                       postId={post._id}
                       comments={post.comments}
                       userToken={localStorage.getItem("token")}
                       onNewReply={(commentId, reply) =>
                         handleNewReply(post._id, commentId, reply)
                       }
                     />
                  </div>
               )}
               </div>
            </div>
         </div>
         ))}
    </div>
  );
}