import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const role = req.cookies.get('role')?.value || null;

    return NextResponse.json({ role });
  } catch (err) {
    console.error('Error reading role cookie:', err);
    return NextResponse.json({ role: null });
  }
}
