import React, { createContext, useContext, useState, ReactNode } from 'react';
import { initDatabase, createUser, getUserByEmail, getUserById, updateUser } from '../services/sqliteService';
import { useDatabase } from './DatabaseContext';
import { skincareAPI } from '../services/apiClient';

export interface User {
  id: number;
  email: string;
  name: string;
  skinType?: string;
}

interface AuthContextData {
  user: User | null;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string, name: string) => Promise<boolean>;
  signOut: () => void;
  updateProfile: (name: string, skinType?: string) => Promise<boolean>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const isAuthenticated = user !== null;
  const dbContext = useDatabase();

  const signIn = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const databaseType = dbContext.databaseType;

      if (databaseType === 'mongodb') {
        // usar API remota
        skincareAPI.setUseLocalDB(false);
        const resp: any = await skincareAPI.login(email, password);
        if (resp && resp.token && resp.usuario) {
          skincareAPI.setToken(resp.token);
          // Acessar usuario em vez de user
          const profile = resp.usuario;
          if (profile && (profile.id || profile._id)) {
            setUser({ id: profile.id || profile._id, email: profile.email, name: profile.name, skinType: profile.skinType });
            return true;
          }
        }
        return false;
      }

      // SQLite local
      await initDatabase();
      const dbUser = await getUserByEmail(email);

      if (dbUser && dbUser.password === password) {
        setUser({
          id: dbUser.id,
          email: dbUser.email,
          name: dbUser.name,
          skinType: dbUser.skinType,
        });
        // configurar token simulado para o skincareAPI
        skincareAPI.setUseLocalDB(true);
        skincareAPI.setToken(`local_token_${dbUser.id}`);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const databaseType = dbContext.databaseType;

      if (databaseType === 'mongodb') {
        skincareAPI.setUseLocalDB(false);
        const resp: any = await skincareAPI.register(email, password, name);
        if (resp && resp.token && resp.usuario) {
          skincareAPI.setToken(resp.token);
          // Acessar usuario em vez de user
          const profile = resp.usuario;
          if (profile && (profile.id || profile._id)) {
            setUser({ id: profile.id || profile._id, email: profile.email, name: profile.name });
            return true;
          }
        }
        return false;
      }

      await initDatabase();

      // Verificar se usuário já existe
      const existingUser = await getUserByEmail(email);
      if (existingUser) {
        console.error('Usuário já existe');
        return false;
      }

      // Criar novo usuário
      const userId = await createUser(email, password, name);

      setUser({
        id: userId,
        email,
        name,
      });
      skincareAPI.setUseLocalDB(true);
      skincareAPI.setToken(`local_token_${userId}`);
      return true;
    } catch (error) {
      console.error('Erro ao registrar:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (name: string, skinType?: string): Promise<boolean> => {
    if (!user) return false;
    
    setIsLoading(true);
    
    try {
      const databaseType = dbContext.databaseType;

      if (databaseType === 'mongodb') {
        skincareAPI.setUseLocalDB(false);
        await skincareAPI.updateProfile(name, skinType);
        setUser({ ...user, name, skinType });
        return true;
      }

      await updateUser(user.id, { name, skinType });
      setUser({ ...user, name, skinType });
      return true;
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, signIn, signUp, signOut, updateProfile, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }

  return context;
}
