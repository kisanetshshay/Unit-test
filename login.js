// export async function login(e) {
//     e.preventDefault();
//     const email = document.getElementById('email').value;
//     const password = document.getElementById('password').value;
  
//     const res = await fetch('/api/login', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ email, password }),
//     });
  
//     const data = await res.json();
//     if (res.ok) {
//       localStorage.setItem('token', data.token);
//       window.location.href = 'index.html';
//     } else {
//       alert(data.message);
//     }
//   }

  async function login(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
  
    const res = await fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
  
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('token', data.token);
      window.location.href = 'index.html';
    } else {
      alert(data.message);
    }}
  
  module.exports = { login };