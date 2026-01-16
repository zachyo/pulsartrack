'use client';

import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { CONTRACT_IDS, getSorobanRpcUrl, getNetworkPassphrase } from '@/lib/stellar-config';

interface ContractContextValue {
  /** All deployed contract IDs, keyed by contract name */
  contractIds: typeof CONTRACT_IDS;
  /** Current Soroban RPC URL */
  sorobanRpcUrl: string;
  /** Current network passphrase */
  networkPassphrase: string;
}

const ContractContext = createContext<ContractContextValue | null>(null);

export function ContractProvider({ children }: { children: ReactNode }) {
  const value = useMemo<ContractContextValue>(
    () => ({
      contractIds: CONTRACT_IDS,
      sorobanRpcUrl: getSorobanRpcUrl(),
      networkPassphrase: getNetworkPassphrase(),
    }),
    []
  );

  return <ContractContext.Provider value={value}>{children}</ContractContext.Provider>;
}

export function useContractContext(): ContractContextValue {
  const ctx = useContext(ContractContext);
  if (!ctx) {
    throw new Error('useContractContext must be used inside <ContractProvider>');
  }
  return ctx;
}
