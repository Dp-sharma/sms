import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';// Adjust path as necessary
import jwt from 'jsonwebtoken';
import User from "@/app/models/User_model";
export async function POST(request) {
    try {
        await connectDB(); // Ensure DB connection

        const { School } = await request.json(); // Parse the request body

        // Validate inputs
       

        // Check if the record for the given batchYear, class number, and section exists
        let record = await User.find({
           school:School
        });

        if (record) {
            console.log(record);
            
            // Take the record and return as a response
            return NextResponse.json({success:true,Data:record, status: 200});
            
        }

        return NextResponse.json({
            success: true,
            data:record,
            msg: 'Teacher data Fetched successfully'
        }, { status: 201 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({
            success: false,
            msg: 'Error saving student data'
        }, { status: 500 });
    }
}

// Get request to get student data
import { cookies } from "next/headers";
// import User from '@/app/models/User_model';
 export async function GET(request) {
    const cookiestore = cookies();
    const token = cookiestore.get('jwtoken');
    const value = token.value
    try {
        const decoded = jwt.verify(value, process.env.ACCESS_TOKEN_SECRET);
        const Currentuser = decoded.user;
        console.log("Decoded user:", Currentuser);
        return NextResponse.json({
            success:true,
            data:Currentuser,
        },{
            status: 200
        })
    } catch (error) {
        console.log(error)
        return NextResponse.json({
            success: false,
               msg: 'Error'
           },{ status : 400});
    }
 }
