import { useState } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:5000";

// Renders one comment + its replies recursively
export default function CommentThread({
  postId,
  comments,
  depth = 0,
  userToken,
  onNewReply // callback to notify parent of a new reply
}) {
  const [openReplyFor, setOpenReplyFor] = useState(null);
  const [replyInput, setReplyInput] = useState("");

  const submitReply = async (commentId) => {
    if (!replyInput.trim()) return;
    try {
      const { data } = await axios.post(
        `${BASE_URL}/api/posts/${postId}/comment/${commentId}/reply`,
        { content: replyInput },
        { headers: { Authorization: `Bearer ${userToken}` } }
      );
      onNewReply(commentId, data.reply);
      setReplyInput("");
      setOpenReplyFor(null);
    } catch (err) {
      console.error("Reply error:", err);
    }
  };

  return (
    <div className={`${depth > 0 ? "pl-6" : ""} space-y-4`}>
      {comments.map((c) => (
        <div key={c._id} className="space-y-1">
          {/* Comment content */}
          <div className="flex items-start space-x-2">
            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium">
              {c.commenter.name?.charAt(0).toUpperCase() || "?"}
            </div>
            <div>
              <div className="text-sm">
                <span className="font-semibold">{c.commenter.name}</span>{" "}
                <span className="text-gray-500 text-xs">
                  · {new Date(c.createdAt).toLocaleTimeString()}
                </span>
              </div>
              <p className="text-gray-800">{c.content}</p>
              <button
                onClick={() =>
                  setOpenReplyFor(openReplyFor === c._id ? null : c._id)
                }
                className="text-blue-500 text-xs mt-1"
              >
                Reply
              </button>
            </div>
          </div>

          {/* Reply input */}
          {openReplyFor === c._id && (
            <div className="flex items-center space-x-2 pl-10">
              <input
                value={replyInput}
                onChange={(e) => setReplyInput(e.target.value)}
                placeholder="Write a reply…"
                className="flex-1 px-2 py-1 border rounded"
              />
              <button
                onClick={() => submitReply(c._id)}
                className="px-3 py-1 bg-blue-500 text-white rounded"
              >
                Send
              </button>
            </div>
          )}

          {/* Nested replies */}
          {c.replies?.length > 0 && (
            <CommentThread
              postId={postId}
              comments={c.replies}
              depth={depth + 1}
              userToken={userToken}
              onNewReply={onNewReply}
            />
          )}
        </div>
      ))}
    </div>
  );
}