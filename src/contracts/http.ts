import { NextResponse } from 'next/server';

export function badRequest(message: string, details?: unknown) {
  return NextResponse.json({ error: { code: 'VALIDATION_ERROR', message, details } }, { status: 400 });
}

export function notFoundResponse(message: string) {
  return NextResponse.json({ error: { code: 'NOT_FOUND', message } }, { status: 404 });
}

export function internalError(message = 'Unexpected server error') {
  return NextResponse.json({ error: { code: 'INTERNAL_ERROR', message } }, { status: 500 });
}
