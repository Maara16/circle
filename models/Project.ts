import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IProject extends Document {
  name: string;
  description?: string;
  team: Types.ObjectId;
  lead?: Types.ObjectId;
  status: 'Not Started' | 'In Progress' | 'Completed';
  health: 'On Track' | 'At Risk' | 'Off Track';
  issues: Types.ObjectId[];
}

const ProjectSchema = new Schema<IProject>({
  name: { type: String, required: true },
  description: { type: String },
  team: { type: Schema.Types.ObjectId, ref: 'Team', required: true },
  lead: { type: Schema.Types.ObjectId, ref: 'User' },
  status: {
    type: String,
    enum: ['Not Started', 'In Progress', 'Completed'],
    default: 'Not Started',
  },
  health: {
    type: String,
    enum: ['On Track', 'At Risk', 'Off Track'],
    default: 'On Track',
  },
  issues: [{ type: Schema.Types.ObjectId, ref: 'Issue' }],
});

export default mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);
