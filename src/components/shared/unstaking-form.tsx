//@ts-ignore
"use client"
import { useState, useEffect } from 'react';
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, Transaction, SystemProgram } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { useGetAccountBalance } from '../../../hooks/useGetBalance';
import { useAppContext } from '../../../context/app-state';
import { Shell } from 'lucide-react';

const UnstakingForm = ({handleUnstake, stakingData, amountUnstake, setAmountUnstake}) => {
    const { balance } = useGetAccountBalance()
    const { publicKey} = useWallet();
 
    const {messageInfo} = useAppContext()


  
    const setMaxAmount = () => {
        setAmountUnstake(stakingData?.totalStaked);
    };

    return (
        <section className='py-8 space-y-6 border rounded-lg px-8 bg-white shadow-lg w-full max-w-[700px]'>
            <h2 className="text-center text-black text-3xl pt-3 pb-5 font-bold">Unstake Your LQINV Tokens</h2>
            
            <div className="flex flex-col space-y-4 bg-gray-100 w-full py-4 px-4 rounded-md shadow-sm">
                <div className="flex justify-between">
                    <h3 className="text-gray-500 font-medium">Staked Balance:</h3>
                    <p className="font-bold text-black text-lg md:text-xl">{stakingData?.totalStaked}</p>
                </div>
                <div className="flex justify-between">
                    <h3 className="text-gray-500 font-medium">Unstaked Balance:</h3>
                    <p className="font-bold text-black text-lg md:text-xl">{balance}</p>
                </div>
            </div>

            <div className="rounded-md bg-gray-200 p-4 flex items-center justify-between border">
                <span className="text-gray-600 font-medium">LQINV</span>
                <div className="flex items-center w-full ml-2">
                    <Input
                        placeholder="0.00"
                        value={amountUnstake}
                       
                        onChange={(e) => setAmountUnstake(e.target.value)}
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
                disabled={!publicKey  || messageInfo.isLoading }
            >
                {messageInfo.isLoading && <Shell color='#00F5FF' className='animate-spin' />}

                Unstake Tokens
            </Button>
        </section>
    );
};

export default UnstakingForm;
