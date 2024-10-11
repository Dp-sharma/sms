'use client';
import CreateUser from '@/components/page_component/CreateUser';
import LoginUser from '@/components/page_component/LoginUser';

import React, { useState } from 'react';

import MultipleUserRegister from '@/components/page_component/MultipleUserRegister';

const Page = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isRegister, setIsRegister] = useState(false);
  const [isMultipleRegister, setIsMultipleRegister] = useState(false); // State for multiple register view

  // Function to toggle to login view
  const handleLogin = () => {
    setIsLogin(true);
    setIsRegister(false);
    setIsMultipleRegister(false);
  };

  // Function to toggle to register view
  const handleRegister = () => {
    setIsLogin(false);
    setIsRegister(true);
    setIsMultipleRegister(false);
  };

  // Function to toggle to multiple register view
  const handleMultipleRegister = () => {
    setIsLogin(false);
    setIsRegister(false);
    setIsMultipleRegister(true);
  };

  return (
    <div>
      {isLogin && (
        <div>
          <button onClick={handleRegister}>Create New User</button>
          <button onClick={handleMultipleRegister}>Upload Multiple Users</button>
          <LoginUser />
        </div>
      )}
      {isRegister && (
        <div>
          <button onClick={handleLogin}>Login</button>
          <CreateUser />
        </div>
      )}
      {isMultipleRegister && (
        <div>
          <button onClick={handleLogin}>Login</button>
          <MultipleUserRegister/>
          
        </div>
      )}
    </div>
  );
};

export default Page;
