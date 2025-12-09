'use client';
import { useEffect, useState } from "react";
type productprops = {
    id: number,
    name: string,
    lat: number,
    lng: number
}

export default function level1() {
    const [products, setProducts] = useState<productprops[]>([]);
    
    useEffect(() => {

        async function getData(){

            const res = await fetch('/api/test');
            const data = await res.json();
            setProducts(data);
        }

        getData();

    }, []);


return (
  <div>
    <h1 className="font-bold">Level 1 Page</h1>

    <div>
      {products.length === 0 ? (
        <p>loading!!!!</p>
      ) : (
        products.map(product => (
          <div key={product.id} className="border p-4 m-4 bg-gray-600">
            <h2>{product.name}</h2>
            <p>Latitude: {product.lat}, Longitude: {product.lng}</p>
          </div>
        ))
      )}
    </div>
  </div>
);
}


