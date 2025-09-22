import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ITeam extends Document {
  name: string;
  description?: string;
  members: Types.ObjectId[];
  projects: Types.ObjectId[];
}

const TeamSchema = new Schema<ITeam>({
  name: { type: String, required: true },
  description: { type: String },
  members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  projects: [{ type: Schema.Types.ObjectId, ref: 'Project' }],
});

export default mongoose.models.Team || mongoose.model<ITeam>('Team', TeamSchema);
