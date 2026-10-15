const BASE_URL = 'http://localhost:5000/api';

async function testAuthFlow() {
  console.log('1. Logging in as Admin...');
  const loginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@restaurant.com',
      password: 'adminPassword123!',
    }),
  });

  const loginData = await loginRes.json();
  console.log('Login Response:', loginData);

  const rawCookie = loginRes.headers.get('set-cookie');
  console.log('Set-Cookie received:', rawCookie);

  if (!rawCookie) {
    console.error('No set-cookie header received!');
    return;
  }

  // Extract cookie
  const cookie = rawCookie.split(';')[0];
  console.log('Sending Cookie to /api/auth/me:', cookie);

  const meRes = await fetch(`${BASE_URL}/auth/me`, {
    method: 'GET',
    headers: {
      Cookie: cookie,
    },
  });

  const meData = await meRes.json();
  console.log('Auth Me Response:', meData);

  if (meData.user && meData.user.role === 'admin') {
    console.log('\x1b[32m✔ SUCCESS: Session authentication verified end-to-end!\x1b[0m');
  } else {
    console.error('\x1b[31m✖ Session authentication failed to identify user\x1b[0m');
  }
}

testAuthFlow();
