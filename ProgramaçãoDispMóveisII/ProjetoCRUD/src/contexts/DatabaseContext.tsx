import React, { createContext, useContext, useState, ReactNode } from 'react';

export type DatabaseType = 'sqlite' | 'mongodb' | null;

interface DatabaseContextData {
  databaseType: DatabaseType;
  setDatabaseType: (type: DatabaseType) => void;
  isDatabaseSelected: boolean;
}

const DatabaseContext = createContext<DatabaseContextData>({} as DatabaseContextData);

interface DatabaseProviderProps {
  children: ReactNode;
}

export function DatabaseProvider({ children }: DatabaseProviderProps) {
  const [databaseType, setDatabaseType] = useState<DatabaseType>(null);

  const isDatabaseSelected = databaseType !== null;

  return (
    <DatabaseContext.Provider value={{ databaseType, setDatabaseType, isDatabaseSelected }}>
      {children}
    </DatabaseContext.Provider>
  );
}

export function useDatabase() {
  const context = useContext(DatabaseContext);

  if (!context) {
    throw new Error('useDatabase deve ser usado dentro de um DatabaseProvider');
  }

  return context;
}
