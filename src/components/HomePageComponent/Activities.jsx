import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import SkeletonActivityGraph from './skeletionActivitiyGraph';

const BASE_URL = "http://localhost:5000";

// Map a count to a Tailwind color class (GitHub-like)
function getLevelClass(count) {
  if (count === 0) return 'bg-gray-200 dark:bg-neutral-800';
  if (count <= 3) return 'bg-green-200';
  if (count <= 6) return 'bg-green-400';
  if (count <= 9) return 'bg-green-600';
  return 'bg-green-800';
}

// Build a YYYY-MM-DD string
const dstr = (d) => dayjs(d).format('YYYY-MM-DD');

// Given a list of {date,count}, align to weeks (Sun→Sat columns)
function toWeeks(days) {
  if (!days?.length) return { weeks: [], monthTicks: [] };

  // Ensure input is sorted oldest → newest
  const sorted = [...days].sort((a, b) => a.date.localeCompare(b.date));

  // Align start to the previous Sunday
  const first = dayjs(sorted[0].date);
  const padStart = (first.day() + 7) % 7; // 0=Sun … 6=Sat
  const start = first.subtract(padStart, 'day');

  // Build a dense map for quick lookups
  const map = new Map(sorted.map((d) => [d.date, d.count]));

  // Generate continuous date list from start → last day
  const last = dayjs(sorted[sorted.length - 1].date);
  const dates = [];
  let cursor = start;
  while (cursor.isBefore(last) || cursor.isSame(last, 'day')) {
    dates.push({ date: dstr(cursor), count: map.get(dstr(cursor)) ?? 0 });
    cursor = cursor.add(1, 'day');
  }

  // Chunk by weeks (7 per column)
  const weeks = [];
  for (let i = 0; i < dates.length; i += 7) {
    weeks.push(dates.slice(i, i + 7));
  }

  // Month labels: mark a week when its first day is the first occurrence of that month
  const seenMonths = new Set();
  const monthTicks = weeks.map((week) => {
    const firstDay = dayjs(week[0]?.date);
    const key = firstDay.format('YYYY-MM');
    if (!seenMonths.has(key) && week.some(Boolean)) {
      seenMonths.add(key);
      return firstDay.format('MMM');
    }
    return '';
  });

  return { weeks, monthTicks };
}

export default function ActivityGraph() {
  const [graph, setGraph] = useState([]); // [{date, count}]
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found');
        setLoading(false);
        return;
      }
      try {
        const { data } = await axios.get(`${BASE_URL}/api/streak/getgraph`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Supports both combined and raw arrays
        const activity = Array.isArray(data) ? data : data.activityGraph;
        setGraph(activity ?? []);
      } catch (err) {
        setError(err.response?.data?.error || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const { weeks, monthTicks } = useMemo(() => toWeeks(graph), [graph]);

  
  if (loading)
    return ( <SkeletonActivityGraph />);

  if (error) return <p className="text-sm text-indigo-500">{error}</p>;

  return (
    <div className="space-y-3 bg-white p-4">
      {/* Month labels */}
      <div className="ml-8 flex gap-1 text-xs text-neutral-500">
        {/* Left gutter for weekday labels */}
        <div className="w-6 shrink-0" />
        {monthTicks.map((label, i) => (
          <div key={i} className="w-3 text-center ">
            {label}
          </div>
        ))}
      </div>

      <div className="flex">
        {/* Weekday labels */}
        <div className="mr-2 flex w-6 flex-col justify-between py-1 text-xs text-neutral-500">
          <span>Mon</span>
          <span>Wed</span>
          <span>Fri</span>
        </div>

        {/* Grid: weeks as columns, days as rows */}
        <div className="flex gap-1">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-2">
              {week.map((day, di) => (
                <div
                  key={`${wi}-${di}`}
                  className={`h-3 w-3 rounded-sm cursor-pointer focus:outline-1 focus:outline-indigo-300 ${getLevelClass(day.count)} transition-colors`}
                  title={`${day.date}: ${day.count} activit${day.count === 1 ? 'y' : 'ies'}`}
                  aria-label={`${day.date}: ${day.count} activities`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="ml-8 flex items-center gap-2 text-xs text-neutral-500">
        <span>Less</span>
        <div className="h-3 w-3 rounded-sm bg-gray-200 dark:bg-neutral-800" />
        <div className="h-3 w-3 rounded-sm bg-green-200" />
        <div className="h-3 w-3 rounded-sm bg-green-400" />
        <div className="h-3 w-3 rounded-sm bg-green-600" />
        <div className="h-3 w-3 rounded-sm bg-green-800" />
        <span>More</span>
      </div>
    </div>
  );
}