import { NextResponse } from "next/server";
import connectDB from "@/app/lib/mongodb";
import User from "@/app/models/User_model";
import jwt from 'jsonwebtoken';
import { cookies } from "next/headers";

export async function GET(request){
    const cookiestore = cookies();
    const token = cookiestore.get('jwtoken');
    
    try {
        await connectDB();
        if (!token) {
            return NextResponse.json({
                success: false,
                msg: 'No token provided',
            }, { status: 401 });
        }
        const value = token.value
        const decoded = jwt.verify(value, process.env.ACCESS_TOKEN_SECRET);
        console.log(decoded); 
         // Extract class information from the decoded token
         const { user } = decoded;
         console.log(user);
         
        
         // Fetch student data from the database
        
        return NextResponse.json({
            success: true,
            data: user,
        }, { status: 200 });
 
    } catch (error) {
        console.log(error)
        return NextResponse.json({
            success: false,
               msg: 'Error'
           },{ status : 400});
    }


}