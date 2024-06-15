"use client"
import { useAppContext } from '../../../context/app-state'
import { Button } from '../ui/button'
import MaxwidthWrapper from './max-width-wrapper'
import StakingForm from './staking-form'
import UnstakingForm from './unstaking-form'

const FormsContainer = () => {
    const { currentMode, setCurrentMode } = useAppContext()
  return (

<MaxwidthWrapper>
    <section className='py-12 ease-in-out duration-300 transition-all   flex items-center justify-center flex-col'>

    <div className='bg-white py-2 ease-in-out duration-300 transition-all rounded-2xl px-3 flex'>
        <div 
        onClick={() => setCurrentMode('staking')}
        className={
            currentMode === 'staking' ?
            'bg-green-600 px-4 cursor-pointer py-3 rounded-3xl text-white font-bold' :
            ' px-4 py-3 cursor-pointer  text-black font-bold'
        }>
            Staking
        </div>
        <div
        onClick={() => setCurrentMode('unstaking')}
        
        className={
            currentMode === 'unstaking' ?
            'bg-green-600 cursor-pointer px-4 py-3 rounded-3xl text-white font-bold' :
            ' px-4 py-3 cursor-pointer  text-black font-bold'
        }>
            Unstaking
        </div>
    </div>

    <div className='mt-12'>
    {
        currentMode === 'staking' ?
          <StakingForm />

          :
          <UnstakingForm />
        }

    </div>
        </section>
        </MaxwidthWrapper>
  )
}

export default FormsContainer