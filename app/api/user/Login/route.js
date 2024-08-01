import { NextResponse } from "next/server";
import connectDB from "@/app/lib/mongodb";
import User from "@/app/models/User_model";
import jwt from 'jsonwebtoken';

const generateAccessToken = async (user) => {
    console.log('ACCESS_TOKEN_SECRET:', process.env.ACCESS_TOKEN_SECRET);  // Log the secret key
    if (!process.env.ACCESS_TOKEN_SECRET) {
        throw new Error('ACCESS_TOKEN_SECRET is not defined');
    }
    // const myuser = user.toString()
    // console.log(myuser);
    const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1y" });
    return token;
};
export async function POST(request) {
    try {
        await connectDB(); //Ensure Database connection
        const {firstName, mobileNumber,dob} = await request.json();
        const data = {firstName:firstName, mobileNumber:mobileNumber, dob:dob};
        const record = await User.findOne({
            $or: [
              { firstName },
              { "contact.mobileNumber": mobileNumber },
              { "contact.email": data.email },
            ],
          })
        console.log(record);
        if (!record){
            return NextResponse.json({
                success: false,
                msg: 'User with this email Not Exists!'
              }, { status: 400 });  
        }
        const accessToken = await generateAccessToken({ user:record });
        const response = NextResponse.json({ msg: 'User has been logged in', accessToken });
        response.headers.set('Set-Cookie', `jwtoken=${accessToken}; Path=/; HttpOnly; Max-Age=31536000`);
        return response;
    } catch (error) {
        console.log(error);
        return NextResponse.json({
            success: false,
            msg:'Error occured',
            error
        },{status:500})
    }
}