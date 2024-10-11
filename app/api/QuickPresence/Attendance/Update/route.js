// app/api/attendance/update/route.js
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from "next/headers";
import connectDB from '@/app/lib/mongodb';

import Attendance from '@/app/models/Attendence_model';

export async function POST(request) {
  const cookiestore = cookies();
  const token = cookiestore.get('jwtoken');
  const { rollNo, status } = await request.json(); // { rollNo: '123', status: 'Present' }

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

    const attendanceRecord = await Attendance.findOne({
      date: dateString,
      'class.number': className,
      'class.section': section.toUpperCase()
    }).exec();

    if (attendanceRecord) {
      const recordIndex = attendanceRecord.records.findIndex(record => record.rollNo === rollNo);

      if (recordIndex > -1) {
        attendanceRecord.records[recordIndex].status = status;
        await attendanceRecord.save();
        return NextResponse.json({ success: true, msg: 'Attendance updated' }, { status: 200 });
      } else {
        return NextResponse.json({ success: false, msg: 'Student not found' }, { status: 404 });
      }
    } else {
      return NextResponse.json({ success: false, msg: 'Attendance record not found' }, { status: 404 });
    }

  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, msg: 'Error' }, { status: 400 });
  }
}
