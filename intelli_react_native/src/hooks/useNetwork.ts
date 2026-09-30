import { useNetwork as useNetworkContext } from '../context/NetworkContext';
import { NetworkState } from '../types/network';

export const useNetwork = (): NetworkState => {
  return useNetworkContext();
};
