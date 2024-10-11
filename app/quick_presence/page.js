'use client'
import React, { useEffect } from 'react'
import Link from 'next/link'


import Quick_presence_dashboard from '@/components/page_component/Quick_presence_dashboard'

const page = () => {
    
  // 
  

  return (
    <div >
      <Quick_presence_dashboard/>
      
      {/* <Link href='/student_info' ><li>Add Student Data</li></Link> */}
    </div>
  )
}

export default page
