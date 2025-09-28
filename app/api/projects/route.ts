import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import ProjectModel from '@/models/Project';

export async function GET() {
  try {
    await connectToDatabase();
    const projects = await ProjectModel.find({}).populate('team').populate('lead');
    return NextResponse.json({ success: true, data: projects });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const newProject = new ProjectModel(body);
    await newProject.save();
    const populatedProject = await ProjectModel.findById(newProject._id).populate('team').populate('lead');
    return NextResponse.json({ success: true, data: populatedProject }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}