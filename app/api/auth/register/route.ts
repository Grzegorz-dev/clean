
import { NextResponse } from 'next/server';
export async function POST(req: Request){
  const _ = await req.json();
  // TODO: create account, send code
  return NextResponse.json({ ok: true });
}
