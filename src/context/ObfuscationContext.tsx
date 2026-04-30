import React, { createContext, useContext, useState, useEffect } from 'react';

interface ObfuscationContextType {
  level: number;
  setLevel: (level: number) => void;
}

const ObfuscationContext = createContext<ObfuscationContextType | undefined>(undefined);

export const ObfuscationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [level, setLevel] = useState<number>(() => {
    const saved = localStorage.getItem('textObfuscationLevel');
    return saved ? parseInt(saved) : 2;
  });

  useEffect(() => {
    localStorage.setItem('textObfuscationLevel', String(level));
  }, [level]);

  return (
    <ObfuscationContext.Provider value={{ level, setLevel }}>
      {children}
    </ObfuscationContext.Provider>
  );
};

export const useObfuscation = () => {
  const context = useContext(ObfuscationContext);
  if (!context) {
    throw new Error('useObfuscation must be used within an ObfuscationProvider');
  }
  return context;
};
