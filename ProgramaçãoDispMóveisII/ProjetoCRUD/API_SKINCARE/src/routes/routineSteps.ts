import { Router, Response } from 'express';
import { RoutineStep } from '../models/RoutineStep';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();

// Criar etapa da rotina
router.post('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { name, timeOfDay, productId } = req.body;

    if (!name || !timeOfDay) {
      return res.status(400).json({ erro: 'Nome e timeOfDay são obrigatórios' });
    }

    if (!['morning', 'night'].includes(timeOfDay)) {
      return res.status(400).json({ erro: 'timeOfDay deve ser morning ou night' });
    }

    const step = new RoutineStep({
      userId: req.userId,
      name,
      timeOfDay,
      productId,
    });

    await step.save();
    await step.populate('productId');

    return res.status(201).json({
      mensagem: 'Etapa da rotina criada com sucesso',
      step,
    });
  } catch (error) {
    console.error('Erro ao criar etapa:', error);
    return res.status(500).json({ erro: 'Erro ao criar etapa da rotina' });
  }
});

// Listar etapas da rotina do usuário
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const steps = await RoutineStep.find({ userId: req.userId })
      .populate('productId')
      .sort({ createdAt: 1 });

    // Separar por time of day
    const morning = steps.filter((s) => s.timeOfDay === 'morning');
    const night = steps.filter((s) => s.timeOfDay === 'night');

    return res.json({
      count: steps.length,
      morning: {
        count: morning.length,
        steps: morning,
      },
      night: {
        count: night.length,
        steps: night,
      },
    });
  } catch (error) {
    console.error('Erro ao listar etapas:', error);
    return res.status(500).json({ erro: 'Erro ao listar etapas da rotina' });
  }
});

// Buscar etapa por ID
router.get('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const step = await RoutineStep.findOne({
      _id: req.params.id,
      userId: req.userId,
    }).populate('productId');

    if (!step) {
      return res.status(404).json({ error: 'Etapa não encontrada' });
    }

    return res.json({ step });
  } catch (error) {
    console.error('Erro ao buscar etapa:', error);
    return res.status(500).json({ erro: 'Erro ao buscar etapa' });
  }
});

// Atualizar etapa
router.put('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { name, timeOfDay, productId } = req.body;

    const step = await RoutineStep.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { name, timeOfDay, productId },
      { new: true, runValidators: true }
    ).populate('productId');

    if (!step) {
      return res.status(404).json({ error: 'Etapa não encontrada' });
    }

    return res.json({
      mensagem: 'Etapa atualizada com sucesso',
      step,
    });
  } catch (error) {
    console.error('Erro ao atualizar etapa:', error);
    return res.status(500).json({ erro: 'Erro ao atualizar etapa' });
  }
});

// Deletar etapa
router.delete('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const step = await RoutineStep.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!step) {
      return res.status(404).json({ error: 'Etapa não encontrada' });
    }

    return res.json({ mensagem: 'Etapa deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar etapa:', error);
    return res.status(500).json({ erro: 'Erro ao deletar etapa' });
  }
});

export default router;
