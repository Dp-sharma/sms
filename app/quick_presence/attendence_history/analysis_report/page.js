'use client';
import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, Title, Tooltip, Legend, CategoryScale } from 'chart.js';
import Link from 'next/link';

ChartJS.register(LineElement, PointElement, LinearScale, Title, Tooltip, Legend, CategoryScale);

const AttendanceAnalysis = () => {
  const [analysisType, setAnalysisType] = useState('weekly'); // Default analysis type
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Default to current month
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Default to current year
  const [weekOfMonth, setWeekOfMonth] = useState(null);
  const [topStudents, setTopStudents] = useState([]);

  const getTop3Students = (attendanceRecords) => {
    // Create a dictionary to keep track of attendance counts for each student
    const studentAttendance = {};

    // Iterate over all attendance records
    attendanceRecords.forEach(record => {
      // For each record, iterate over the list of students
      record.records.forEach(student => {
        if (student.status === 'Present') {
          // If the student is present, update their count in the dictionary
          if (!studentAttendance[student.name]) {
            studentAttendance[student.name] = 0;
          }
          studentAttendance[student.name] += 1;
        }
      });
    });

    // Convert the dictionary to an array of [studentName, attendanceCount] pairs
    const sortedStudents = Object.entries(studentAttendance)
      .sort((a, b) => b[1] - a[1]) // Sort by attendance count in descending order
      .slice(0, 3); // Get the top 3 students

    return sortedStudents.map(([name, count]) => ({ name, count }));
  };

  const fetchData = async () => {
    setError(null);
    try {
      const startDate = new Date();
      let endDate;

      if (analysisType === 'weekly') {
        startDate.setDate(startDate.getDate() - 7);
      } else if (analysisType === 'monthly') {
        startDate.setFullYear(selectedYear);
        startDate.setMonth(selectedMonth - 1);
        startDate.setDate(1);
        endDate = new Date(selectedYear, selectedMonth, 0); // Last day of the selected month
      } else if (analysisType === 'yearly') {
        startDate.setFullYear(startDate.getFullYear() - 1);
      }

      if (analysisType !== 'monthly') {
        endDate = new Date();
      }

      const response = await fetch('/api/QuickPresence/Analysis/Classwise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ startDate: startDate.toISOString().split('T')[0], endDate: endDate.toISOString().split('T')[0] }),
      });

      if (!response.ok) {
        throw new Error('Error fetching data');
      }

      const result = await response.json();

      if (result.success) {
        const processedData = processAttendanceData(result.data);
        setData(processedData);

        // Call getTop3Students with the fetched data
        const top3Students = getTop3Students(result.data);
        setTopStudents(top3Students);

      } else {
        setError(result.msg);
      }
    } catch (error) {
      setError('Error fetching data');
      console.error(error);
    }
  };

  const processAttendanceData = (attendanceRecords) => {
    if (analysisType === 'monthly') {
      // Group data by day of the month
      const dailyData = {};
      attendanceRecords.forEach(record => {
        const date = new Date(record.date);
        const day = date.getDate();
        const total = record.records.length;
        const present = record.records.filter(student => student.status === 'Present').length;
        const absent = total - present;

        if (!dailyData[day]) {
          dailyData[day] = { present: 0, absent: 0, count: 0 };
        }

        dailyData[day].present += present;
        dailyData[day].absent += absent;
        dailyData[day].count += 1;
      });

      // Calculate daily averages
      const days = Object.keys(dailyData);
      const labels = days.map(day => `Day ${day}`);
      const presentAverages = days.map(day => dailyData[day].present / dailyData[day].count);
      const absentAverages = days.map(day => dailyData[day].absent / dailyData[day].count);

      return {
        labels,
        datasets: [
          {
            label: 'Average Present Students',
            data: presentAverages,
            borderColor: 'rgba(54, 162, 235, 1)',
            fill: false,
          },
          {
            label: 'Average Absent Students',
            data: absentAverages,
            borderColor: 'rgba(255, 99, 132, 1)',
            fill: false,
          }
        ]
      };
    } else {
      // Process weekly or yearly data (daily data in this case)
      const dates = [];
      const presentCounts = [];
      const absentCounts = [];

      attendanceRecords.forEach(record => {
        const date = new Date(record.date).toLocaleDateString();
        const total = record.records.length;
        const present = record.records.filter(student => student.status === 'Present').length;
        const absent = total - present;

        dates.push(date);
        presentCounts.push(present);
        absentCounts.push(absent);
      });

      return {
        labels: dates,
        datasets: [
          {
            label: 'Present Students',
            data: presentCounts,
            borderColor: 'rgba(54, 162, 235, 1)',
            fill: false,
          },
          {
            label: 'Absent Students',
            data: absentCounts,
            borderColor: 'rgba(255, 99, 132, 1)',
            fill: false,
          }
        ]
      };
    }
  };

  function getWeekOfMonth(date) {
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const startOfWeek = startOfMonth.getDay() === 0 ? 1 : 7 - startOfMonth.getDay() + 1;
    const dayOfMonth = date.getDate();
    return Math.ceil((dayOfMonth + startOfWeek - 1) / 7);
  }

  useEffect(() => {
    const today = new Date();
    const week = getWeekOfMonth(today);
    setWeekOfMonth(week);
  }, []);

  useEffect(() => {
    fetchData();
     // Example usage
  const date = new Date(); // Current date
  console.log(getWeekOfMonth(date)); // Outputs the week of the month for the current date
  }, [analysisType, selectedMonth, selectedYear]);
  function getWeekOfMonth(date) {
    // Get the first day of the month
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    // Get the day of the week for the first day of the month (0: Sunday, 1: Monday, etc.)
    const firstDayWeekday = firstDay.getDay();
    // Calculate the number of days between the given date and the first day of the month
    const daysSinceFirst = date.getDate() + firstDayWeekday - 1;
    // Calculate the week number (0-based, so add 1 for 1-based)
    return Math.floor(daysSinceFirst / 7) + 1;
  }
  
  // Example usage
  const date = new Date(); // Current date
  console.log(getWeekOfMonth(date)); // Outputs the week of the month for the current date
  return (
    <>
      <div className='relative flex justify-end'>
        <div className='flex flex-col'>
          <Link href='/quick_presence'>
            <img src="/Icon/QuickPresence/turn-back.png" alt="back" className='absolute top-0 left-0 h-5 m-2' />
          </Link>
          <h1>Attendance Analysis</h1>

          <div>
            <label>Select Analysis Type: </label>
            <select value={analysisType} onChange={(e) => setAnalysisType(e.target.value)}>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          {analysisType === 'monthly' && (
            <div>
              <label>Select Month: </label>
              <select value={selectedMonth} onChange={(e) => setSelectedMonth(Number(e.target.value))}>
                {[...Array(12).keys()].map(i => (
                  <option key={i} value={i + 1}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</option>
                ))}
              </select>

              <label>Select Year: </label>
              <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))}>
                {[2024, 2023, 2022].map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>
      {error && <p>Error: {error}</p>}

      {data && (
        <div className='h-[70vh]'>
          <Line data={data} />
          <div>
            <h1>Current Week of the Month</h1>
            <p>{weekOfMonth !== null ? `This is week ${weekOfMonth} of the month.` : 'Loading...'}</p>
          </div>
          {topStudents.length > 0 && (
            <div>
              <h2>Top 3 Students with Maximum Attendance</h2>
              <ul>
                {topStudents.map((student, index) => (
                  <li key={index}>{student.name}: {student.count} days</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default AttendanceAnalysis;
