import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken';
import { cookies } from "next/headers";
import connectDB from './app/lib/mongodb';


export async function middleware(request) {
  const { pathname } = request.nextUrl;
  if (request.nextUrl.pathname.startsWith('/')) {
    const cookiestore = cookies();
    const token = cookiestore.get('jwtoken');
    const role = cookiestore.get('role');
    
    

    if (!token) {
      return NextResponse.next();
    }
    
    try {
      if (token) {
        return NextResponse.next()
      }

    } catch (error) {
      console.log(error);
      return NextResponse.json({ success: false, msg: 'Error' }, { status: 400 });
    }
    return NextResponse.redirect(new URL('/home', request.url))
  }

  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.rewrite(new URL('/dashboard/user', request.url))
  }
}