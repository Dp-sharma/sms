'use client'
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation';

const page = () => {
  const [allocations, setAllocations] = useState({});
  const [school, setSchool] = useState('');
  const router = useRouter();
  const verifylecturetable = async () => {
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
       } catch (error) {
      console.error('Error:', error);
    }
  }

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
    console.log(data.data.role);
    const user = data.data.role;
    if (user === 'Teacher') {
      router.push('/lecture/teacher');
      console.log('Whats Up buddy');
      
    }
    if (user === 'Management') {
      router.push('/lecture/management');
      
      
    }
    

    
    
  } catch (error) {
    
    console.error('Error creating user:', error);
    // Handle any network or other errors here
  }}
 
useEffect(() => {
  verifyuser();
  verifylecturetable();
}, [])
  return (
    <div>
      Hey I am the lecture page for teacher
      <button onClick={verifylecturetable}>
          verifylecture 
      </button>
    </div>
  )
}

export default page
