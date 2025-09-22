import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IIssue extends Document {
  title: string;
  description?: string;
  project: Types.ObjectId;
  assignee?: Types.ObjectId;
  status: 'Backlog' | 'Todo' | 'In Progress' | 'Done' | 'Canceled';
  priority: 'No priority' | 'Low' | 'Medium' | 'High' | 'Urgent';
}

const IssueSchema = new Schema<IIssue>({
  title: { type: String, required: true },
  description: { type: String },
  project: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  assignee: { type: Schema.Types.ObjectId, ref: 'User' },
  status: {
    type: String,
    enum: ['Backlog', 'Todo', 'In Progress', 'Done', 'Canceled'],
    default: 'Backlog',
  },
  priority: {
    type: String,
    enum: ['No priority', 'Low', 'Medium', 'High', 'Urgent'],
    default: 'No priority',
  },
}, { timestamps: true });

export default mongoose.models.Issue || mongoose.model<IIssue>('Issue', IssueSchema);
