'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';

const page = () => {
  const [allocations, setAllocations] = useState({});
  
  const router = useRouter();
  const verifylecturetable = async (school) => {
    console.log('this is the school name',school);
    
    try {
      const lecturetable = await fetch('/api/lecture/LectureManagementTable', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ School: school }),
      });
      // Handle response errors
      if (!lecturetable.ok) {
        console.log('Response is not ok');

        const errorData = await lecturetable.json();
        throw new Error(errorData.msg || 'Something Went Wrong');
      }
      const response = await lecturetable.json();
      console.log(response);
      setAllocations(response)
       } catch (error) {
      console.error('Error:', error);
    }
  }

  const verifyuser = async () => { try {
    // Replace with actual API call to create user
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
    //log the data in response
    const data = await response.json();
    
    verifylecturetable(data.data.school);
    console.log(data.data);
    console.log(data.data.school);
    const user = data.data.role;
    
    

    
    
  } catch (error) {
    
    console.error('Error creating user:', error);
    // Handle any network or other errors here
  }}
 
useEffect(() => {
  verifyuser();
  
}, [])
  return (
    <div>
      Hey I am the lecture page for teacher
      <button onClick={verifylecturetable}
      className="mb-4 bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600"
      >
          verifylecture 
      </button>
      
    </div>
  )
}

export default page
