import mongoose, { Document, Schema } from 'mongoose';

export interface ILabel extends Document {
  name: string;
  color: string;
  description?: string;
}

const LabelSchema = new Schema<ILabel>({
  name: { type: String, required: true },
  color: { type: String, required: true },
  description: { type: String },
});

export default mongoose.models.Label || mongoose.model<ILabel>('Label', LabelSchema);
