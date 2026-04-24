import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { User } from '../models/User.js';
import { formatErrorResponse } from '../utils/error.js';
import { AuthRequest } from '../middleware/auth.middleware.js';

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  department: z.string().min(2),
  role: z.enum(['admin', 'manager', 'researcher']).default('researcher'),
});

export const register = async (req: Request, res: Response) => {
  try {
    const data = registerSchema.parse(req.body);
    const existing = await User.findOne({ email: data.email });
    if (existing) {
      return res.status(400).json(formatErrorResponse('Email already exists'));
    }
    
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = new User({ ...data, password: hashedPassword });
    await user.save();
    
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error: any) {
    console.error('Registration error:', error);
    if (error.name === 'ZodError') {
      return res.status(400).json(formatErrorResponse('Validation error', error.errors));
    }
    res.status(500).json(formatErrorResponse('Internal server error', error.message ? error.message : String(error)));
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json(formatErrorResponse('Invalid credentials'));
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json(formatErrorResponse('Invalid credentials'));
    }
    
    const token = jwt.sign(
      { userId: user._id, role: user.role, department: user.department },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1d' }
    );
    
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, department: user.department } });
  } catch (error) {
    res.status(500).json(formatErrorResponse('Internal server error'));
  }
};

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user?.userId).select('-password');
    if (!user) {
      return res.status(404).json(formatErrorResponse('User not found'));
    }
    res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role, department: user.department } });
  } catch (error) {
    res.status(500).json(formatErrorResponse('Internal server error'));
  }
};
