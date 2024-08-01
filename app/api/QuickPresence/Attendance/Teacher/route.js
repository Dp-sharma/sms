import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';  // Make sure to install this package
import { cookies } from "next/headers";
import Student_data from "@/app/models/Student_data";
import connectDB from '@/app/lib/mongodb';
 export async function GET(request) {
    const cookiestore = cookies();
    const token = cookiestore.get('jwtoken');
    
    try {
        await connectDB();
        if (!token) {
            return NextResponse.json({
                success: false,
                msg: 'No token provided',
            }, { status: 401 });
        }
        const value = token.value
        const decoded = jwt.verify(value, process.env.ACCESS_TOKEN_SECRET);
        console.log(decoded); 
         // Extract class information from the decoded token
         const { user } = decoded;
         console.log(user);
         
         const { classTeacher } = user;
         const { className, section } = classTeacher;
 
         console.log("Decoded user:", decoded);
        console.log(className);
        console.log(section);
         // Fetch student data from the database
         const record = await Student_data.findOne({
             'class.number': className,
             'class.section': section.toUpperCase()
         }).exec();
        console.log('This is the student data',record);
         if (record) {
             // Return the student data as response
             return NextResponse.json({
                 success: true,
                 data: record.studentData,
             }, { status: 200 });
         } else {
             // If no record found
             return NextResponse.json({
                 success: false,
                 msg: 'No student data found for the specified class and section',
             }, { status: 404 });
         }
 
    } catch (error) {
        console.log(error)
        return NextResponse.json({
            success: false,
               msg: 'Error'
           },{ status : 400});
    }
 }
