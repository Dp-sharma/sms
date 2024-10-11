'use client';
import React, { useEffect, useState } from 'react';
import './Quick_presence.css';
import Link from 'next/link';

const QuickPresence = () => {
    const [students, setStudents] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [attendanceStatus, setAttendanceStatus] = useState('Present');

    const verifyUser = async () => {
        try {
            console.log('Verifying user');
            const response = await fetch('/api/QuickPresence/Attendance/initialize', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Response data:', data);
                setStudents(data.data);
            } else {
                console.log('Failed to fetch data:', response.statusText);
            }
        } catch (error) {
            console.log('Error fetching data:', error);
        }
    };

    useEffect(() => {
        verifyUser();
    }, []);

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prevIndex => prevIndex - 1);
        }
    };

    const handleNext = () => {
        if (currentIndex < students.length - 1) {
            setCurrentIndex(prevIndex => prevIndex + 1);
        }
    };

    const handleAttendanceChange = (status) => {
        setAttendanceStatus(status);
        handleSubmitAttendance(status);
        handleNext();
    };

    const handleSubmitAttendance = async (status) => {
        const student = students[currentIndex];

        try {
            const response = await fetch('/api/QuickPresence/Attendance/Update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    rollNo: student.rollNo,
                    status
                }),
            });

            if (response.ok) {
                console.log(`Attendance updated to ${status}`);
                verifyUser(); // Refresh the student list
            } else {
                console.log('Failed to update attendance:', response.statusText);
            }
        } catch (error) {
            console.log('Error updating attendance:', error);
        }
    };

    return (
        <div className='Attendence_box'>
            <h2>Quick Presence</h2>
            <Link href='/quick_presence'>
                <img src="/Icon/QuickPresence/turn-back.png" alt="back" className='backicon' />
            </Link>
            {students.length > 0 && (
                <div className="student-card">
                    <h3>Student Details</h3>
                    <p><strong>Name:</strong> {students[currentIndex].name}</p>
                    <p><strong>Roll No:</strong> {students[currentIndex].rollNo}</p>
                    <p><strong>Status:</strong> {students[currentIndex].status}</p>
                    <div className="attendance-status">
                        <button className='bg-green-200 m-1 rounded p-1 attendence_status_btn' onClick={() => handleAttendanceChange('Present')}>Present</button>
                        <button className='bg-red-500 m-1 rounded p-1 attendence_status_btn' onClick={() => handleAttendanceChange('Absent')}>Absent</button>
                    </div>
                    <button onClick={handlePrevious} className='Quick_presence_btn Previous_btn' disabled={currentIndex === 0}>
                        <img src="/Icon/QuickPresence/arrow-left.png" alt="arrow" className='Navigation_icon' />
                    </button>
                    <button onClick={handleNext} className='Quick_presence_btn Next_btn' disabled={currentIndex === students.length - 1}>
                        <img src="/Icon/QuickPresence/arrow-right.png" alt="arrow" className='Navigation_icon' />
                    </button>
                </div>
            )}
        </div>
    );
};

export default QuickPresence;
