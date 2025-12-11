let locations = [         
        {"id": 1, "name": "Skolan", "lat": 59.3, "lng": 18.1 },
        { "id": 2, "name": "Biblioteket", "lat": 59.4, "lng": 18.05 } 
];

export async function GET(){

    return Response.json(locations);
}

export async function POST(request: Request){
    try {
    const data = await request.json();
    const newLocation = {
        id: locations.length + 1,
        name: data.name,
        lat: data.lat,
        lng: data.lng
    };
    locations.push(newLocation);
    return Response.json(newLocation, {status: 201});
} catch (err) {
    return Response.json({message: 'Error adding location'}, {status: 400});
}
}

export async function DELETE(request: Request){
const { searchParams } = new URL(request.url);
const id = Number(searchParams.get('id'));

if (!id) {
    return Response.json({message: 'ID is required'}, {status: 400});
}

const index = locations.findIndex(loc => loc.id === id);
if (index === -1) {
    return Response.json({message: 'Location not found'}, {status: 404});
}
locations.splice(index, 1);
return Response.json({message: 'Location deleted'}, {status: 200});
}