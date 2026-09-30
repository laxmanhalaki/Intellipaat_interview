export interface NetworkState {
  isConnected: boolean | null;
  isInternetReachable: boolean | null;
  connectionType: string;
  isSimulatedOffline: boolean;
  toggleOfflineSimulation: () => void;
}
