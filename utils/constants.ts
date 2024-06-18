import { PublicKey } from "@solana/web3.js";
export const ENDPOINT = "https://lqinv-backend.onrender.com"
export const PROGRAM_ID = new PublicKey("53Es3cKQ3bDzokkCNjYmJs1a4fL23BWW3GfqaduPhWXm")


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