import React, { useEffect, useState } from 'react';
import './Quick_presence_dashboard.css';
import Link from 'next/link';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register required components
ChartJS.register(ArcElement, Tooltip, Legend);

const Quick_presence_dashboard = () => {
  const [fetcherror, setFetcherror] = useState(null);
  const [response, setResponse] = useState(null);
  const [totalStudents, setTotalStudents] = useState(0);
  const [presentStudents, setPresentStudents] = useState(0);
  const [absentStudents, setAbsentStudents] = useState(0);
  const [teacher_Name, setTeacher_Name] = useState('')

  // Fetch data of today's attendance
  const fetchtodayattendees = () => {
    let startDate, endDate;
    const today = new Date();
    startDate = endDate = today.toISOString().split('T')[0];

    if (startDate && endDate) {
      fetch('/api/QuickPresence/Analysis/Classwise', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ startDate, endDate }),
      })
      .then(async res => {
        if (!res.ok) {
          const errorText = await res.text();
          console.error('Fetch error:', res.status, res.statusText, errorText);
          throw new Error(`Fetch error: ${res.status} ${res.statusText}`);
        }
        return res.json();
      })
      .then(result => {
        if (result.success) {
          const records = result.data[0].records;
          setResponse(records);
          const total = records.length;
          const present = records.filter(student => student.status === 'Present').length;
          const absent = total - present;
          setTotalStudents(total);
          setPresentStudents(present);
          setAbsentStudents(absent);
          // console.log('Fetched data:', result.data);
        } else {
          console.error('Error:', result.msg);
          setFetcherror(result.msg);
        }
      })
      .catch(error => {
        setFetcherror(error);
        console.error('Error:', error);
      });
    }
  };
  const capitalizeName = (name) => {
    return name.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };
  const verifyuser = async () => { try {
    // Replace with actual API call to create user
    const response = await fetch('api/home', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
     
    });

    if (!response.ok) {
      const errorData = await response.json();
      
      console.log(errorData);
      throw new Error(errorData.msg || 'Something Went Wrong');

    }
    //log the data in response
    const data = await response.json();
    console.log('This is my data buddy',data);
    const name = data.data.firstName
    console.log(name);
    setTeacher_Name(capitalizeName(name));
    
  } catch (error) {
    
    console.error('Error creating user:', error);
    // Handle any network or other errors here
  }}

  useEffect(() => {
    fetchtodayattendees();
    verifyuser()
  }, []);

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
    <div className='flex flex-col items-center'>
      <div className="quick_presence_dashboard_intro">
        <h1 className='greeting'>Welcome!! {teacher_Name}</h1>
      </div>
      <div className="functionality_card_div">
        <div className="today_attendence_card functionality_card">
          <img src="/Icon/QuickPresence/Dashboard/calendar.png" alt="" className='functionality_card_icon' />
          <div className="functionality_card_content">
            <p className="sub-heading">Today Attendence</p>
            <div className="functionality_card_btn_div">
              <Link href='/quick_presence/take_attendence'>
                <button className="functionality_card_btn_light">Take Attendence</button>
              </Link>
              <Link href='/quick_presence/analysis'>
                <button className="functionality_card_btn_heavy">Download Report</button>
              </Link>
            </div>
          </div>
        </div>
        <div className="attendence_history_card functionality_card">
          <img src="/Icon/QuickPresence/Dashboard/history.png" alt="" className='functionality_card_icon' />
          <div className="functionality_card_content">
            <p className="sub-heading">Attendence History</p>
            <div className="functionality_card_btn_div">
              <Link href='/quick_presence/attendence_history/history'> <button className="functionality_card_btn_light">View</button></Link>
              <Link href='/quick_presence/attendence_history/analysis_report'> <button className="functionality_card_btn_heavy">Download Analysis</button></Link>
            </div>
          </div>
        </div>
        {/* Today's Attendance Summary Card */}
        <div className="today_summary_card mb-[15vh]">
          <div className="functionality_card_content">
            <p className="sub-heading">Today's Attendance Summary</p>
            <div className="numerical_data">
              <p>Total Students: {totalStudents}</p>
              <p>Present: {presentStudents}</p>
              <p>Absent: {absentStudents}</p>
            </div>
            <div className="pie_chart flex justify-center">
              <Pie data={pieData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quick_presence_dashboard;
