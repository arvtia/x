import { useEffect, useState } from 'react';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;

const Stats = () => {
  const [currentStreak, setCurrentStreak] = useState(null);
  const [highestStreak, setHighestStreak] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStreak = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const { data } = await axios.get(`${BASE_URL}/api/streak`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        setCurrentStreak(data.currentStreak ?? 0);
        setHighestStreak(data.highestStreak ?? 0);
      } catch (err) {
        // Axios puts the HTTP status in err.response
        if (err.response) {
          setError(`Error ${err.response.status}: ${err.response.data?.error || err.message}`);
        } else {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStreak();
  }, []);

  if (loading) {
    return (
      <div className="flex gap-3 p-2 h-screen flex-col justify-center place-content-center">
        <div className='p-5'>
          <i className="bi bi-arrow-clockwise animate-spin text-md text-neutral-400"></i>
          <p className="animate-pulse">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return <p className="p-3 text-red-500 text-shadow-sm text-md">{error}</p>;
  }

  return (
    <div className="max-w-4xl mx-auto bg-neutral-100 grid grid-cols-2">
      <div className="flex flex-col space-y-2 text-center p-4">
        <div className="text-3xl font-bold text-indigo-600">{currentStreak}</div>
        <div className="text-sm text-gray-600">Total number of streaks</div>
      </div>
      <div className="flex flex-col space-y-2 text-center p-4 border-l border-neutral-300">
        <div className="text-3xl font-bold text-indigo-600">{highestStreak}</div>
        <div className="text-sm text-gray-600">Your highest streaks</div>
      </div>
    </div>
  );
};

export default Stats;