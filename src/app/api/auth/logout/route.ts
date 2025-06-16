import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers'
import { error } from 'console';
export async function POST(req: NextRequest) {
    try{
        const cookieStore = cookies();
        cookieStore.delete('token')
        return NextResponse.json({message:"Logout successfully"})
    }
    catch(error){
        return NextResponse.json({error})
    }
}