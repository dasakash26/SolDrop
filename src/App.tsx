import {
  useWallet,
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  ConnectWalletCard,
  ConnectedWalletCard,
} from "./components/WalletCard";

import "./App.css";
import "@solana/wallet-adapter-react-ui/styles.css";
import { Toaster } from "react-hot-toast";

function MainContent() {
  const { publicKey } = useWallet();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-slate-800 to-slate-900">
      {publicKey ? (
        <ConnectedWalletCard publicKey={publicKey} />
      ) : (
        <ConnectWalletCard />
      )}
    </div>
  );
}

function App() {
  return (
    <ConnectionProvider endpoint={"https://api.devnet.solana.com"}>
      <WalletProvider wallets={[]} autoConnect>
        <WalletModalProvider>
          <MainContent />
          <Toaster />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;
