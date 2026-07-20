import { NextResponse } from 'next/server';

export function GET() {
  return NextResponse.json({ status: 'ok', service: 'visionseek-os', version: '0.1.0' });
}
