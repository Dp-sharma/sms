'use client'
import CreateUser from '@/components/page_component/CreateUser';
import LoginUser from '@/components/page_component/LoginUser';
import React, { useState } from 'react';

const Page = () => {
  const [isLogin, setIsLogin] = useState(true); // State for login view
  const [isRegister, setIsRegister] = useState(false); // State for register view

  // Function to toggle to login view
  const handleLogin = () => {
    setIsLogin(true);
    setIsRegister(false);
  };

  // Function to toggle to register view
  const handleRegister = () => {
    setIsLogin(false);
    setIsRegister(true);
  };

  return (
    <div>
      {/* Conditional rendering based on the current view */}
      {isLogin && (
        <div>
          <button onClick={handleRegister}>Create New User</button>
          <LoginUser />
        </div>
      )}
      {isRegister && (
        <div>
          <button onClick={handleLogin}>Login</button>
          <CreateUser />
        </div>
      )}
    </div>
  );
};

export default Page;
