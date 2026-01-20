'use client';
import { useEffect, useState } from "react";

type Location = {
  id: number;
  name: string;
  lat: number;
  lng: number;
};

export default function MapPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [name, setName] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [message, setMessage] = useState('');
  const [role, setRole] = useState<'user' | 'admin' | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/test');
        const data = await res.json();
        setLocations(data);

        const roleRes = await fetch('/api/auth/check'); 
        if (roleRes.ok) {
          const roleData = await roleRes.json();
          console.log('role:', roleData.role);
          setRole(roleData.role); 
        } else {
          setRole(null);
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    if (!role || (role !== 'user' && role !== 'admin')) {
      setMessage("You are not allowed to add locations");
      return;
    }

    try {
      const response = await fetch('/api/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, lat: parseFloat(lat), lng: parseFloat(lng) }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to add location');
      }

      const newLocation = await response.json();
      setLocations([...locations, newLocation]);
      setName('');
      setLat('');
      setLng('');
      setMessage('Location added successfully!');
    } catch (err: any) {
      setMessage(err.message);
    }
  };

  // (admin only)
  const handleDelete = async (id: number) => {
    if (role !== 'admin') {
      setMessage("Only admin can delete locations");
      return;
    }

    try {
      const response = await fetch(`/api/test?id=${id}`, { method: 'DELETE' });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to delete location');
      }
      setLocations(locations.filter(loc => loc.id !== id));
      setMessage('Location deleted');
    } catch (err: any) {
      setMessage(err.message);
    }
  };

  return (
    <div className="text-center m-8 flex flex-col items-center text-slate-950 text-lg">
      <div className="border bg-gray-500 mx-auto p-8 rounded-lg w-full max-w-xl">
        <h1 className="text-2xl font-bold mb-4">Locations</h1>

        {/* if user or admin */}
        {(role === 'user' || role === 'admin') && (
          <form onSubmit={handleSubmit} className="">
            <label>
              Name:
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-1 p-2 border rounded"
              />
            </label>
            <br />
            <label>
              Latitude:
              <input
                type="number"
                step="0.0001"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                required
                className="mt-1 p-2 border rounded"
              />
            </label>
            <br />
            <label>
              Longitude:
              <input
                type="number"
                step="0.0001"
                value={lng}
                onChange={(e) => setLng(e.target.value)}
                required
                className="mt-1 p-2 border rounded"
              />
            </label>
            <br />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded m-4 border border-green-900"
            >
              Add Location
            </button>
          </form>
        )}

        {message && <p>{message}</p>}

        <h2 className="font-bold">Locations List</h2>
        <ul>
          {locations.map((loc) => (
            <li key={loc.id} className="m-2 text-left flex items-center">
              ID: {loc.id} {loc.name} - Lat: {loc.lat}, Lng: {loc.lng}
              {/* Delete button for admin */}
              {role === 'admin' && (
                <button
                  className="ml-auto bg-red-500 text-white px-2 py-1 rounded border border-black"
                  onClick={() => handleDelete(loc.id)}
                >
                  Delete
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
