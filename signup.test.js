const { signup } = require('./signup');

beforeEach(() => {
  
  document.body.innerHTML = `
    <input type="email" id="email" value="test@example.com" />
    <input type="password" id="password" value="password123" />
  `;

  
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ message: 'Signup successful' }),
    })
  );

  
  global.alert = jest.fn();

  
  delete window.location;
  window.location = { href: '' };
});

test('prevents default form submission', () => {
  const event = { preventDefault: jest.fn() };
  signup(event);
  expect(event.preventDefault).toHaveBeenCalled();
});

test('calls fetch with correct parameters', async () => {
  const event = { preventDefault: jest.fn() };
  await signup(event);

  expect(fetch).toHaveBeenCalledWith('/api/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'test@example.com', password: 'password123' }),
  });
});

test('alerts the response message', async () => {
  const event = { preventDefault: jest.fn() };
  await signup(event);

  expect(alert).toHaveBeenCalledWith('Signup successful');
});

test('redirects to login.html on successful signup', async () => {
  const event = { preventDefault: jest.fn() };
  await signup(event);

  expect(window.location.href).toBe('login.html');
});

test('does not redirect on failed signup', async () => {

  fetch.mockImplementationOnce(() =>
    Promise.resolve({
      ok: false,
      json: () => Promise.resolve({ message: 'Signup failed' }),
    })
  );

  const event = { preventDefault: jest.fn() };
  await signup(event);

  expect(window.location.href).toBe('');
  expect(alert).toHaveBeenCalledWith('Signup failed');
});
