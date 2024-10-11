import connectDB from "@/app/lib/mongodb";
import { NextResponse } from "next/server";
import User from "@/app/models/User_model";

export async function POST(request) {
    try {
        await connectDB(); // Ensure DB is connected

        const {
            school,
            firstName,
            role,
            position,
            contact: { mobileNumber, email },
            bio: { dob, gender },
            classTeacher // This will be optional
        } = await request.json();

        // Check if the user already exists
        const existingUser = await User.findOne({
            $or: [
                
                { "contact.mobileNumber": mobileNumber },
                { "contact.email": email }
            ]
        });

        if (existingUser) {
            console.log(existingUser);
            
            console.log('User already exists');
            return NextResponse.json({
                success: false,
                msg: 'User already exists',
            }, { status: 400 });
        }
        
        // Create a user object conditionally based on role and position
        const userData = {
            school,
            firstName,
            role,
            position,
            contact: { mobileNumber, email },
            bio: { dob, gender }
        };
        console.log(userData);
        
        if (position === 'Staff' && role === 'Teacher' && classTeacher) {
            userData.classTeacher = classTeacher;
        }

        await User.create(userData);

        return NextResponse.json({
            success: true,
            msg: 'User created successfully',
        }, { status: 200 });

    } catch (error) {
        console.log(error);
        return NextResponse.json({
            success: false,
            msg: 'Error: ' + error.message,
        }, { status: 500 });
    }
}
