import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';// Adjust path as necessary
import Student_data from '@/app/models/Student_data';


export async function POST(request) {
    try {
        await connectDB(); // Ensure DB connection

        const { class: { number, section }, batchYear } = await request.json(); // Parse the request body

        // Validate inputs
        if (number < 1 || number > 12) {
            return NextResponse.json({
                success: false,
                msg: 'Class number must be between 1 and 12'
            }, { status: 400 });
        }

        if (!['A', 'B', 'C', 'D'].includes(section.toUpperCase())) {
            return NextResponse.json({
                success: false,
                msg: 'Section must be A, B, C, or D'
            }, { status: 400 });
        }

        // Check if the record for the given batchYear, class number, and section exists
        let record = await Student_data.findOne({
            batchYear,
            'class.number': number,
            'class.section': section.toUpperCase()
        });

        if (record) {
            // Take the record and return as a response
            return NextResponse.json({success:true,Data:record.studentData, status: 200});
            
        }

        return NextResponse.json({
            success: true,
            msg: 'Student data Fetched successfully'
        }, { status: 201 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({
            success: false,
            msg: 'Error saving student data'
        }, { status: 500 });
    }
}


