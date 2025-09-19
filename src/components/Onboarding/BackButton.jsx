import { useNavigate } from "react-router-dom";

const BackButton = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // go back to previous page
  };

  return (
    <div className="absolute top-5 left-5 z-50">
      <button
        onClick={handleBack}
        className="hover:bg-neutral-50 px-2 py-1 rounded-md hover:shadow-sm"
      >
        <i className="bi bi-arrow-left text-black text-xl"></i>
      </button>
    </div>
  );
};

export default BackButton;
