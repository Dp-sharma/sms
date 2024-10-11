// app/api/user/multiple-register/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import User from '@/app/models/User_model';
import * as XLSX from 'xlsx/xlsx.mjs';

export async function POST(request) {
    try {
        await connectDB(); // Ensure DB connection
        
        const formData = await request.formData();
        const file = formData.get('file');

        if (!file) {
            return NextResponse.json({ success: false, msg: 'No file uploaded' }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(worksheet);
        console.log(data);
        
        for (let user of data) {
            const {school, firstName, role, position, mobileNumber, email, dob, gender, className, section } = user;

            // Check if the user already exists
            const existingUser = await User.findOne({
                $or: [
                    
                    
                    { "contact.mobileNumber": mobileNumber },
                    { "contact.email": email }
                ]
            });
            
            
            if (!existingUser) {
                
                const userData = {
                    school,
                    firstName,
                    role,
                    position,
                    contact: { mobileNumber, email },
                    bio: { dob, gender },
                };

                if (position === 'Staff' && role === 'Teacher' && className && section) {
                    userData.classTeacher = { className, section };
                }

                await User.create(userData);
            }
            
            
            
            
        }
        return NextResponse.json({success: true, msg:'User Registered Successfully'},{status:200});
        // return NextResponse.json({ success: false, msg: 'Users already Exsit' }, { status: 400 });
        

    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, msg: 'Error processing file' }, { status: 500 });
    }
}

export const config = {
    api: {
        bodyParser: false, // Required to handle file uploads
    },
};
