import React from 'react'
import Link from 'next/link'
const Navbar = () => {
  return (
    <div>
      <div className="navbar flex justify-center relative bg-purple-400">
        <a href="/" className="brand mx-10 absolute left-1">SMS</a>
        <ul className="links flex justify-center gap-7">
          <Link href='/home' ><li>Home</li></Link>
          <Link href='/quick_presence' ><li>Quick Presence</li></Link>
          <Link href='/about' ><li>About</li></Link>
          <Link href='/contact' ><li>Contact</li></Link>
        </ul>
      </div>
    </div>
  )
}

export default Navbar
