import { getDB } from "@/lib/get-db";
import jwt  from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const tokenCookie = cookies().get('token');
    
    if (!tokenCookie) {
      return NextResponse.json({ user: null, error: 'No token provided' }, { status: 200 });
    }

    const decoded = jwt.verify(tokenCookie.value, process.env.JWT_SECRETE!) as { id: string; email: string };
    
    const db = await getDB();
    const user = await db.getUserByEmail(decoded.email);

    if (!user) {
        return NextResponse.json({ user: null, error: 'User not found' }, { status: 200 });
    }
    
    const safeUserData = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
    };

    return NextResponse.json({ user: safeUserData });

  } catch (error) {
    return NextResponse.json({ user: null, error: 'Invalid or expired session' }, { status: 200 });
  }
}