import mongoose, { Schema, Document } from 'mongoose';

export interface IRoutineStep extends Document {
  _id: string;
  userId: string;
  name: string;
  timeOfDay: 'morning' | 'night';
  productId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const routineStepSchema = new Schema<IRoutineStep>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'userId é obrigatório'],
    },
    name: {
      type: String,
      required: [true, 'Nome da etapa é obrigatório'],
      trim: true,
    },
    timeOfDay: {
      type: String,
      enum: {
        values: ['morning', 'night'],
        message: 'timeOfDay deve ser morning ou night',
      },
      required: [true, 'timeOfDay é obrigatório'],
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Índice para buscar etapas por usuário
routineStepSchema.index({ userId: 1, timeOfDay: 1, createdAt: 1 });

export const RoutineStep = mongoose.model<IRoutineStep>('RoutineStep', routineStepSchema);
