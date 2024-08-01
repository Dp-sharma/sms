'use clients'
import React, { useEffect, useState } from 'react';
import './Quick_presence.css'
const QuickPresence = () => {
    const [students, setStudents] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [attendanceStatus, setAttendanceStatus] = useState('Present');

    const verifyUser = async () => {
        try {
            console.log('Verifying user');
            const response = await fetch('/api/QuickPresence/Attendance/initialize', {
                method: 'Get',
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
            console.log(error);
        }
    }
    useEffect(() => {
        console.log('I am running');
        verifyUser();
    }, [])

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
    const handleAttendanceChange = (e) => {
        setAttendanceStatus(e.target.value);
    };
    const handleSubmitAttendance = async () => {
        const student = students[currentIndex];
        console.log(student);
        try {
            const response = await fetch('/api/QuickPresence/attendance/Update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    rollNo: student.rollNo,
                    status: attendanceStatus
                }),
            });

            if (response.ok) {
                alert('Attendance updated successfully');
                initializeAttendance(); // Refresh attendance data
            } else {
                console.log(response);
                console.log('Failed to update attendance:', response.statusText);
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className='Attendence_box'>
            <h2>Quick Presence</h2>

            {students.length > 0 && (
        <div className="student-card">
          <h3>Student Details</h3>
          <p><strong>Name:</strong> {students[currentIndex].name}</p>
          <p><strong>Roll No:</strong> {students[currentIndex].rollNo}</p>
          <div className="attendance-status">
            <label>
              <input
                type="radio"
                value="Present"
                checked={attendanceStatus === 'Present'}
                onChange={handleAttendanceChange}
              />
              Present
            </label>
            <label>
              <input
                type="radio"
                value="Absent"
                checked={attendanceStatus === 'Absent'}
                onChange={handleAttendanceChange}
              />
              Absent
            </label>
          </div>
          <button onClick={handleSubmitAttendance} className='Quick_presence_btn'>
            Update Attendance
          </button>
        </div>
      )}

            <div className="navigation-buttons">
                <button onClick={handlePrevious} className='Quick_presence_btn' disabled={currentIndex === 0}>Previous</button>
                <button onClick={handleNext} className='Quick_presence_btn' disabled={currentIndex === students.length - 1}>Next</button>
            </div>
        </div>
    );
};

export default QuickPresence;
