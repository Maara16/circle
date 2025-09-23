import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Issue from '@/models/Issue';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  await dbConnect();

  try {
    const issue = await Issue.findById(params.id).populate('project').populate('assignee').populate('labels');
    if (!issue) {
      return NextResponse.json({ success: false, error: 'Issue not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: issue });
  } catch (error) {
    const e = error as Error;
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  await dbConnect();

  try {
    const body = await request.json();
    const issue = await Issue.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    });

    if (!issue) {
      return NextResponse.json({ success: false, error: 'Issue not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: issue });
  } catch (error) {
    const e = error as Error;
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  await dbConnect();

  try {
    const deletedIssue = await Issue.findByIdAndDelete(params.id);
    if (!deletedIssue) {
      return NextResponse.json({ success: false, error: 'Issue not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    const e = error as Error;
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
