import { PublicKey, Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";
import {
  WalletMultiButton,
  WalletDisconnectButton,
} from "@solana/wallet-adapter-react-ui";
import { useState, useEffect } from "react";
import { useConnection } from "@solana/wallet-adapter-react";
import toast from "react-hot-toast";

export function ConnectWalletCard() {
  return (
    <div className="w-full max-w-2xl mx-auto px-4 md:px-6 transition-all duration-300 ease-in-out">
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl p-8 md:p-10 rounded-2xl shadow-2xl border border-slate-700/50 hover:border-slate-500/50 hover:shadow-blue-500/10 transition-all duration-300">
        <div className="max-w-3xl mx-auto space-y-6">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200">
            Welcome to SolDrop
          </h1>
          <p className="text-slate-300 mb-10 text-lg md:text-xl leading-relaxed font-medium">
            Connect your wallet to receive SOL directly to your account.
          </p>
          <div className="inline-block">
            <WalletMultiButton className="!bg-gradient-to-r !from-slate-700 !to-slate-800 hover:!from-slate-600 hover:!to-slate-700 !rounded-xl !text-base font-semibold !shadow-xl hover:!shadow-blue-500/10 !transition-all !duration-300" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ConnectedWalletCard({ publicKey }: { publicKey: PublicKey }) {
  const [amount, setAmount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const solOptions = [1, 2, 3, 4, 5];
  const { connection } = useConnection();

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(null);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleError = (error: any) => {
    const errorMessage = error?.message || "An unknown error occurred";
    toast.error(`Error: ${errorMessage}`);
    setError(errorMessage);
  };

  const requestAirdrop = async (
    connection: Connection,
    publicKey: PublicKey
  ) => {
    if (loading) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const airdropSignature = await connection.requestAirdrop(
        publicKey,
        amount * LAMPORTS_PER_SOL
      );

      const latestBlockHash = await connection.getLatestBlockhash();

      await connection.confirmTransaction({
        blockhash: latestBlockHash.blockhash,
        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
        signature: airdropSignature,
      });

      const successMessage = `Successfully airdropped ${amount} SOL`;
      setSuccess(successMessage);
      toast.success(successMessage);

      // Optional: Reset amount after successful airdrop
      setAmount(1);
    } catch (error) {
      console.error("Airdrop failed:", error);
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 md:px-6 transition-all duration-300 ease-in-out">
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl p-8 md:p-10 rounded-2xl shadow-2xl border border-slate-700/50 hover:border-slate-500/50 hover:shadow-blue-500/10 transition-all duration-300">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200">
              Wallet Connected
            </h1>
            <div className="h-0.5 w-20 mx-auto bg-gradient-to-r from-slate-700 via-slate-500 to-slate-700 rounded-full"></div>
          </div>

          <div className="bg-gradient-to-br from-slate-900/70 to-slate-800/50 p-6 rounded-xl border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300">
            <div className="flex flex-col items-center space-y-3">
              <div className="w-16 h-16 bg-gradient-to-br from-slate-700 to-slate-800 rounded-full flex items-center justify-center mb-2 shadow-lg">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
              </div>
              <p className="text-sm font-medium text-slate-400">
                Your wallet address
              </p>
              <p className="text-sm font-mono text-slate-200 bg-slate-800/50 px-4 py-2 rounded-lg border border-slate-700/50">
                {publicKey.toString()}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {error && (
              <div className="bg-red-900/20 border border-red-900/50 rounded-lg p-4 text-red-400 text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-900/20 border border-green-900/50 rounded-lg p-4 text-green-400 text-sm">
                {success}
              </div>
            )}
            <div className="text-center">
              <p className="text-slate-300 text-lg font-medium mb-4">
                Select amount to airdrop
              </p>
              <div className="inline-flex gap-3 flex-wrap justify-center">
                {solOptions.map((sol) => (
                  <button
                    key={sol}
                    onClick={() => setAmount(sol)}
                    className={`w-20 py-3 rounded-xl font-medium transition-all duration-300 ${
                      amount === sol
                        ? "bg-gradient-to-br from-slate-600 to-slate-700 text-white shadow-lg shadow-slate-900/50"
                        : "bg-gradient-to-br from-slate-800/50 to-slate-900/50 text-slate-300 hover:from-slate-700/50 hover:to-slate-800/50"
                    }`}
                  >
                    {sol} SOL
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => requestAirdrop(connection, publicKey)}
              disabled={loading}
              className={`w-full bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 py-4 rounded-xl font-semibold text-white shadow-lg hover:shadow-blue-500/10 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                `Request ${amount} SOL Airdrop`
              )}
            </button>

            <div className="flex justify-center border-t border-slate-700/50 pt-6">
              <WalletDisconnectButton className="!bg-gradient-to-br !from-slate-800/50 !to-slate-900/50 hover:!from-slate-700/50 hover:!to-slate-800/50 !border !border-slate-700/50 hover:!border-red-900/50 !rounded-xl !py-2.5 !px-5 !text-slate-400 hover:!text-slate-300 !font-medium !transition-all !duration-300" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
