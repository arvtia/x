import { useState } from "react";

const WaitForPartner = () => {
  // Initialize partnerCode directly from localStorage
  const [partnerCode] = useState(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return "";
    try {
      const parsedUser = JSON.parse(storedUser);
      return parsedUser.user.partnerCode || "";
    } catch {
      return "";
    }
  });

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!partnerCode) return;

    navigator.clipboard.writeText(partnerCode).then(() => {
      setCopied(true);

      // Hide notification after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="w-full p-2">
      <p className="text-center text-lg text-neutral-800 font-semibold">
        Share Your Code
      </p>
      <p className="text-sm text-neutral-500 text-center">
        Share this code with your partner so they can connect to you
      </p>

      <div className="mt-6 mb-3">
        <div className="px-3 py-2 rounded-md bg-neutral-200 p-1">
          <p className="text-white bg-black rounded-md px-3 py-2 text-center">
            {partnerCode || "No Code Found"}
          </p>
        </div>
      </div>

      <button
        onClick={handleCopy}
        className="w-full text-center text-neutral-900 outline-1 outline-dashed bg-neutral-100 hover:bg-neutral-300  px-2 py-2 ring-1 shadow-md  rounded-md ring-neutral-300 flex justify-center items-center gap-2 "
      >
        Copy
        <i className="bi bi-copy text-neutral-700"></i>
      </button>

      {/* Notification */}
      {copied && (
        <p className="text-green-600 text-sm mt-3 text-center">
          ✅ Partner code copied!
        </p>
      )}
    </div>
  );
};

export default WaitForPartner;
