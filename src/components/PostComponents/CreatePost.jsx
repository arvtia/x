import { useState, useEffect, useRef } from "react";
import axios from "axios";


const BASE_URL = "http://localhost:5000";

const events = [
  "Dinner Date", "Movie Night", "Coffee Date", "Long Walk", "Picnic",
  "Cooking Together", "Travel / Trip", "Shopping Together", "Workout / Gym Session",
  "Game Night", "Concert / Event", "Celebration (Birthday / Anniversary)",
  "Photo Session", "Surprise Gift", "Deep Talk", "Random Adventure",
  "Late Night Drive", "Beach Day", "Stargazing", "Rain Walk", "Cuddles",
  "Smooches", "Hugs", "Hand Holding", "Love Notes", "Cooking Surprise",
  "Weekend Getaway", "Festival Celebration", "Family Gathering Together",
  "Random Acts of Kindness", "Apology & Make Up", "Shared Hobby (Art / Music / Reading)",
  "Planning Future Together"
];

const CreatePost = () => {
  const [description, setDescription] = useState("");
  const [type, setEventType] = useState(events[0]);
  const [visibility, setVisibility] = useState("private");
  const [files, setFiles] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ userName, setUserName ] = useState("");

  const [author, setAuthor] = useState("");
  const [coupleId, setCoupleId] = useState("");

  const fileInputRef = useRef(null);

  // 🔹 Fetch logged-in user info
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const { data } = await axios.get(`${BASE_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setAuthor(data.user.name || data.username || "Unknown");
        setCoupleId(data.user.coupleId || "");
        setAuthor(data.user._id || data._id)
        setUserName(data.user.name || date.name)
      } catch (err) {
        console.error("Failed to fetch user info:", err.response?.data || err.message);
      }
    };

    fetchUser();
  }, []);

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("content", description);
      formData.append("type", type);
      formData.append("visibility", visibility);
      formData.append("author", author);
      formData.append("coupleId", coupleId);

      if (files.length > 0) {
        files.forEach((files) => formData.append("media", files)); // ✅ matches backend
      }

      const { data } = await axios.post(`${BASE_URL}/api/posts/create`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Post created:", data);
      setDescription("");
      setFiles([]);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      console.error("Error creating post:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full p-4 md:p-5 rounded-md bg-white shadow-sm shadow-neutral-400">
      <form onSubmit={handleSubmit}>
        <h1 className="text-lg font-bold text-neutral-700">Create a post</h1>

        <div className="w-full p-2 bg-neutral-100 shadow-sm rounded-md grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Description */}
          <div className="p-1 flex flex-col space-y-1.5">
            <label htmlFor="heading" className="text-sm">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onFocus={() => setExpanded(true)}
              onBlur={() => !description && setExpanded(false)}
              className="rounded-md w-full p-2 bg-white focus:outline-black focus:outline-1 transition-all duration-200"
              placeholder="Type your texts here"
              style={{ minHeight: expanded ? "12rem" : "6rem" }}
            />
          </div>

          {/* Right side */}
          <div className="p-1 flex flex-col space-y-2">
            {/* Event type */}
            <div>
              <select
                name="type"
                value={type}
                onChange={(e) => setEventType(e.target.value)}
                className="w-full bg-white p-1 pr-8 rounded-md shadow-md focus:outline-neutral-500"
              >
                {events.map((ev, i) => (
                  <option key={i} value={ev}>{ev}</option>
                ))}
              </select>
            </div>

            {/* Author + Visibility */}
            <div className="flex gap-3">
              <input
                type="text"
                name="author"
                id="author"
                className="bg-white w-full shadow-md p-1 px-2 rounded-md focus:outline-neutral-500"
                value={userName}
                disabled
              />
              <select
                name="visibility"
                value={visibility}
                onChange={(e) => setVisibility(e.target.value)}
                className="w-fit bg-white p-1 px-2 rounded-md shadow-md"
              >
                <option value="private">Private</option>
                <option value="public">Public</option>
              </select>
            </div>

            {/* File input */}
            <div>
              <input
                type="file"
                multiple
                ref={fileInputRef}
                onChange={handleFileChange}
                className="p-2 w-full relative bg-white rounded-md shadow-md"
                
              />

              {/* Preview thumbnails */}
              <div className="p-2 flex flex-wrap gap-2">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="relative w-20 h-20 flex items-center justify-center border rounded-md overflow-hidden"
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      alt="preview"
                      className="object-cover w-full h-full"
                    />
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full px-1"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="p-2 bg-indigo-500 text-white rounded-md mt-2 hover:bg-indigo-600 disabled:opacity-50"
          >
            {loading ? "Posting..." : "Post"}
          </button>
        </div>
      </form>
    </div>
  );
};

const YourPostHeading = () =>{
   return(
      <>
         <div className="bg-neutral-50 p-2 rounded-md "></div>
      </>
   )
}



const CreatePostWrapper = () => {
  const [showModal, setShowModal] = useState(false);
  const modalRef = useRef(null);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setShowModal(false);
      }
    };
    if (showModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showModal]);

  return (
    <>
      {/* Normal card view */}
      {!showModal && (
        <div className="px-4">
            <YourPostHeading />

            <div
            onClick={() => setShowModal(true)}
            className=" mt-5 cursor-pointer p-4 rounded-md bg-white shadow hover:shadow-md transition w-fit"
         >
            <p className="text-neutral-600">Post Something</p>
         </div>
        </div>
      )}

      {/* Modal view */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 max-w-4xl mx-auto">
          <div ref={modalRef} className="w-full max-w-2xl">
            <CreatePost />
          </div>
        </div>
      )}
    </>
  );
};

export  {CreatePost, CreatePostWrapper};