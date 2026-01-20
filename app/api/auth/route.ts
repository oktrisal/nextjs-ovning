import { NextRequest, NextResponse } from 'next/server';

const USERS = [
  { username: 'user', password: 'user123', role: 'user' },
  { username: 'admin', password: 'admin123', role: 'admin' },
];

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  const match = USERS.find(
    u => u.username === username && u.password === password
  );

  if (!match) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized' },
      { status: 401 }
    );
  }

  const res = NextResponse.json({
    success: true,
    role: match.role,
  });

  res.cookies.set({
    name: 'role',
    value: match.role,
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24,
  });

  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ success: true });

  res.cookies.set({
    name: 'role',
    value: '',
    path: '/',
    maxAge: 0,
  });

  return res;
}
