'use client'
import React, { useState } from 'react';
import './CreateUser.css'
import Button from '../layout_component/Button';

const CreateUser = () => {
  const [firstName, setFirstName] = useState('');
  const [designation, setDesignation] = useState('');
  const [role, setRole] = useState('');
  const [position, setPosition] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [className, setClassName] = useState('');
  const [section, setSection] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userData = {
      firstName,
      role,
      position,
      contact: {
        mobileNumber,
        email,
      },
      bio: {
        dob,
        gender,
      },
      ...(position === 'Staff' && role === 'Teacher' ? { classTeacher: { className, section } } : {}),
    };
    console.log(userData);
    try {
      // Replace with actual API call to create user
      const response = await fetch('api/user/CreateUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        alert('User created successfully');
        console.log('User created successfully!');
        // Optionally, handle success scenario (e.g., show a success message)
      } else {
        console.error('Failed to create user');
        // Optionally, handle error scenario (e.g., show an error message)
      }
    } catch (error) {
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
          First Name:
          <input type="text"className='myinput' value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        </label>
        
        <h3 className='inline'>Designation</h3>
        <label>
          Position:
          <select value={position} onChange={(e) => setPosition(e.target.value)}>
                    <option value="">Select Position</option>
                    <option value="Management">Management</option>
                    <option value="Head">Head</option>
                    <option value="Staff">Staff</option>
                  </select>
        </label>
        
        {position && (
              <div>
                {position === 'Management' && (
                  <div>
                    <label>
                      Role:
                      <select value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="">Select Role</option>
                        <option value="Secretary">Secretary</option>
                        <option value="Treasurer">Treasurer</option>
                        <option value="Custom">Custom</option>
                      </select>
                    </label>
                  </div>
                )}
                {position === 'Head' && (
                  <div>
                    <label>
                      Role:
                      <select value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="">Select Role</option>
                        <option value="Head Master/Mistress">Head Master/Mistress</option>
                        <option value="Principal">Principal</option>
                        <option value="Vice Principal">Vice Principal</option>
                      </select>
                    </label>
                  </div>
                )}
                {position === 'Staff' && (
                  <div>
                    <label>
                      Class Teacher:
                      <select value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="">Select Role</option>
                        <option value="Teacher">Teacher</option>
                        <option value="Office">Office</option>
                      </select>
                    </label>
                   
                  </div>
                )}{role === 'Teacher' && (
                  <div>
                    <label>
                      Role:
                      <input className='myinput' type="number" min={1} max={12} value={className} placeholder='Class' onChange={(e)=>{setClassName(e.target.value)}}/>
                      <select value={section} onChange={(e) => setSection(e.target.value)}>
                        <option value="">Select Section</option>
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                      </select>
                    </label>
                  </div>
                )}
              </div>
            )}
            
        <label>
          Contact - Mobile Number:
          <input type="text" className='myinput' value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} />
        </label>
        
        <label>
          Contact - Email:
          <input type="email" className='myinput' value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        
        <label>
          Bio - Date of Birth:
          <input type="date" className='myinput' value={dob} onChange={(e) => setDob(e.target.value)} />
        </label>
        
        <label>
          Bio - Gender:
          <select value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </label>
        
        {/* <button type="submit">Submit</button> */}
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

export default CreateUser;
