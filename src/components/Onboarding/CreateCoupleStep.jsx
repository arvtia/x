import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_BASE_URL; // e.g. "http://localhost:5000"

const CreateCoupleConnection = () => {
  const [partnerCode, setPartnerCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [user, setUser] = useState("");
  const navigate = useNavigate();

  // ✅ Load user once on mount
  useEffect(() => {
    const rawUser = localStorage.getItem("user");
    if (!rawUser) return;

    try {
      const parsed = JSON.parse(rawUser);
      // If stored as object → use _id
      // If stored as plain string → use directly
      setUser(parsed._id || parsed);
    } catch (err) {
      // console.error("Failed to parse user from localStorage:", err);
      setUser(rawUser);
    }
  }, []);

  // ✅ Create couple request
  const handleCreateCouple = async () => {
    setError("");
    setSuccess("");

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Token not found. Please log in again.");
      return;
    }

    if (!user) {
      setError("User not found. Please log in again.");
      return;
    }
    const userId = user.user._id


    try {
      // console.log("Posting to:", `${BASE_URL}/api/couple/link`);
      // console.log("Payload:", userId  );

      const response = await fetch(`${BASE_URL}/api/couple/link`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, partnerCode }),
      });

      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}));
        throw new Error(errBody.error || "Failed to create connection");
      }

      const data = await response.json();
      // console.log("Linked couple:", data.couple);
      setSuccess("Connection created successfully!");
      navigate('/');

    } catch (err) {
      // console.error("Error creating couple:", err);
      setError(err.message);
    }
  };

  return (
    <div className="w-full flex flex-col space-y-3.5">
      <div className="px-2 w-full">
        <p className="text-center text-neutral-900 font-semibold">
          Enter Partner Code
        </p>
        <p className="text-sm text-center text-neutral-500">
          Enter your partner's code to establish the connection
        </p>
      </div>

      <div className="flex flex-col space-y-1.5 mt-5 px-2">
        <label htmlFor="partnerCode">Partner Code</label>
        <input
          id="partnerCode"
          type="text"
          value={partnerCode}
          onChange={(e) => setPartnerCode(e.target.value)}
          className="text-neutral-600 bg-neutral-100 py-2 text-md px-3 rounded-md focus:outline-neutral-700 shadow-sm hover:bg-neutral-200 transition-colors duration-200"
          placeholder="Enter their Partner Code"
        />
      </div>

      <div className="px-1">
        <button
          className="w-full py-2 font-mono shadow-md ring-2 ring-offset-2 ring-neutral-200 bg-black text-white rounded-md"
          onClick={handleCreateCouple}
        >
          Connect to Partner
        </button>
      </div>

      {error && <p className="text-red-500 text-center mt-2">{error}</p>}
      {success && <p className="text-green-600 text-center mt-2">{success}</p>}
    </div>
  );
};

export default CreateCoupleConnection;
