"use client"
import { Shell } from "lucide-react";
import { useAppContext } from "../../../context/app-state";
import { useGetAccountBalance } from "../../../hooks/useGetBalance"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

const StakingForm = ({handleStake, amountIn, setAmountIn, stakingData}) => {
    const { balance } = useGetAccountBalance()
    const { connection } = useConnection()
    const { publicKey } = useWallet();
    const {messageInfo} = useAppContext()

    return (
        <section className='py-4 md:py-8 space-y-6 border rounded-lg px-4 md:px-8 bg-white shadow-lg w-full max-w-[700px]'>
            <h2 className="text-center text-black text-xl md:text-3xl pt-3 pb-5 font-bold">Stake Your LiquidVest Tokens</h2>
            <p className="text-center text-gray-700 text-xl">Earn <span className="bg-green-600 text-white rounded-md px-3">Sol</span> Rewards</p>

            <div className="flex flex-col space-y-4 bg-gray-100 w-full py-4 px-4 rounded-md shadow-sm">
                <div className="flex justify-between">
                    {
                        !publicKey || !connection ?
                            <div className="flex flex-col space-y-2">
                                <p className="text-black font-medium text-center text-lg pb-3" >Please Connect your wallet to view your balances!</p>
                                <div className="flex justify-between">
                                    <h3 className="text-gray-500 font-medium">Liquid Invest Token Balance:</h3>
                                    <p className="font-bold text-black text-lg md:text-xl">0</p>
                                </div>

                            </div>
                            :
                            <>
                                <h3 className="text-gray-500 text-sm md:text-md font-medium">LiquidInvest Token Balance:</h3>
                                <p className="font-bold text-black text-lg md:text-xl">{balance} LQINV</p>
                            </>
                    }


                </div>
                <div className="flex justify-between">
                    <h3 className="text-gray-500 font-medium">Staked:</h3>
                    <p className="font-bold text-black text-lg md:text-xl">{stakingData?.totalStaked}</p>
                </div>
            </div>

            <div className="rounded-md bg-gray-200 p-4 flex items-center justify-between border">
                <span className="text-gray-600 font-medium">LQINV</span>
                <Input
                value={amountIn}
                onChange={(e) => setAmountIn(e.target.value)}
                    placeholder="0.00"
                    className="bg-transparent focus:outline-none text-xl text-right border-none outline-none focus:ring-0 flex-1 ml-2"
                />
            </div>

            <div className="flex flex-col space-y-4">
                <div className="flex justify-between">
                    <h4 className="text-gray-500 font-medium">Estimated Rewards:</h4>
                    <p className="font-bold text-black text-lg md:text-xl">--</p>
                </div>
                <div className="flex justify-between">
                    <h4 className="text-gray-500 font-medium">APY:</h4>
                    <p className="font-bold text-black text-lg md:text-xl">12.5%</p>
                </div>
            </div>

            <Button
                disabled={
                    !publicKey || !connection ||  messageInfo.isLoading
                }
                onClick={() =>handleStake()}
                className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-bold text-lg rounded-md shadow-md transition-all duration-300">
                {messageInfo.isLoading && <Shell color='#00F5FF' className='animate-spin' />}
                {
                    !publicKey || !connection ?
                        "Connect Wallet"
                        :
                        "Stake Tokens"
                }

            </Button>
        </section>
    )
}

export default StakingForm
