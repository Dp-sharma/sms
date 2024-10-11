'use client';
import React, { useEffect, useState } from 'react';
import Multiple_Student_info from './Multiple_Student_info';
import './Student_info.css'
import Scrollbar from 'smooth-scrollbar';

const StudentInfo = () => {
    const [rollNo, setRollNo] = useState('');
    const [name, setName] = useState('');
    const [classNumber, setClassNumber] = useState('');
    const [section, setSection] = useState('');
    const [batchYear, setBatchYear] = useState('');
    const [school_name, setSchool_name] = useState('');
    const [manydata, setManydata] = useState(false);
    const [error, setError] = useState('');
    

    useEffect(() => {
        // Ensure Scrollbar is initialized only on client-side and after DOM is ready
        if (typeof window !== 'undefined') {
         const scrollbar = Scrollbar.init(document.querySelector('.student-form'), {
           damping: 0.1, // Customize damping for smoother scroll
           renderByPixels: true, // Improve performance on certain devices
         });
         return () => {
           scrollbar.destroy(); // Cleanup on component unmount
         };
       }
     
       
     }, [])
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
            school_name,
            class: {
                number: classNumber,
                section: section.toUpperCase(),
            },
            batchYear
        };
        
        
        try {
            // Send the data to the API
            const response = await fetch('/api/Student/StudentDataEntry', {
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
        <div className='flex flex-col justify-center'>

            <h2>Student Information</h2>
            {/* Toggle between form and many data section */}
            <button onClick={() => setManydata(!manydata)}>
                {manydata ? 'Show Form' : 'Show Many Data'}
            </button>
            {!manydata ? (
                <form onSubmit={handleSubmit} className="student-form">
                <div className="form-group">
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
                <div className="form-group">
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
                <div className="form-group">
                    <label htmlFor="school_name">School Name</label>
                    <input
                        type="text"
                        id='school_name'
                        value={school_name}
                        onChange={(e) => setSchool_name(e.target.value)}
                        placeholder='Enter your School Name'
                        required
                    />
                </div>
                <div className="form-group">
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
                </div>
                <div className="form-group">
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
                <div className="form-group">
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
                {error && <p className="error-message">{error}</p>}
                <button type="submit" className="submit-button">Submit</button>
            </form>
            ):(
                <div className="many-data-section">
                {/* Replace this with your actual content for many data */}
                <Multiple_Student_info/>
            </div>
            )
            
            }
            
        </div>
    );
};

export default StudentInfo;
