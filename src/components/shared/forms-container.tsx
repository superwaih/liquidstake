"use client"
import { useAppContext } from '../../../context/app-state'
import MaxwidthWrapper from './max-width-wrapper'
import StakingForm from './staking-form'
import UnstakingForm from './unstaking-form'

import { useDataFetch } from '../../../hooks/useDataFetch'





const FormsContainer = () => {
    const { stakingData, handleStake, handleUnstake,
        amountIn,
        amountUnstake,
        setAmountIn,
        setAmountUnstake
    } = useDataFetch()


    const { currentMode, messageInfo, setCurrentMode } = useAppContext();



    return (
        <MaxwidthWrapper>
            <section className='py-8 ease-in-out duration-300 transition-all flex items-center justify-center flex-col'>
                <div className='bg-white py-2 ease-in-out duration-300 transition-all rounded-2xl px-3 flex'>
                    <button
                        onClick={() => setCurrentMode('staking')}
                        disabled={messageInfo.isLoading}
                        className={
                            currentMode === 'staking' ?
                                'bg-green-600 px-4 cursor-pointer py-3 rounded-3xl text-white font-bold' :
                                'px-4 py-3 cursor-pointer text-black font-bold'
                        }>
                        Staking
                    </button>
                    <button
                        disabled={messageInfo.isLoading}

                        onClick={() => setCurrentMode('unstaking')}
                        className={
                            currentMode === 'unstaking' ?
                                'bg-green-600 cursor-pointer px-4 py-3 rounded-3xl text-white font-bold' :
                                'px-4 py-3 cursor-pointer text-black font-bold'
                        }>
                        Unstaking
                    </button>
                </div>

                <div className='mt-12'>
                    {currentMode === 'staking' ?
                        <StakingForm
                            amountIn={amountIn}
                            stakingData={stakingData}
                            setAmountIn={setAmountIn}
                            handleStake={handleStake} />
                        :
                        <UnstakingForm
                            amountUnstake={amountUnstake}
                            setAmountUnstake={setAmountUnstake}
                            stakingData={stakingData}
                            handleUnstake={handleUnstake}
                        // handleClaim={handleClaim} 

                        />
                    }
                </div>
            </section>
        </MaxwidthWrapper>
    )
}

export default FormsContainer
