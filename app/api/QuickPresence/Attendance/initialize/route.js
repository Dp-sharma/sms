// app/api/attendance/initialize/route.js
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from "next/headers";
import connectDB from '@/app/lib/mongodb';
import Student_data from '@/app/models/Student_data';
import Attendance from '@/app/models/Attendence_model';

export async function GET(request) {
  const cookiestore = cookies();
  const token = cookiestore.get('jwtoken');
  const today = new Date();
  const dateString = today.toISOString().split('T')[0]; // Format as YYYY-MM-DD

  try {
    await connectDB();

    if (!token) {
      return NextResponse.json({ success: false, msg: 'No token provided' }, { status: 401 });
    }

    const value = token.value;
    const decoded = jwt.verify(value, process.env.ACCESS_TOKEN_SECRET);
    const { user } = decoded;
    const { classTeacher } = user;
    const { className, section } = classTeacher;

    // Check if attendance record exists for today
    let attendanceRecord = await Attendance.findOne({
      date: dateString,
      'class.number': className,
      'class.section': section.toUpperCase()
    }).exec();

    if (!attendanceRecord) {
      // If not exists, create an initial attendance record with all students absent
      const studentRecord = await Student_data.findOne({
        'class.number': className,
        'class.section': section.toUpperCase()
      }).exec();
      
      if (studentRecord) {
        const records = studentRecord.studentData.map(student => ({
          rollNo: student.rollNo,
          status: 'Absent'
        }));

        attendanceRecord = new Attendance({
          date: dateString,
          class: { number: className, section: section.toUpperCase() },
          records
        });

        await attendanceRecord.save();
      }
    }

    return NextResponse.json({ success: true, data: attendanceRecord.records }, { status: 200 });

  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, msg: 'Error' }, { status: 400 });
  }
}
