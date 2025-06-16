import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export async function auth() {
  const token = cookies().get('token')?.value;
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRETE!) as { id: string; email: string; name: string; };
    return {
      user: { id: decoded.id, email: decoded.email, name: decoded.name }
    };
  } catch (error) {
    return null;
  }
}