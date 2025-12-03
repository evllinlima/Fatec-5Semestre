import { Router, Response } from 'express';
import { User } from '../models/User';
import { authenticateToken, generateToken, AuthRequest } from '../middleware/auth';

const router = Router();

// Registro
router.post('/register', async (req: AuthRequest, res: Response) => {
  try {
    const { email, password, name } = req.body;

    // Validações
    if (!email || !password || !name) {
      return res.status(400).json({ erro: 'Email, senha e nome são obrigatórios' });
    }

    if (password.length < 6) {
      return res.status(400).json({ erro: 'Senha deve ter no mínimo 6 caracteres' });
    }

    // Verificar se usuário já existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ erro: 'Este email já está cadastrado' });
    }

    // Criar novo usuário
    const user = new User({
      email,
      password,
      name,
    });

    await user.save();

    // Gerar token
    const token = generateToken(user._id.toString());

    return res.status(201).json({
      mensagem: 'Usuário criado com sucesso',
      token,
      usuario: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error('Erro ao registrar:', error);
    return res.status(500).json({ erro: 'Erro ao registrar usuário' });
  }
});

// Login
router.post('/login', async (req: AuthRequest, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validações
    if (!email || !password) {
      return res.status(400).json({ erro: 'Email e senha são obrigatórios' });
    }

    // Buscar usuário (incluindo senha para verificação)
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ erro: 'Email ou senha incorretos' });
    }

    // Comparar senhas
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ erro: 'Email ou senha incorretos' });
    }

    // Gerar token
    const token = generateToken(user._id.toString());

    return res.json({
      mensagem: 'Login realizado com sucesso',
      token,
      usuario: {
        id: user._id,
        email: user.email,
        name: user.name,
        skinType: user.skinType,
      },
    });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    return res.status(500).json({ erro: 'Erro ao fazer login' });
  }
});

// Obter perfil do usuário
router.get('/profile', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ erro: 'Usuário não encontrado' });
    }

    return res.json({
      usuario: {
        id: user._id,
        email: user.email,
        name: user.name,
        skinType: user.skinType,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    return res.status(500).json({ erro: 'Erro ao buscar perfil' });
  }
});

// Atualizar perfil
router.put('/profile', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { name, skinType } = req.body;

    const user = await User.findByIdAndUpdate(
      req.userId,
      { name, skinType },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ erro: 'Usuário não encontrado' });
    }

    return res.json({
      mensagem: 'Perfil atualizado com sucesso',
      usuario: {
        id: user._id,
        email: user.email,
        name: user.name,
        skinType: user.skinType,
      },
    });
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    return res.status(500).json({ erro: 'Erro ao atualizar perfil' });
  }
});

export default router;
