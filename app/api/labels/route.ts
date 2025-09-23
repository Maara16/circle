import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Label from '@/models/Label';

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { name, color, description } = await request.json();

    if (!name || !color) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const label = new Label({
      name,
      color,
      description,
    });

    await label.save();

    return NextResponse.json({ success: true, data: label });
  } catch (error) {
    const e = error as Error;
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  await dbConnect();

  try {
    const labels = await Label.find({});
    return NextResponse.json({ success: true, data: labels });
  } catch (error) {
    const e = error as Error;
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
