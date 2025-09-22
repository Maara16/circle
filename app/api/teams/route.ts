import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Team from '@/models/Team';

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { name, description, members } = await request.json();

    if (!name) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const team = new Team({
      name,
      description,
      members,
    });

    await team.save();

    return NextResponse.json({ success: true, data: team });
  } catch (error) {
    const e = error as Error;
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  await dbConnect();

  try {
    const teams = await Team.find({}).populate('members').populate('projects');
    return NextResponse.json({ success: true, data: teams });
  } catch (error) {
    const e = error as Error;
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
