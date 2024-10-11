import React, { useEffect, useState } from 'react';
import AttendanceTable from './table';
import Link from 'next/link';

const TodaysAttendanceReport = () => {
  const [response, setResponse] = useState(null);
  const [fetchError, setFetchError] = useState(null);

  const fetchTodaysAttendance = async () => {
    setFetchError(null);
    setResponse(null);
    const today = new Date().toISOString().split('T')[0];

    try {
      const res = await fetch('/api/QuickPresence/Analysis/Classwise', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ startDate: today, endDate: today }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error('Fetch error:', res.status, res.statusText, errorText);
        throw new Error(`Fetch error: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      setResponse(data);
    } catch (error) {
      setFetchError(error);
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchTodaysAttendance();
  }, []);

  return (
    <div className='relative'>
        <Link href='/quick_presence' >
      <img src="/Icon/QuickPresence/turn-back.png" alt="back" className='absolute top-0 left-0 h-5 m-2' />
      </Link>
      <div className='flex justify-center'>
        <h1 className='xl:text-2xl font-bold sm:text-xl md:text-xl'>Today's Attendance Report</h1>
      </div>

      {fetchError && (
        <div>
          <p className='error font-extrabold text-red-700 font-serif inline'>
            Error: {fetchError.message}
          </p>
        </div>
      )}

      {response && response.data.length > 0 && (
        <div>
          <AttendanceTable records={response.data[0].records} />
        </div>
      )}
    </div>
  );
};

export default TodaysAttendanceReport;
