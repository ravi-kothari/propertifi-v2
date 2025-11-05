async function getStates() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/states`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch states');
  }
  return res.json();
}

export default async function TestPage() {
  try {
    const states = await getStates();
    return (
      <div style={{ padding: '20px' }}>
        <h1>Backend API Test</h1>
        <h2>States</h2>
        {states && states.length > 0 ? (
          <ul>
            {states.map((state: any) => (
              <li key={state.id}>{state.name}</li>
            ))}
          </ul>
        ) : (
          <p>No states found. Make sure you have seeded the database.</p>
        )}
      </div>
    );
  } catch (error) {
    return (
      <div style={{ padding: '20px', color: 'red' }}>
        <h1>Backend API Test</h1>
        <p>Error fetching data from the backend:</p>
        <pre>{(error as Error).message}</pre>
        <p>Ensure the backend is running and the `NEXT_PUBLIC_API_URL` in `.env.local` is correct.</p>
      </div>
    );
  }
}
