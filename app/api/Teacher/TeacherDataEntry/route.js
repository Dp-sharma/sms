import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import Teacher_data from '@/app/models/Teacher_data';

export async function POST(request) {
    try {
        
        await connectDB(); // Ensure DB connection
        // Parse the request body
        const requestBody = await request.json();
        
        // Destructure required fields from the parsed JSON data
        const {
            name,
            designation,
            classTeacher,
            contactNo,
            email,
            qualification,
            dob,
            Subject
        } = requestBody;

        // Validate inputs
        if (!name || !designation || !contactNo || !email || !qualification || !dob || !Subject || !classTeacher) {
            return NextResponse.json({
                success: false,
                msg: 'Missing required fields in request body'
            }, { status: 400 });
        }

        const { number, section } = classTeacher || {};

        if (!number || typeof number !== 'number' || number < 1 || number > 12) {
            return NextResponse.json({
                success: false,
                msg: 'Invalid class number. It must be between 1 and 12'
            }, { status: 400 });
        }

        if (!section || typeof section !== 'string' || !['A', 'B', 'C', 'D'].includes(section.toUpperCase())) {
            return NextResponse.json({
                success: false,
                msg: 'Invalid section. It must be A, B, C, or D'
            }, { status: 400 });
        }
        
        // Check if a teacher with the same name, contactNo, and dob already exists
        let record = await Teacher_data.findOne({
            name,
            contactNo,
            dob,
            'class.number': number
        });

        if (record) {
            return NextResponse.json({
                success: false,
                msg: 'Teacher with this record already exists'
            }, { status: 400 });
        }
      
        // Create a new teacher record
        const newTeacher = new Teacher_data({
            classTeacher: { number, section: section.toUpperCase() },
            TeacherData: [{ name, designation, contactNo, email, qualification, dob, Subject }]
        });

        // Save the new record to the database
        await newTeacher.save();

        return NextResponse.json({
            success: true,
            msg: 'Teacher data saved successfully'
        }, { status: 201 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({
            success: false,
            msg: 'Error saving teacher data'
        }, { status: 500 });
    }
}
