'use client';
import { useEffect, useState } from "react";

type productprops = {
    id: number,
    name: string,
    lat: number,
    lng: number
}

export default function MapPage() {
    const [locations, setLocations] = useState<productprops[]>([]);
    const [name, setName] = useState('');
    const [lat, setLat] = useState('');
    const [lng, setLng] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        async function fetchData() {
            const res = await fetch('/api/test');
            const data = await res.json();
            setLocations(data);
        }
        fetchData();
    }, []);

    const handleDelete = async (id: number) => {
        try {
            const response = await fetch(`/api/test?id=${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete location');
            }
            setLocations(locations.filter(loc => loc.id !== id));
        } catch (err: any) {
            setMessage(err.message);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        try {
            const response = await fetch('/api/test', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ name,
                     lat: parseFloat(lat),
                      lng: parseFloat(lng)
                     }),
            });
        if (!response.ok) {
            throw new Error('Failed to add location');
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

    return (
        <div className = "text-center m-8 flex flex-col items-center text-slate-950 text-lg "> 
            <div className="border bg-gray-500 mx-auto p-8 rounded-lg w-full max-w-xl">
            <h1 className="text-2xl font-bold mb-4">Locations</h1>
            <form onSubmit= {handleSubmit} className ="">
                <label>
                    Name:
                    <input 
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="mt-1 p-2 border rounded" />
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
                    className="mt-1 p-2 border rounded" />
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
                    className="mt-1 p-2 border rounded" />
                </label>
                <br />
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded m-4 border border-green-900 ">
                    Add Location
                </button>
                </form>

                {message && <p>{message}</p>}

                <h2 className="font-bold">Locations List</h2>
                <ul>
                    {locations.map((loc) => (
                        <li key={loc.id} className="m-2 text-left flex items-center">
                          ID: {loc.id}  {loc.name} - Lat: {loc.lat}, Lng: {loc.lng}
                          <button className="ml-auto bg-red-500 text-white px-2 py-1 rounded border border-black"
                            onClick={() => handleDelete(loc.id)}
                            >Delete
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}


