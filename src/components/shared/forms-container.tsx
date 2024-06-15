"use client"
import { useAppContext } from '../../../context/app-state'
import MaxwidthWrapper from './max-width-wrapper'
import StakingForm from './staking-form'
import UnstakingForm from './unstaking-form'

const FormsContainer = () => {
    const { currentMode } = useAppContext()
  return (

<MaxwidthWrapper>
    <section className='py-12 mt-20 flex items-center justify-center flex-col'>


    {
        currentMode === 'staking' ?
          <StakingForm />

          :
          <UnstakingForm />
        }
        </section>
        </MaxwidthWrapper>
  )
}

export default FormsContainer