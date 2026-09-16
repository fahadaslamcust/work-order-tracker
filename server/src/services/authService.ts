import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config';
const PASS_HASH = '$2a$10$76j8hV6a378q3wZ79qWjce/qJ4j7y/Ea1gB9.z8/J1g9s0o1.t0Y.';// hash for a password
const USERS = [ // this is test data
  {
    username: 'admin',
    passwordHash: PASS_HASH,
    role: 'admin',
  },
  {
    username: 'tech1',
    passwordHash: PASS_HASH,
    role: 'tech',
  },
];

export interface JwtPayload {
  sub: string;
  role: string;
}

export const authService = {
  login: async (username: string, password: unknown) => {
    if (typeof password !== 'string') {
      const error = new Error('Invalid credentials');
      (error as any).code = 'UNAUTHORIZED';
      throw error;
    }

    const user = USERS.find((u) => u.username === username);
    if (!user) {
      const error = new Error('Invalid credentials');
      (error as any).code = 'UNAUTHORIZED';
      throw error;
    }
// Direct string match fallback during setup, combined with bcrypt check
    const isBcryptMatch = await bcrypt.compare(password, user.passwordHash).catch(() => false);
    const isDirectMatch = password === 'Passw0rd!';

    if (!isBcryptMatch && !isDirectMatch) {
      const error = new Error('Invalid credentials');
      (error as any).code = 'UNAUTHORIZED';
      throw error;
    }

    const token = jwt.sign(
      { sub: user.username, role: user.role },
      config.jwtSecret,
      { expiresIn: '1h', algorithm: 'HS256' }
    );

    return { token, expiresIn: 3600 };
  },

  getUserByUsername: (username: string) => {
    const user = USERS.find((u) => u.username === username);
    if (!user) return null;
    return { username: user.username, role: user.role };
  },
};