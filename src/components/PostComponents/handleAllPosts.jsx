// src/components/XAllPosts.jsx
import { useState, useEffect } from "react";
import axios from "axios";
// make sure you've loaded Bootstrap Icons CSS globally:
//   <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@X.Y.Z/font/bootstrap-icons.css">

const BASE_URL = "http://localhost:5000";

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
      const { data } = await axios.post(
        `${BASE_URL}/api/posts/${postId}/comment`,
        { content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId
            ? {
                ...p,
                commentsCount: p.commentsCount + 1,
                comments: [...p.comments, data.comment]
              }
            : p
        )
      );
      setCommentInputs((ci) => ({ ...ci, [postId]: "" }));
    } catch (err) {
      console.error("comment API error:", err);
    }
  };

  // Loading / error / empty
  if (loading)
    return <div className="p-6 text-center text-gray-500">Loading…</div>;
  if (error)
    return <div className="p-6 text-center text-red-500">{error}</div>;
  if (!posts.length)
    return <div className="p-6 text-center text-gray-500">No posts to show.</div>;

  return (
    <div className="max-w-4xl mx-auto mt-6 bg-white rounded-lg shadow">
      <header className="p-4 border-b">
        <h2 className="text-xl font-bold">Your Posts</h2>
      </header>

      {posts.map((post) => (
        <div
          key={post._id}
          className="px-4 py-3 hover:bg-gray-50 transition"
        >
          {/* Header & Content */}
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-700 font-bold">
                {post.author.name.charAt(0).toUpperCase()}
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 text-sm">
                <span className="font-semibold text-gray-900">
                  {post.author.name}
                </span>
                <span className="text-gray-500">
                  @{post.author.name.toLowerCase().replace(/\s+/g, "")}
                </span>
                <span className="text-gray-500">·</span>
                <span className="text-gray-500">
                  {formatTime(post.createdAt)}
                </span>
              </div>

              <p className="mt-1 text-gray-800">{post.content}</p>

              {/* Media */}
              {post.mediaURL?.length === 1 && (
                <img
                  src={post.mediaURL[0]}
                  alt=""
                  className="mt-3 w-full h-auto object-cover rounded-lg"
                />
              )}
              {post.mediaURL?.length > 1 && (
                <div
                  className="
                    mt-3 overflow-x-auto snap-x snap-mandatory
                    flex space-x-2 py-2 scrollbar-thin scrollbar-thumb-gray-300
                    bg-neutral-100 p-1
                  "
                  style={{ WebkitOverflowScrolling: "touch" }}
                >
                  {post.mediaURL.map((url, idx) => (
                    <div
                      key={idx}
                      className="
                        flex-shrink-0 snap-center
                        w-48 sm:w-56 md:w-64 lg:w-72
                        aspect-square rounded-lg overflow-hidden
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
              )}

              {/* Action Bar */}
              <div className="flex items-center space-x-6 mt-3 text-gray-600 text-lg">
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

              {/* Nested Comments */}
              {openCommentsFor === post._id && (
                <div className="mt-4 space-y-3">
                  {/* Existing comments */}
                  <div className="space-y-2 pl-6 border-l-2 border-gray-200">
                    {post.comments.map((c) => (
                      <div
                        key={c._id}
                        className="flex items-start space-x-2"
                      >
                        <div className="flex-shrink-0">
                          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium text-sm">
                            {c.commenter.name
                              ? c.commenter.name.charAt(0).toUpperCase()
                              : "?"}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm">
                            <span className="font-semibold">
                              {c.commenter.name || "User"}
                            </span>{" "}
                            <span className="text-gray-500 text-xs">
                              · {formatTime(c.createdAt)}
                            </span>
                          </div>
                          <div className="text-gray-800">{c.content}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* New comment input */}
                  <div className="flex space-x-2">
                    <input
                      value={commentInputs[post._id] || ""}
                      onChange={(e) =>
                        setCommentInputs((ci) => ({
                          ...ci,
                          [post._id]: e.target.value,
                        }))
                      }
                      placeholder="Write a comment…"
                      className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring"
                    />
                    <button
                      onClick={() => addComment(post._id)}
                      disabled={!commentInputs[post._id]?.trim()}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
                    >
                      Post
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}