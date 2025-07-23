'use client';

import { Button } from "@link-sharing-app/ui/button";

export default function DashboardPage() {
  async function refreshTest() {
    const response = await fetch('/api/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      console.error('Refresh failed:', response.statusText);
      throw new Error('Failed to refresh session.');
    }

    const data = await response.json();

    console.log('Session refreshed:', data);
  }

  return (
    <div>
      <h1>Welcome to the Link Sharing App</h1>
      <p>This is a private page accessible only to authenticated users.</p>
      <p>Please sign in to continue.</p>

      <Button type="button" onClick={refreshTest}>
        Refresh Session
      </Button>
    </div>
  );
}
