'use client'
import React, { useState } from 'react'
import Button from '../layout_component/Button';
import { useRouter } from 'next/navigation';

const LoginUser = () => {
    const [firstName, setFirstName] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [dob, setDob] = useState('');
    const [error, setError] = useState('')
    const router = useRouter();
    const handleSubmit = async (e) => {
      e.preventDefault();
      const userData = {
        firstName,
        mobileNumber,
        dob,
      };
  
      try {
        // Replace with actual API call to create user
        const response = await fetch('api/user/Login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          setError(errorData.msg);
          console.log(errorData);
          throw new Error(errorData.msg || 'Something Went Wrong');
  
        }
        console.log('Data has been send to Database');
        // Redirect to the Quick_presence page
        router.push('/quick_presence');
      } catch (error) {
        setError(error.message);
        console.error('Error creating user:', error);
        // Handle any network or other errors here
      }
    };
  
    return (
      <div className='form_box' >
        <div >
          <img src="Register.jpg" alt="Register image" className='Register_image'/>
        </div>
        <form onSubmit={handleSubmit} className='form_container'>
          <label>
            Full Name:
            <input type="text"className='myinput' value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          </label>
          <label>
            Contact - Mobile Number:
            <input type="text" className='myinput' value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} />
          </label>
          <label>
            Bio - Date of Birth:
            <input type="date" className='myinput' value={dob} onChange={(e) => setDob(e.target.value)} />
          </label>
          {error &&(
            <p className="error text-red-700">{error}</p>
          )}
          <Button
          bgco="#0070f3"       // Background color
          hbgco="#005bb5"      // Hover background color
          textColor="#ffffff"  // Text color
        >
          Click Me
        </Button>
        </form>
      </div>
    );
  };

export default LoginUser
