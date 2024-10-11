import React, { useState, useEffect } from 'react';
import AttendanceTable from './Attendence/table';
import Link from 'next/link';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register required components
ChartJS.register(ArcElement, Tooltip, Legend);
const Attendance_history_component = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); // Default to current date
  const [response, setResponse] = useState(null);
  const [fetcherror, setFetcherror] = useState();
  const [totalStudents, setTotalStudents] = useState(0);
  const [presentStudents, setPresentStudents] = useState(0);
  const [absentStudents, setAbsentStudents] = useState(0);
  
  const handleDateChange = async (event) => {
    setFetcherror(null);
    setResponse(null);
    const date = event.target.value;

    setSelectedDate(date);

    if (date) {
      fetch('/api/QuickPresence/Analysis/Classwise', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ startDate: date, endDate: date }),
      })
        .then(async (res) => {
          if (!res.ok) {
            const errorText = await res.text();
            console.error('Fetch error:', res.status, res.statusText, errorText);
            throw new Error(`Fetch error: ${res.status} ${res.statusText}`);
          }
          return res.json();
        })
        .then((data) => {
          setResponse(data)
          console.log(data);
          
          const records = data.data[0].records;
          console.log(records);
          
          const total = records.length;
          const present = records.filter(student => student.status === 'Present').length;
          const absent = total - present;
          setTotalStudents(total);
          setPresentStudents(present);
          setAbsentStudents(absent);
        })
        .catch((error) => {
          setFetcherror(error);
          console.error('Error:', error);
        });
    }
  };

  useEffect(() => {
    handleDateChange({ target: { value: selectedDate } });
  }, []);
  const maxDate = new Date().toISOString().split('T')[0]; // Today's date
  const pieData = {
    labels: ['Present', 'Absent'],
    datasets: [
      {
        data: [presentStudents, absentStudents],
        backgroundColor: ['#36A2EB', '#FF6384'],
        hoverBackgroundColor: ['#36A2EB', '#FF6384'],
      },
    ],
  };
  return (
    <div className='relative'>
      <Link href='/quick_presence'>
        <img src="/Icon/QuickPresence/turn-back.png" alt="back" className='absolute top-0 left-0 h-5 m-2' />
      </Link>
      <div className="flex justify-end">
        <input
          type="date"
          value={selectedDate}
          max={maxDate} // Restrict to today or earlier
          onChange={handleDateChange}
          className="m-2 p-2 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-100"
        />
      </div>

      {/* Show error when detected */}
      {fetcherror && (
        <div>
          <p className="error font-extrabold text-red-700 font-serif inline">Error: {fetcherror.message}</p>
        </div>
      )}
      {/* Display data when response is available */}
      {response && response.data.length > 0 && (
        <>
          <div>
            <AttendanceTable records={response.data[0].records} />
          </div>
          <div className='flex justify-center'>
            <div className="numerical_data">
              <p>Total Students: {totalStudents}</p>
              <p>Present: {presentStudents}</p>
              <p>Absent: {absentStudents}</p>
            </div>
            <div className="mb-[15vh] h-[150px]">
              <Pie data={pieData} />
            </div>
          </div>
          
        </>
      )}
    </div>
  );
};

export default Attendance_history_component;
