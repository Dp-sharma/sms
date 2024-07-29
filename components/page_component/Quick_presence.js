'use clients'
import React, { useState } from 'react';

const QuickPresence = () => {
    const [batchYear, setBatchYear] = useState('');
    const [classNumber, setClassNumber] = useState('');
    const [section, setSection] = useState('');
    const [students, setStudents] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    const fetchData = async () => {
        const classData = {
            class: {
                number: classNumber,
                section: section.toUpperCase(),
            },
            batchYear
        };
        try {
            // Send the data to the API
            const response = await fetch('/api/StudentData', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(classData),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const responseData = await response.json(); // Parse response data
            console.log(responseData.Data);
            setStudents(responseData.Data); // Update students state with fetched data
            // setStudents(response.Data);
            // Handle successful submission
            alert('Student data Recived successfully!');
        } catch (error) {
            console.error('Error:', error);
            alert('There was an error submitting the data');
        }
    };

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

    return (
        <div>
            <h2>Quick Presence</h2>
            <div className="input-section">
                <input
                    type="number"
                    placeholder="Enter Batch Year"
                    value={batchYear}
                    onChange={(e) => setBatchYear(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Enter Class Number"
                    value={classNumber}
                    onChange={(e) => setClassNumber(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Enter Section"
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                />
                <button onClick={fetchData}>Fetch Student Data</button>
            </div>

            {students.length > 0 && (
                <div className="student-card">
                    <h3>Student Details</h3>
                    <p><strong>Name:</strong> {students[currentIndex].name}</p>
                    <p><strong>Roll No:</strong> {students[currentIndex].rollNo}</p>
                </div>
            )}

            <div className="navigation-buttons">
                <button onClick={handlePrevious} disabled={currentIndex === 0}>Previous</button>
                <button onClick={handleNext} disabled={currentIndex === students.length - 1}>Next</button>
            </div>
        </div>
    );
};

export default QuickPresence;
