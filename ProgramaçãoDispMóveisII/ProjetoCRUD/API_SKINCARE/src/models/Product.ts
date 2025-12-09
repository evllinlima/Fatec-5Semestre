import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  _id: string;
  userId: string;
  name: string;
  category: 'cleanser' | 'toner' | 'serum' | 'moisturizer' | 'sunscreen' | 'mask' | 'other';
  photo?: string;
  observation?: string;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'userId é obrigatório'],
    },
    name: {
      type: String,
      required: [true, 'Nome do produto é obrigatório'],
      trim: true,
    },
    category: {
      type: String,
      enum: {
        values: ['cleanser', 'toner', 'serum', 'moisturizer', 'sunscreen', 'mask', 'other'],
        message: 'Categoria inválida',
      },
      required: [true, 'Categoria é obrigatória'],
    },
    photo: {
      type: String,
      default: null,
    },
    observation: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Índice para buscar produtos por usuário
productSchema.index({ userId: 1, createdAt: -1 });

export const Product = mongoose.model<IProduct>('Product', productSchema);
