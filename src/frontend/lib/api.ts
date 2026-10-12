import type { BookingRequest } from './types';
export async function requestBooking(booking: BookingRequest): Promise<string> {
  const session = await fetch('/api/session', {
    credentials: 'same-origin',
    signal: AbortSignal.timeout(10000),
  });
  if (!session.ok) {
    const failure = await session.json().catch(() => ({}));
    throw new Error(failure.error || 'Booking service unavailable. Call 0917 555 7768.');
  }
  const { token } = await session.json();
  const response = await fetch('/api/bookings', {
    method: 'POST',
    credentials: 'same-origin',
    signal: AbortSignal.timeout(10000),
    headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': token },
    body: JSON.stringify(booking),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || 'Request not saved. Please try again.');
  return result.reference;
}
