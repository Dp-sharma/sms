import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import connectDB from '@/app/lib/mongodb';
import Attendance from '@/app/models/Attendence_model';

export async function POST(request) {
  const cookiestore = cookies();
  const token = cookiestore.get('jwtoken');
  const { startDate, endDate } = await request.json(); // { startDate: 'YYYY-MM-DD', endDate: 'YYYY-MM-DD' }

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

    // Convert dates to ISO strings with timezone offset
    const start = new Date(startDate).toISOString();
    const end = new Date(endDate).toISOString();

    console.log('Querying for dates:', start, end);
    console.log('class name:', className, 'section', section);
    
    // Fetch attendance records from the database
    const attendanceRecords = await Attendance.find({
      date: { $gte: new Date(start), $lte: new Date(end) },
      'class.number': className,
      'class.section': section.toUpperCase()
    }).exec();
    console.log(attendanceRecords);
    
    if (attendanceRecords.length > 0) {
      return NextResponse.json({
        success: true,
        data: attendanceRecords,
      }, { status: 200 });
    } else {
      return NextResponse.json({
        success: false,
        msg: 'No attendance records found for the specified date range',
      }, { status: 404 });
    }

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ success: false, msg: 'Error' }, { status: 400 });
  }
}
