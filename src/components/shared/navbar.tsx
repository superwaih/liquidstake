"use client"
import MaxwidthWrapper from './max-width-wrapper'
import Image from 'next/image'
import { useAppContext } from '../../../context/app-state'
import { cn } from '@/lib/utils'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'

const Navbar = () => {
    const { currentMode, setCurrentMode } = useAppContext()

    return (
        <nav className='bg-black sticky inset-x-0 top-0 h-20 py-4 backdrop-blur-lg transition-all'>
            <MaxwidthWrapper className='flex text-white items-center justify-between'>
                <a href={'https://liquidinvest.io/#overview'}>
                    <Image
                        src={'/images/logo.PNG'}
                        alt={'logo'}
                        width={30}
                        height={30}
                    />

                </a>

                <div className='hidden md:flex gap-4'>
                    <div
                        onClick={() => setCurrentMode('staking')}
                        className={cn('text-[14px] font-semibold cursor-pointer', {
                            'text-green-600': currentMode === 'staking',
                        })}
                    >
                        Stake Tokens
                    </div>

                    <div
                        onClick={() => setCurrentMode('unstaking')}
                        className={cn('text-[14px] font-semibold cursor-pointer', {
                            'text-green-600': currentMode === 'unstaking',
                        })}
                    >
                        Withdraw Funds
                    </div>


                </div>
                <WalletMultiButton />

            </MaxwidthWrapper>
        </nav>
    )
}

export default Navbar