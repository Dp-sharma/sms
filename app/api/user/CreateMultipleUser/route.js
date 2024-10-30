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
            console.log("no file uploaded!");
            
            return NextResponse.json({ success: false, msg: 'No file uploaded' }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(worksheet);
        console.log(data);

        for (let user of data) {
            const {
                school, firstName, role, position, mobileNumber, email, dob, gender, className, section, subject
            } = user;

            // Check if the required fields are provided (at least 'school' and 'firstName')
            if (!school || !firstName || !role || !mobileNumber || !email || !dob || !gender) {
                console.log("missing required fields");
                
                return NextResponse.json({ success: false, msg: 'Missing required fields in the uploaded data' }, { status: 400 });
            }

            // Check if the user already exists by mobile number or email
            const existingUser = await User.findOne({
                $or: [
                    { "contact.mobileNumber": mobileNumber },
                    { "contact.email": email }
                ]
            });

            if (!existingUser) {
                // User data object to be inserted
                const userData = {
                    school,
                    firstName,
                    role,
                    position,
                    contact: { mobileNumber, email },
                    bio: { dob: new Date(dob), gender },
                };

                // If the role is 'Teacher', handle classTeacher and subject
                if (role === 'Teacher') {
                    if (!subject) {
                        console.log('No subject provided for teacher:', firstName);
                        return NextResponse.json({ success: false, msg: 'Subject is required for Teachers' }, { status: 400 });
                    }
                    userData.subject = subject; // Add subject if role is Teacher

                    if (position === 'Staff' && className && section) {
                        userData.classTeacher = { className, section }; // Only add classTeacher for staff members with a class
                    }
                }
                console.log(userData);
                // Insert the user into the database
                await User.create(userData);
            } else {
                console.log(`User with ${mobileNumber} or ${email} already exists.`);
                // Optionally, you can return a message for duplicates or just log them
                // return NextResponse.json({ success: false, msg: 'Users already exist' }, { status: 400 });
            }
        }

        return NextResponse.json({ success: true, msg: 'Users registered successfully' }, { status: 200 });

    } catch (error) {
        console.error('Error processing file:', error);
        return NextResponse.json({ success: false, msg: 'Error processing file' }, { status: 500 });
    }
}

export const config = {
    api: {
        bodyParser: false, // Required to handle file uploads
    },
};
