// pages/api/lecture/saveAllocations.js
import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb'; // Adjust the path as necessary
import LectureMain from '@/app/models/Leacture_main'; // Adjust the path to your model

export async function POST(request) {
    try {
        await connectDB(); // Ensure DB connection

        const { allocations } = await request.json(); // Parse the request body

        // Create or update the lecture allocations
        const existingAllocation = await LectureMain.findOne({}); // Adjust your query as needed

        if (existingAllocation) {
            existingAllocation.lectures = allocations; // Update existing record
            await existingAllocation.save();
        } else {
            const newAllocation = new LectureMain({ lectures: allocations });
            await newAllocation.save();
        }

        return NextResponse.json({ 
            message: 'Allocations saved successfully' 
        }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({
            message: 'Error saving allocations',
            error: error.message
        }, { status: 500 });
    }
}

// Handle other HTTP methods if needed
export async function GET(request) {
    return NextResponse.json({
        message: 'Method not allowed'
    }, { status: 405 });
}
