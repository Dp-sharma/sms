import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';// Adjust path as necessary


import LectureMain from '@/app/models/Leacture_main';
export async function POST(request) {
    try {
        console.log('Welcome to the route of lecture manganement model');
        await connectDB(); // Ensure DB connection
        const { School } = await request.json(); // Parse the request body
        console.log(School);
        
        // Validate inputs
       

        // Check if the record for the given batchYear, class number, and section exists
        let record = await LectureMain.find({
           School:School
        });

        if (record) {
            console.log('This is the record founded in the database :',record);
            
            // Take the record and return as a response
            return NextResponse.json({success:true,Data:record, status: 200});
            
        }

        return NextResponse.json({
            success: true,
            data:record,
            msg: 'Lecture Management Table data has been fetched successfully'
        }, { status: 201 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({
            success: false,
            msg: error.message,
        }, { status: 500 });
    }
}