import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/get-db';
import * as bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers'
export async function POST(req: NextRequest) {
    try {
        const { email, password }: any = await req.json();

        if (!email || !password) {
            return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
        }
        
        const db = await getDB();
        const user = await db.getUserByEmail(email);
        console.log("user", user)
        console.log(bcrypt.compare(password, user.password_hash))
        if (!user || !(await bcrypt.compare(password, user.password_hash))) {
            return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
        }

        const encrypt = {
            role: user.role,
            email: user.email,
            id:user.id
        }
        const token = jwt.sign({ ...encrypt }, process.env.JWT_SECRETE!, { expiresIn: "1h" });

        const cookieStore = await cookies()

        cookieStore.set('token',token,{
            httpOnly: true,
            path: '/',
            secure:true
        })

        return NextResponse.json({
            user
        });

    } catch (err) {
        return NextResponse.json({ error: 'Login failed' }, { status: 500 });
    }
}
