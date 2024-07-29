'use client';
import React, { useState } from 'react';

const StudentInfo = () => {
    const [rollNo, setRollNo] = useState('');
    const [name, setName] = useState('');
    const [classNumber, setClassNumber] = useState('');
    const [section, setSection] = useState('');
    const [batchYear, setBatchYear] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Validate inputs
        if (classNumber < 1 || classNumber > 12) {
            setError('Class number must be between 1 and 12');
            return;
        }

        if (!['A', 'B', 'C', 'D'].includes(section.toUpperCase())) {
            setError('Section must be A, B, C, or D');
            return;
        }

        const currentYear = new Date().getFullYear();
        if (batchYear < currentYear || batchYear > currentYear + 10) {
            setError('Batch year must be within a reasonable range.');
            return;
        }

        // Clear previous errors
        setError('');

        // Prepare the data for API call
        const studentData = {
            rollNo,
            name,
            class: {
                number: classNumber,
                section: section.toUpperCase(),
            },
            batchYear
        };

        try {
            // Send the data to the API
            const response = await fetch('/api/StudentDataEntry', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(studentData),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            // Handle successful submission
            alert('Student data submitted successfully!');
        } catch (error) {
            console.error('Error:', error);
            alert('There was an error submitting the data');
        }
    };

    return (
        <div>
            <h2>Student Information</h2>
            <form onSubmit={handleSubmit} className="student_info">
                <div>
                    <label htmlFor="Roll_no">Roll No</label>
                    <input
                        type="text"
                        id='Roll_no'
                        value={rollNo}
                        onChange={(e) => setRollNo(e.target.value)}
                        placeholder='Roll No'
                        required
                    />
                </div>
                <div>
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        id='name'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder='Enter your Name'
                        required
                    />
                </div>
                <div>
                    <label htmlFor="classNumber">Class Number</label>
                    <input
                        type="number"
                        id='classNumber'
                        value={classNumber}
                        onChange={(e) => setClassNumber(e.target.value)}
                        placeholder='Enter your Class'
                        min="1"
                        max="12"
                        required
                    />
                    <label htmlFor="section">Section</label>
                    <input
                        type="text"
                        id='section'
                        value={section}
                        onChange={(e) => setSection(e.target.value)}
                        placeholder='Enter your Section'
                        maxLength="1"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="batchYear">Batch Year</label>
                    <input
                        type="number"
                        id='batchYear'
                        value={batchYear}
                        onChange={(e) => setBatchYear(e.target.value)}
                        placeholder='Enter your Batch Year'
                        min="2024" // Adjust based on current year
                        max={new Date().getFullYear() + 10}
                        required
                    />
                </div>
                {error && <p className="error text-red-700 font-serif bg-black inline">{error}</p>}
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default StudentInfo;
