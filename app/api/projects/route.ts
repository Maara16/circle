import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Project from '@/models/Project';
import { NextApiRequest } from 'next';

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { name, description, team, lead } = await request.json();

    if (!name || !team) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const project = new Project({
      name,
      description,
      team,
      lead,
    });

    await project.save();

    return NextResponse.json({ success: true, data: project });
  } catch (error) {
    const e = error as Error;
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  await dbConnect();

  try {
    const projects = await Project.find({}).populate('team').populate('lead');
    return NextResponse.json({ success: true, data: projects });
  } catch (error) {
    const e = error as Error;
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
