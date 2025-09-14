
import { useEffect, useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';

const BASE_URL = import.meta.env.VITE_BASE_URL;

// Color scale function
const getColor = (count) => {
  if (count === 0) return '#ebedf0';
  if (count <= 3) return '#c6e48b';
  if (count <= 6) return '#7bc96f';
  if (count <= 9) return '#239a3b';
  return '#196127';
};

const ActivityGraph = () => {
  const [days, setDays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found');
        setLoading(false);
        return;
      }

      try {
        const { data } = await axios.get(`${BASE_URL}/api/streak`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDays(data);
      } catch (err) {
        setError(err.response?.data?.error || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading activity graph...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(53, 12px)', gap: '2px' }}>
      {days.map((day, idx) => (
        <div
          key={idx}
          title={`${day.date}: ${day.count} activities`}
          style={{
            width: '12px',
            height: '12px',
            backgroundColor: getColor(day.count),
            borderRadius: '2px'
          }}
        />
      ))}
    </div>
  );
};

export default ActivityGraph;
