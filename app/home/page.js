'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const page = () => {
  const router = useRouter();
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
      router.push('/home/teacher');
    }
    if (user === 'Management') {
      router.push('/home/management');
    }
    

    
    
  } catch (error) {
    
    console.error('Error creating user:', error);
    // Handle any network or other errors here
  }}
 
useEffect(() => {
  verifyuser()
}, [])

  return (
    <div>
      <Link href='/register'>
      <button>Login</button>
      </Link>
      
      I a home page
    </div>
  )
}

export default page
