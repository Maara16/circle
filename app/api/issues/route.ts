import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Issue from '@/models/Issue';
import { NextURL } from 'next/dist/server/web/next-url';

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { title, description, project, assignee, status, priority } = await request.json();

    if (!title || !project) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const issue = new Issue({
      title,
      description,
      project,
      assignee,
      status,
      priority,
    });

    await issue.save();

    return NextResponse.json({ success: true, data: issue });
  } catch (error) {
    const e = error as Error;
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');

    const filter = projectId ? { project: projectId } : {};

    const issues = await Issue.find(filter).populate('project').populate('assignee');
    return NextResponse.json({ success: true, data: issues });
  } catch (error) {
    const e = error as Error;
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
