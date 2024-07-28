import React from 'react'
import Link from 'next/link'
const Navbar = () => {
  return (
    <div>
      <div className="navbar flex gap-10">
        <a href="/" className="brand mx-10">SMS</a>
        <ul className="links flex justify-center gap-7">
          <Link href='/home' ><li>Home</li></Link>
          <Link href='/about' ><li>About</li></Link>
          <Link href='/contact' ><li>Contact</li></Link>
        </ul>
      </div>
    </div>
  )
}

export default Navbar
