import React, { createContext, useContext, useEffect, useState } from 'react';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import { NetworkState } from '../types/network';
import { Logger } from '../utils/logger';

import { defaultCourseRepository } from '../repositories/courseRepository';

const initialNetworkState: NetworkState = {
  isConnected: true,
  isInternetReachable: true,
  connectionType: 'unknown',
  isSimulatedOffline: false,
  toggleOfflineSimulation: () => {},
};

const NetworkContext = createContext<NetworkState>(initialNetworkState);

export const NetworkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [realState, setRealState] = useState<{
    isConnected: boolean | null;
    isInternetReachable: boolean | null;
    connectionType: string;
  }>({
    isConnected: true,
    isInternetReachable: true,
    connectionType: 'unknown',
  });
  const [isSimulatedOffline, setIsSimulatedOffline] = useState(false);

  const toggleOfflineSimulation = () => {
    setIsSimulatedOffline((prev) => {
      const next = !prev;
      defaultCourseRepository.setSimulatedOffline(next);
      return next;
    });
  };

  useEffect(() => {
    // 1. Fetch initial network state
    NetInfo.fetch()
      .then((state) => {
        setRealState({
          isConnected: state.isConnected,
          isInternetReachable: state.isInternetReachable,
          connectionType: state.type,
        });
        Logger.info('NETINFO', `Initial network state: connected=${state.isConnected}, type=${state.type}`);
      })
      .catch((err) => {
        Logger.warn('NETINFO', 'Failed to fetch initial network state', err);
      });

    // 2. Subscribe to real-time changes
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      setRealState({
        isConnected: state.isConnected,
        isInternetReachable: state.isInternetReachable,
        connectionType: state.type,
      });
      Logger.info('NETINFO', `Network status changed: connected=${state.isConnected}, reachable=${state.isInternetReachable}`);
    });

    return () => unsubscribe();
  }, []);

  const effectiveState: NetworkState = {
    isConnected: isSimulatedOffline ? false : realState.isConnected,
    isInternetReachable: isSimulatedOffline ? false : realState.isInternetReachable,
    connectionType: isSimulatedOffline ? 'none' : realState.connectionType,
    isSimulatedOffline,
    toggleOfflineSimulation,
  };

  return (
    <NetworkContext.Provider value={effectiveState}>
      {children}
    </NetworkContext.Provider>
  );
};

export const useNetwork = (): NetworkState => useContext(NetworkContext);
