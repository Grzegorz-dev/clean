
import { NextResponse } from 'next/server';
import data from '@/data/profiles.json';
export async function GET(){ return NextResponse.json(data); }
