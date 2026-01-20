import { NextRequest, NextResponse } from 'next/server';

let locations = [
  { id: 1, name: "Skolan", lat: 59.3, lng: 18.1 },
  { id: 2, name: "Biblioteket", lat: 59.4, lng: 18.05 }
];

function getRole(req: NextRequest): string | undefined {
  return req.cookies.get('role')?.value;
}

// open for all
export async function GET() {
  return NextResponse.json(locations);
}

// user + admin
export async function POST(req: NextRequest) {
  try {
    const role = getRole(req);

    if (!role || (role !== 'user' && role !== 'admin')) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const data = await req.json();

    const newLocation = {
      id: locations.length + 1,
      name: data.name,
      lat: data.lat,
      lng: data.lng,
    };

    locations.push(newLocation);

    return NextResponse.json(newLocation, { status: 201 });
  } catch (err) {
    console.error('POST /locations error:', err);
    return NextResponse.json(
      { message: 'Error adding location' },
      { status: 400 }
    );
  }
}

// admin only
export async function PUT(req: NextRequest) {
  const role = getRole(req);

  if (role !== 'admin') {
    return NextResponse.json({ message: "Admin only" }, { status: 403 });
  }

  const data = await req.json();

  locations = locations.map(loc =>
    loc.id === data.id ? { ...loc, ...data } : loc
  );

  return NextResponse.json({ success: true });
}

// admin only
export async function DELETE(req: NextRequest) {
  const role = getRole(req);

  if (role !== 'admin') {
    return NextResponse.json({ message: "Admin only" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const id = Number(searchParams.get('id'));

  if (!id) {
    return NextResponse.json({ message: 'ID is required' }, { status: 400 });
  }

  const index = locations.findIndex(loc => loc.id === id);

  if (index === -1) {
    return NextResponse.json({ message: 'Location not found' }, { status: 404 });
  }

  locations.splice(index, 1);
  return NextResponse.json({ message: 'Location deleted' }, { status: 200 });
}
