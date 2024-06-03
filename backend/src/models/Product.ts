import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  quantity: number;
  rate: number;
  userId: mongoose.Schema.Types.ObjectId;
}

const productSchema: Schema = new Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  rate: { type: Number, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

export default mongoose.model<IProduct>('Product', productSchema);
