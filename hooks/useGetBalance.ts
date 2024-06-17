import { Connection, PublicKey } from "@solana/web3.js";
import { useEffect, useMemo, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

export const useGetAccountBalance = () => {
  const { connection } = useConnection();
  const [balance, setBalance] = useState("0");


  const { publicKey } = useWallet();
  useEffect(() => {
    const getTokenBalance = async () => {
      if (!connection || !publicKey) return;
      try {
        const walletPublicKey = new PublicKey(publicKey.toBase58());
        const tokenMintPublicKey = new PublicKey(
          "GRR7MBHC4hcCroMBMjXFatgv9jgTD1D967G3nW5q349w"
        );

        // Find the associated token account address for the wallet
        const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
          walletPublicKey,
          { mint: tokenMintPublicKey }
        );
  
        // If no token accounts found, return 0
        if (tokenAccounts.value.length === 0 ||  !tokenAccounts.value[0].account.data.parsed.info) {
          return setBalance('0');
        }
        const tokenAccount = tokenAccounts.value[0].account.data.parsed.info;
        const tokenBalance = tokenAccount.tokenAmount.uiAmount;
        setBalance(tokenBalance);

        return tokenBalance;
      } catch (error) {
        console.error("Error fetching token balance:", error);
        throw error;
      }
    };
    getTokenBalance();
  }, [connection, publicKey]);

  return {
    balance,
   
  };
};
