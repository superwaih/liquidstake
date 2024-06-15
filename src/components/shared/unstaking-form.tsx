"use client"
import { useState } from 'react';
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const UnstakingForm = () => {
    const [amount, setAmount] = useState('');
    const stakedBalance = 10000; // Example staked balance

    const handleUnstake = () => {
        // Implement unstaking logic here
        console.log(`Unstaking ${amount}`);
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
                    <p className="font-bold text-black text-lg md:text-xl">2,000</p>
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

            <Button className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-bold text-lg rounded-md shadow-md transition-all duration-300" onClick={handleUnstake}>
                Unstake Tokens
            </Button>
        </section>
    )
}

export default UnstakingForm;
