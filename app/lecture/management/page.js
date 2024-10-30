'use client';
import React, { useEffect, useState } from 'react';

const Page = () => {
  // State to store fetched data and teacher allocations
  const [data, setData] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [allocations, setAllocations] = useState({});
  
  // Define periods and classes
  const periods = [1, 2, 3, 4, 5, 6];
  const classes = ['11 A', '11 B', '11 C', '12 A', '12 B', '12 C'];


  // fetching the already stored data in the Databse for the Lecture model
  
  

  // Function to verify user and fetch teacher data
  const verifyUser = async () => {
    try {
      console.log("Fetching user data...");

      // Fetch user data
      const response = await fetch('/api/lecture/TeacherData', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Handle response errors
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || 'Something Went Wrong');
      }

      const data = await response.json();
      const schoolName = data.data.school;

      // Fetch teacher data based on the school name
      const postResponse = await fetch('/api/lecture/TeacherData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ School: schoolName }),
      });

      // Handle response errors
      if (!postResponse.ok) {
        const errorData = await postResponse.json();
        throw new Error(errorData.msg || 'Error fetching teacher data');
      }

      const postData = await postResponse.json();
      // Set state with fetched data
      setData(postData.Data);
      setTeachers(postData.Data);
      console.log('Fetched data:', postData.Data);

    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Fetch user and teacher data when the component mounts
  useEffect(() => {
    verifyUser();
  }, []);

  // Add this function to your existing Page component
  const saveAllocations = async () => {
    try {
      // Create the structured allocations array
      const structuredAllocations = Object.keys(allocations).map(className => {
        const [classNumber, classSection] = className.split(' '); // Split class name into number and section
        return {
          class: { 
            number: parseInt(classNumber), // Convert number to integer
            section: classSection 
          },
          lectureList: periods.map(period => {
            const teacherName = allocations[className]?.[period]; // Get the teacher name
            const teacher = teachers.find(t => `${t.firstName} ${t.lastName}` === teacherName);
            console.log(teacher);
            
            const subject = teacher ? teacher.subject || null : null; // Get teacher's subject or null if not available
            console.log(subject);
            
            return {
              lectureNumber: period, // Assuming periods represent lecture numbers
              subject: subject, // Set subject here
              teacher: teacherName || null // Save teacher name or null if no teacher is assigned
            };
          })
        };
      });
      console.log(structuredAllocations);
      
      const response = await fetch('/api/lecture/LectureAllocation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ allocations: structuredAllocations }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error saving allocations');
      }

      const result = await response.json();
      console.log(result.message); // Display success message or handle it as needed

    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Function to handle teacher selection change
  const handleTeacherChange = (className, period, teacherName) => {
    setAllocations((prevAllocations) => ({
      ...prevAllocations,
      [className]: {
        ...prevAllocations[className],
        [period]: teacherName,
      },
    }));
  };

  // Function to render the dropdown for teacher selection
  const renderDropdown = (className, period) => {
    // Gather all assigned teachers for the same period across all classes
    const assignedTeachers = {};
    Object.keys(allocations).forEach(cls => {
      if (allocations[cls][period]) {
        assignedTeachers[allocations[cls][period]] = true;
      }
    });

    // Filter available teachers based on assignments for the current period
    const availableTeachers = teachers.filter(teacher => 
      !assignedTeachers[`${teacher.firstName} ${teacher.lastName}`] || allocations[className]?.[period] === `${teacher.firstName} ${teacher.lastName}`
    );

    // Render the dropdown
    return (
      <select 
        value={allocations[className]?.[period] || ''} 
        onChange={(e) => handleTeacherChange(className, period, e.target.value)}
        className="border rounded-md p-1 text-sm"
      >
        <option value="">Select Teacher</option>
        {availableTeachers.map(teacher => (
          <option key={teacher._id} value={`${teacher.firstName} ${teacher.lastName}`}>
            {teacher.firstName} {teacher.lastName}
          </option>
        ))}
      </select>
    );
  };

  // Function to display the selected teacher's name and reallocation option
  const renderSelectedTeacher = (className, period) => {
    const selectedTeacherName = allocations[className]?.[period];
    if (selectedTeacherName) {
      const teacher = teachers.find(t => `${t.firstName} ${t.lastName}` === selectedTeacherName);
      return (
        <div className="flex items-center">
          <span className="truncate w-28" title={selectedTeacherName}>{selectedTeacherName}</span>
          <button
            className="ml-2 text-blue-500"
            onClick={() => handleTeacherChange(className, period, '')} // Reset the selection
          >
            <img src="/Icon/Lecture/Head/editAllocation.png" alt="" className="h-4" />
          </button>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Lecture Management</h1>
      <button 
        onClick={saveAllocations} 
        className="mb-4 bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600"
      >
        Save Allocations
      </button>
      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 text-left text-gray-600">Class</th>
              {periods.map(period => (
                <th key={period} className="px-4 py-2 text-left text-gray-600">Period {period}</th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white">
            {classes.map(className => (
              <tr key={className} className="border-b hover:bg-gray-100">
                <td className="px-4 py-2">{className}</td>
                {periods.map(period => (
                  <td key={period} className="px-4 py-2">
                    {renderSelectedTeacher(className, period) || renderDropdown(className, period)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Page;
