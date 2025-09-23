import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Team from '@/models/Team';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  await dbConnect();

  try {
    const team = await Team.findById(params.id).populate('members').populate('projects');
    if (!team) {
      return NextResponse.json({ success: false, error: 'Team not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: team });
  } catch (error) {
    const e = error as Error;
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  await dbConnect();

  try {
    const body = await request.json();
    const team = await Team.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    });

    if (!team) {
      return NextResponse.json({ success: false, error: 'Team not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: team });
  } catch (error) {
    const e = error as Error;
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  await dbConnect();

  try {
    const deletedTeam = await Team.findByIdAndDelete(params.id);
    if (!deletedTeam) {
      return NextResponse.json({ success: false, error: 'Team not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: {} });
  } catch (error)
    {
    const e = error as Error;
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
