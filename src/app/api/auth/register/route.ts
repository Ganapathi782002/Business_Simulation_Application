import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/get-db';
import * as bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
    try {
        const { name, email, password }: any = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const db = await getDB();

        const existingUser = await db.getUserByEmail(email);
        if (existingUser) {
            return NextResponse.json({ error: 'Email already in use' }, { status: 409 });
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const now = new Date().toISOString();
        const user = {
            id: `user_${Date.now()}`,
            name,
            email,
            passwordHash,
            role: 'user',
            createdAt: now,
            updatedAt: now,
        };

        await db.createUser(user);

        const encrypt = {
            id: user.id,
            email: user.email,
            role: user.role,
        }

        const token = jwt.sign({ ...encrypt }, process.env.JWT_SECRETE!, { expiresIn: '1h' });
        const cookieStore = await cookies()
        cookieStore.set('token', token, {
            httpOnly: true,
            path: '/',
            secure: true,
        })

        return NextResponse.json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        }, { status: 201 });

    } catch (err) {
        return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
    }
}
