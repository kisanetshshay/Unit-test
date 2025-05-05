const { login} = require('./login');


beforeEach(() => {
  
  document.body.innerHTML = `
    <input type="email" id="email" value="test@example.com" />
    <input type="password" id="password" value="password123" />
  `;

  
  global.fetch = jest.fn();

  global.alert = jest.fn();

  const localStorageMock = (() => {
    let store = {};
    return {
      getItem: jest.fn((key) => store[key] || null),
      setItem: jest.fn((key, value) => { store[key] = value.toString(); }),
      clear: jest.fn(() => { store = {}; }),
      removeItem: jest.fn((key) => { delete store[key]; }),
    };
  })();
  Object.defineProperty(window, 'localStorage', { value: localStorageMock });

  
  delete window.location;
  window.location = { href: '' };
});

test('prevents default form submission', () => {
  const event = { preventDefault: jest.fn() };
  login(event);
  expect(event.preventDefault).toHaveBeenCalled();
});

test('calls fetch with correct parameters', async () => {
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({ token: 'abc123' }),
  });

  const event = { preventDefault: jest.fn() };
  await login(event);

  expect(fetch).toHaveBeenCalledWith('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'test@example.com', password: 'password123' }),
  });
});

test('stores token and redirects on successful login', async () => {
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({ token: 'abc123' }),
  });

  const event = { preventDefault: jest.fn() };
  await login(event);

  expect(localStorage.setItem).toHaveBeenCalledWith('token', 'abc123');
  expect(window.location.href).toBe('index.html');
  expect(alert).not.toHaveBeenCalled();
});

test('alerts error message and does not redirect on failed login', async () => {
  fetch.mockResolvedValueOnce({
    ok: false,
    json: async () => ({ message: 'Invalid credentials' }),
  });

  const event = { preventDefault: jest.fn() };
  await login(event);

  expect(alert).toHaveBeenCalledWith('Invalid credentials');
  expect(window.location.href).toBe('');
  expect(localStorage.setItem).not.toHaveBeenCalled();
});