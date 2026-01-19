'use client';
import { useEffect, useState } from "react";



export default function MapPage() {
    const [username, setU] = useState('');
    const [password, setP] = useState('');
    const [error, setErr] = useState('');


async function onSubmit(e: React.FormEvent) {
  e.preventDefault();
  setErr('');

  try {
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      setErr('Fel användarnamn eller lösenord');
      return;
    }

    if (data.role === 'admin') {
        window.location.href = '/mapp'
        alert('Välkommen admin!');
    } else {
        window.location.href = '/mapp'
        alert('Välkommen användare!');
    }

  } catch (err) {
    setErr('Något gick fel. Försök igen.');
  }
}
async function logout() {
  await fetch('/api/auth', { method: 'DELETE' });
  window.location.href = '/';
}



    return (
        <div className = "text-center m-8 flex flex-col items-center text-slate-950 text-lg "> 
            <div className="border bg-gray-500 mx-auto p-8 rounded-lg w-full max-w-xl">
            <h1 className="text-2xl font-bold mb-4">Log in</h1>
            <form onSubmit = {onSubmit} className ="">
                <label>
                    Username:
                    <input 
                    type="text"
                    value={username}
                    onChange={(e) => setU(e.target.value)}
                    required
                    className="mt-1 p-2 border rounded" />
                </label>
                <br />
                <label>
                    Password:
                    <input 
                    type="password"
                    value={password}
                    onChange={(e) => setP(e.target.value)}
                    required
                    className="mt-1 p-2 border rounded" />
                </label>
                <br />
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded m-4 border border-green-900 ">
                    Log In
                </button>
                <button onClick={logout} className="bg-red-500 border border-red-900 text-white px-4 py-2 rounded m-4">
                Log Out
                </button>
                </form>

                {error && <p className="text-red-500">{error}</p>}

                

            </div>
        </div>
    )
}


