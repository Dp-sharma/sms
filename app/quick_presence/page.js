'use client'
import React from 'react'
import Link from 'next/link'
import QuickPresence from '@/components/page_component/Quick_presence'
import StudentInfo from '@/components/page_component/Student_info'
const page = () => {
    


  return (
    <div>

      <QuickPresence/>
      <Link href='/student_info' ><li>Add Student Data</li></Link>
    </div>
  )
}

export default page
