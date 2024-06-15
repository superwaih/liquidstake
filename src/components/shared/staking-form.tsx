import { Button } from "../ui/button"
import { Input } from "../ui/input"

const StakingForm = () => {
    return (
        <section className='py-4 md:py-8 space-y-6 border rounded-lg px-4 md:px-8 bg-white shadow-lg w-full max-w-[700px]'>
            <h2 className="text-center text-black text-xl md:text-3xl pt-3 pb-5 font-bold">Stake Your LiquidVest Tokens</h2>
            <p className="text-center text-gray-700 text-xl">Earn <span className="bg-green-600 text-white rounded-md px-3">Sol</span> Rewards</p>
            
            <div className="flex flex-col space-y-4 bg-gray-100 w-full py-4 px-4 rounded-md shadow-sm">
                <div className="flex justify-between">
                    <h3 className="text-gray-500 font-medium">LiquidVest Token Balance:</h3>
                    <p className="font-bold text-black text-lg md:text-xl">5,000,000</p>
                </div>
                <div className="flex justify-between">
                    <h3 className="text-gray-500 font-medium">Staked:</h3>
                    <p className="font-bold text-black text-lg md:text-xl">0</p>
                </div>
            </div>

            <div className="rounded-md bg-gray-200 p-4 flex items-center justify-between border">
                <span className="text-gray-600 font-medium">LQINV</span>
                <Input
                    placeholder="0.00"
                    className="bg-transparent text-xl text-right border-none outline-none focus:ring-0 flex-1 ml-2"
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

            <Button className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-bold text-lg rounded-md shadow-md transition-all duration-300">
                Stake Tokens
            </Button>
        </section>
    )
}

export default StakingForm
