'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import './Navbar.css'
import Head from 'next/head'
import Scrollbar from 'smooth-scrollbar';

const Navbar = ({ activeItem }) => {
  useEffect(() => {
    // Ensure Scrollbar is initialized only on client-side and after DOM is ready
    if (typeof window !== 'undefined') {
     const scrollbar = Scrollbar.init(document.querySelector('.sidebar_div'), {
       damping: 0.1, // Customize damping for smoother scroll
       renderByPixels: true, // Improve performance on certain devices
     });
     return () => {
       scrollbar.destroy(); // Cleanup on component unmount
     };
   }
 
   
 }, [])
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };
  const closeSidebar = () => {
    setSidebarOpen(false);
  };
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      // Request fullscreen on the root element
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen mode: ${err.message} (${err.name})`);
      });
    } else {
      // Exit fullscreen mode
      document.exitFullscreen().catch((err) => {
        console.error(`Error attempting to exit fullscreen mode: ${err.message} (${err.name})`);
      });
    }
  };

  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=Plaster&display=swap" rel="stylesheet" />
      </Head>
      <div className='Navigation'>
        <div className="banner">
          <div className="sidebar-toggle" onClick={toggleSidebar}>
            <img src="/Icon/sidebar/toggle.png" alt="toggle" className='toggle-img' />
          </div>
          <div className="brand-logo plaster-regular">
            <Link href='/home'><h1 className='plaster-regular'>SMS</h1></Link>
          </div>
        </div>


        <div className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
          <div className='sidebar_div'>
            <details>
              <summary> Student </summary>
              
              <ul>
                <Link href='/student_info'>
                  <li>
                    Data Entry
                  </li>
                </Link>
                
              </ul>
              
            </details>
            <details>
              <summary> Teacher </summary>
              <ul>
                <Link href='/register'>
                  <li>
                     Register
                  </li>
                </Link>
              </ul>
            </details>
            <details>
              <summary> Attendance </summary>
              <ul>
                <Link href='/quick_presence/multipleattendance'>
                  <li>
                     Multiple Attendance
                  </li>
                </Link>
              </ul>
            </details>
          </div>


        </div>
        {/* Overlay */}
        {isSidebarOpen && <div className="overlay" onClick={closeSidebar}></div>}
        <div className="Navbar flex justify-center  ">
          {/* <a href="/" className="brand mx-10 absolute left-1">SMS</a> */}
          <ul className="Nav-ul">
            <Link href='/home' >
              <li className={`Nav-li ${activeItem === 'home' ? 'active' : ''}`}>
                <img src="/Icon/navbar/home (1).png" alt="home" className={`icon ${activeItem === 'home' ? 'active_icon' : ''}`} />
                <span className='icon_text'>Home</span>
              </li>
            </Link>
            <Link href='/quick_presence' >
              <li className={`Nav-li ${activeItem === 'attendence' ? 'active' : ''}`}>
                <img src="/Icon/navbar/immigration.png" alt="Attendence" className={`icon ${activeItem === 'attendence' ? 'active_icon' : ''}`} />
                <span className='icon_text'>Attendence</span>
              </li>
            </Link>
            <Link href='/grade' >
              <li className={`Nav-li ${activeItem === 'exam' ? 'active' : ''}`}>
                <img src="/Icon/navbar/exam.png" alt="Exam" className={`icon ${activeItem === 'exam' ? 'active_icon' : ''}`} />
                <span className='icon_text'>Exam</span>
              </li>
            </Link>
            <Link href='/lecture' >
              <li className={`Nav-li ${activeItem === 'lecture' ? 'active' : ''}`}>
                <img src="/Icon/navbar/delegation.png" alt="lecture" className={`icon ${activeItem === 'lecture' ? 'active_icon' : ''}`} />
                <span className='icon_text'>Lecture</span>
              </li>
            </Link>
          </ul>
        </div>
        <div className="nav-action-bar">
          <div className="notification">
            <abbr title="Notification">
              <img src="/Icon/navbar/ringing.png" alt="Notification" className='nav-action-icon' />
            </abbr>
          </div>
          <div className="Settings" onClick={toggleFullscreen}>
            <abbr title="Settings">
              <img src="/Icon/navbar/settings.png" alt="Settings" className='nav-action-icon' />
            </abbr>
          </div>
        </div>

      </div>
    </>
  )
}

export default Navbar
