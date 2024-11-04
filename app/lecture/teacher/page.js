'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const Page = () => {
  const [allocations, setAllocations] = useState({});
  const [periods, setPeriods] = useState([]);
  const router = useRouter();

  const verifyLectureTable = async (school, teacherName) => {
    console.log('School name:', school);
    
    try {
      const lectureTableResponse = await fetch('/api/lecture/LectureManagementTable', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ School: school }),
      });

      if (!lectureTableResponse.ok) {
        console.log('Response is not ok');
        const errorData = await lectureTableResponse.json();
        throw new Error(errorData.msg || 'Something Went Wrong');
      }

      const response = await lectureTableResponse.json();
      console.log(response);
      setAllocations(response);
      
      // Create an array for periods
      const maxPeriods = 6; // Assuming max 6 periods based on your data
      const periodsData = Array(maxPeriods).fill(null).map(() => []);

      // Populate periodsData
      response.Data.forEach(schoolData => {
        schoolData.lectures.forEach(({ class: classInfo, lectureList }) => {
          lectureList.forEach(lecture => {
            if (lecture.teacher.includes(teacherName)) {
              const periodIndex = lecture.lectureNumber - 1; // Zero-based index
              periodsData[periodIndex].push({
                className: `${classInfo.number} ${classInfo.section}`,
                subject: lecture.subject,
              });
            }
          });
        });
      });

      setPeriods(periodsData);

    } catch (error) {
      console.error('Error:', error);
    }
  };

  const verifyUser = async () => {
    try {
      const response = await fetch('/api/home', {
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
      
      const data = await response.json();
      console.log(data.data);
      console.log(data.data.school);
      
      const teacherName = data.data.firstName; // Get the teacher's name
      verifyLectureTable(data.data.school, teacherName); // Pass teacherName to the function
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  useEffect(() => {
    verifyUser();
  }, []);

  return (
    <div>
      <h1>Lecture Page for Teacher</h1>
      {periods.length > 0 ? (
        <ul>
          {periods.map((periodClasses, index) => (
            <li key={index}>
              <strong>Period {index + 1}:</strong>
              {periodClasses.length > 0 ? (
                <ul>
                  {periodClasses.map((lecture, idx) => (
                    <li key={idx}>
                      Class: {lecture.className}, Subject: {lecture.subject}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No classes for this period.</p>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No lectures found for this teacher.</p>
      )}
    </div>
  );
};

export default Page;
