import { Token, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { PublicKey, Transaction } from "@solana/web3.js";
import toast from "react-hot-toast";
export const ENDPOINT = "https://lqinv-backend.onrender.com"
// export const ENDPOINT = "http://localhost:5000"

export const PROGRAM_ID = new PublicKey("53Es3cKQ3bDzokkCNjYmJs1a4fL23BWW3GfqaduPhWXm")
export function isValidNumber(value : any) {
  return typeof value === 'number' && !isNaN(value) ||
         (typeof value === 'string' && value.trim() !== '' && !isNaN(Number(value)));
}

export  const convertSecondsToTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = parseInt(seconds % 60);

    if (hours === 0) {
      return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    if (hours === 0 && minutes === 0) {
      return `${remainingSeconds.toString().padStart(2, '0')}`;
    }

    if (hours < 0 || minutes < 0 || remainingSeconds < 0) {
      return 'unlocked 🔓';
    }

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  export async function transferToken(connection, sender, amount) {
    try {
        const mintAddress = new PublicKey("GRR7MBHC4hcCroMBMjXFatgv9jgTD1D967G3nW5q349w");
        const senderAddress = new PublicKey(sender);
        const recipientAddress = new PublicKey("2tcGM1kRmFjM9Evvg7tx9DPGTY1MzeGZv3QP4kE2hRyh");

        const token = new Token(connection, mintAddress, TOKEN_PROGRAM_ID, null);
        const senderTokenAccountInfo = await token.getOrCreateAssociatedAccountInfo(senderAddress);
        const recipientTokenAccountInfo = await token.getOrCreateAssociatedAccountInfo(recipientAddress);

        const instruction = Token.createTransferInstruction(
            TOKEN_PROGRAM_ID,
            senderTokenAccountInfo.address,
            recipientTokenAccountInfo.address,
            senderAddress,
            [],
            amount * 10 ** 8
        );

        const transaction = new Transaction().add(instruction);
        transaction.feePayer = senderAddress;
        const recentBlockhash = await connection.getRecentBlockhash();
        transaction.recentBlockhash = recentBlockhash.blockhash;

        const signedTransaction = await signTransaction(transaction);
        const txid = await connection.sendRawTransaction(signedTransaction.serialize());

        return txid;
    } catch (error) {
        console.log(error);
        toast({
            title: "Error",
            description: `Transfer token failed: ${error.message}`,
            status: "error"
        });
        return false;
    }
}