"use client"
import MaxwidthWrapper from './max-width-wrapper'
import Image from 'next/image'
import { useAppContext } from '../../../context/app-state'
import { cn } from '@/lib/utils'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import axios from 'axios'
import { useEffect } from 'react'
import { ENDPOINT } from '../../../utils/constants'
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { MD5 } from 'crypto-js';

const Navbar = () => {
    const { currentMode, setCurrentMode } = useAppContext()
    const { connection } = useConnection();
  const { publicKey } = useWallet();
 
    useEffect(() => {
        if (connection && publicKey) {
          axios.post(`${ENDPOINT}/signup`, {
              "walletAddress": publicKey?.toBase58(), 
              "userId": MD5(publicKey?.toBase58()).toString(), 
              "pool": 1
          })
          .then(response => {
              console.log(response); // Log the response data
          })
          .catch(error => {
              console.error('There was a problem with the axios request:', error);
          });
       }
       console.log('tan')
      }, [connection, publicKey])
    
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