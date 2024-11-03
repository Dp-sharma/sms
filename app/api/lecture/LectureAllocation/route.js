// pages/api/lecture/saveAllocations.js
import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb'; // Adjust the path as necessary
import LectureMain from '@/app/models/Leacture_main'; // Adjust the path to your model

export async function POST(request) {
    try {
        await connectDB(); // Ensure DB connection

        const { allocations, school } = await request.json(); // Parse the request body

        // Debugging logs
        console.log('Parsed school name:', school);
        console.log('Parsed allocations:', allocations);
        
        // Create or update the lecture allocations
        const existingAllocation = await LectureMain.findOne({ School:school }); // Adjust your query as needed

        if (existingAllocation) {
            console.log('Allocation with same school is founded.....');
            
            existingAllocation.lectures = allocations; // Update existing record
            await existingAllocation.save();
            console.log('Updated existing allocation for school:', school);
        } else {
            console.log(allocations); //
            console.log(school); //

            const newAllocation = new LectureMain({ School: school, lectures: allocations });
            await newAllocation.save();
            console.log(newAllocation);
            
            console.log('Created new allocation for school:', school);
            // await LectureMain.create({schoolName : school , Lectures : allocations});
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
