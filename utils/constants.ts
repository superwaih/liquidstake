import { PublicKey } from "@solana/web3.js";
export const ENDPOINT = "https://lqinv-backend.onrender.com"
// export const ENDPOINT = "http://localhost:5000"

export const PROGRAM_ID = new PublicKey("53Es3cKQ3bDzokkCNjYmJs1a4fL23BWW3GfqaduPhWXm")
export function isValidNumber(value : any) {
  return typeof value === 'number' && !isNaN(value) ||
         (typeof value === 'string' && value.trim() !== '' && !isNaN(Number(value)));
}
export function formatBalance(balance: string | number) {
  if(balance === null) return 0
  if (Number(balance) >= 1000000) {
      return (Number(balance) / 1000000).toFixed(1) + 'M';
  } else {
      return balance
  }
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