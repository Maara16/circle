import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import TeamModel from '@/models/Team';
import '@/models/Project'; // Import to register the model
import '@/models/User'; // Also import User model if 'members' references it

export async function GET() {
   try {
      await connectToDatabase();
      const teams = await TeamModel.find({}).populate('members').populate('projects');
      return NextResponse.json({ success: true, data: teams });
   } catch (error) {
      console.error(error);
      return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
   }
}

export async function POST(request: NextRequest) {
   try {
      await connectToDatabase();
      const body = await request.json();
      const newTeam = new TeamModel(body);
      await newTeam.save();
      const populatedTeam = await TeamModel.findById(newTeam._id)
         .populate('members')
         .populate('projects');
      return NextResponse.json({ success: true, data: populatedTeam }, { status: 201 });
   } catch (error) {
      console.error(error);
      return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
   }
}
