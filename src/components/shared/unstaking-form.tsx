"use client"
import { useState, useEffect } from 'react';
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, Transaction, SystemProgram } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

const UnstakingForm = () => {
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();
    const [amount, setAmount] = useState('');
    const [stakedBalance, setStakedBalance] = useState(0);
    const [unstakedBalance, setUnstakedBalance] = useState(2000); // Example balance, replace with actual logic

    useEffect(() => {
        if (publicKey) {
            // Fetch the staked balance for the user from your staking program
            // This is a placeholder logic; replace it with actual fetch logic
            const fetchStakedBalance = async () => {
                const balance = 10000; // Replace with actual logic
                setStakedBalance(balance);
            };
            fetchStakedBalance();
        }
    }, [publicKey]);

    const handleUnstake = async () => {
        if (!publicKey || !amount) return;

        const amountToUnstake = parseInt(amount, 10);

        // Implement the actual unstaking logic here
        console.log(`Unstaking ${amountToUnstake}`);

        try {
            // Replace the following with actual transaction creation and sending logic
            const transaction = new Transaction().add(
                // Add instructions to unstake tokens
                // This is a placeholder instruction; replace it with actual logic
                SystemProgram.transfer({
                    fromPubkey: publicKey,
                    toPubkey: new PublicKey("AdminPublicKeyHere"), // Replace with actual admin public key
                    lamports: amountToUnstake,
                })
            );

            const signature = await sendTransaction(transaction, connection);
            await connection.confirmTransaction(signature, "processed");

            console.log("Unstaking successful");
            // Update the UI with the new balances
            setStakedBalance(stakedBalance - amountToUnstake);
        } catch (error) {
            console.error("Unstaking failed", error);
        }
    };

    const setMaxAmount = () => {
        setAmount(stakedBalance.toString());
    };

    return (
        <section className='py-8 space-y-6 border rounded-lg px-8 bg-white shadow-lg w-full max-w-[700px]'>
            <h2 className="text-center text-black text-3xl pt-3 pb-5 font-bold">Unstake Your LiquidVest Tokens</h2>
            
            <div className="flex flex-col space-y-4 bg-gray-100 w-full py-4 px-4 rounded-md shadow-sm">
                <div className="flex justify-between">
                    <h3 className="text-gray-500 font-medium">Staked Balance:</h3>
                    <p className="font-bold text-black text-lg md:text-xl">{stakedBalance.toLocaleString()}</p>
                </div>
                <div className="flex justify-between">
                    <h3 className="text-gray-500 font-medium">Unstaked Balance:</h3>
                    <p className="font-bold text-black text-lg md:text-xl">{unstakedBalance.toLocaleString()}</p>
                </div>
            </div>

            <div className="rounded-md bg-gray-200 p-4 flex items-center justify-between border">
                <span className="text-gray-600 font-medium">LQINV</span>
                <div className="flex items-center w-full ml-2">
                    <Input
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="bg-transparent text-xl text-right border-none outline-none focus:ring-0 flex-1"
                    />
                    <Button className="ml-2 py-1 px-3 bg-blue-500 hover:bg-blue-700 text-white font-bold text-sm rounded-md transition-all duration-300" onClick={setMaxAmount}>
                        Max
                    </Button>
                </div>
            </div>

            <div className="flex flex-col space-y-4">
                <div className="flex justify-between">
                    <h4 className="text-gray-500 font-medium">Estimated Unstake Time:</h4>
                    <p className="font-bold text-black text-lg md:text-xl">24 Hours</p>
                </div>
            </div>

            <Button
                className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-bold text-lg rounded-md shadow-md transition-all duration-300"
                onClick={handleUnstake}
                disabled={!publicKey || !amount}
            >
                Unstake Tokens
            </Button>
        </section>
    );
};

export default UnstakingForm;
