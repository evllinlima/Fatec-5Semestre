import { Router, Response } from 'express';
import { Product } from '../models/Product';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();

// Criar produto
router.post('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { name, category, observation, photo } = req.body;

    if (!name || !category) {
      return res.status(400).json({ erro: 'Nome e categoria são obrigatórios' });
    }

    const product = new Product({
      userId: req.userId,
      name,
      category,
      observation,
      photo,
    });

    await product.save();

    return res.status(201).json({
      mensagem: 'Produto criado com sucesso',
      product,
    });
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    return res.status(500).json({ erro: 'Erro ao criar produto' });
  }
});

// Listar produtos do usuário
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const products = await Product.find({ userId: req.userId }).sort({ createdAt: -1 });

    return res.json({
      count: products.length,
      products,
    });
  } catch (error) {
    console.error('Erro ao listar produtos:', error);
    return res.status(500).json({ erro: 'Erro ao listar produtos' });
  }
});

// Buscar produto por ID
router.get('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!product) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    return res.json({ product });
  } catch (error) {
    console.error('Erro ao buscar produto:', error);
    return res.status(500).json({ erro: 'Erro ao buscar produto' });
  }
});

// Atualizar produto
router.put('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { name, category, observation, photo } = req.body;

    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { name, category, observation, photo },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    return res.json({
      mensagem: 'Produto atualizado com sucesso',
      product,
    });
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    return res.status(500).json({ erro: 'Erro ao atualizar produto' });
  }
});

// Deletar produto
router.delete('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const product = await Product.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!product) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    return res.json({ mensagem: 'Produto deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar produto:', error);
    return res.status(500).json({ erro: 'Erro ao deletar produto' });
  }
});

export default router;
