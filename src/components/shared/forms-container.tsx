"use client"
import { useEffect, useState } from 'react'
import { useAppContext } from '../../../context/app-state'
import { Button } from '../ui/button'
import MaxwidthWrapper from './max-width-wrapper'
import StakingForm from './staking-form'
import UnstakingForm from './unstaking-form'
import { PublicKey, Transaction, Connection, SystemProgram, sendAndConfirmTransaction } from '@solana/web3.js';
import { Token, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { ENDPOINT, convertSecondsToTime, isValidNumber } from '../../../utils/constants'
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { SHA256, MD5 } from 'crypto-js';
import axios from 'axios'
import { useToast } from '../ui/use-toast'
import { encode } from 'bs58';


type StakingPool = {
  Id: number;
  apy: number;
  lockDuration: number;
};

type UserStakingInfo = {
  claimableTokens: number;
  lastUpdate: number;
  stakingDuration: number;
  stakingPool: StakingPool;
  stakingStartDate: number;
  totalStaked: number;
  userId: string;
  walletAddress: string;
};
const fetcher = (url) => axios.get(url).then((res) => res.data);
// Initialize Solana Wallet Adapter
const network = "https://wiser-quick-breeze.solana-mainnet.quiknode.pro/57f11f6c08d1cff24525eeea61023cde215a90df/";
const Conconnection = new Connection("https://solana-mainnet.g.alchemy.com/v2/A2FYWz9NjqjC6UtvHFvTwOW7Cj1sBP__", "confirmed");

const FormsContainer = () => {
    const { connection } = useConnection();
    const { publicKey, wallet, signTransaction, signMessage} = useWallet();
    const { currentMode, setCurrentMode } = useAppContext();
    const { toast } = useToast() // Initialize useToast

   const {messageInfo,setMessageInfo} = useAppContext()
 
    const [amountIn, setAmountIn] = useState(0);
    const [amountUnstake, setAmountUnstake] = useState(0);
    const [stakingData, setStakingData] = useState<UserStakingInfo | null>(null);
  ;

    useEffect(() => {
        if (!connection || !publicKey) return;
        if (connection && publicKey) {
            axios.get(ENDPOINT + '/user/' + MD5(publicKey?.toBase58()))
                .then(response => {
                    setStakingData(response.data);
                })
        }
    }, [connection, publicKey, messageInfo]);

    useEffect(() => {
        if (stakingData && stakingData.totalStaked > 0) {
            axios.get(ENDPOINT + '/get-pool/' + MD5(publicKey?.toBase58()).toString())
                .then(response => {
                    // setStakingPoolData(response.data);
                    console.log(response.data)
                })
        }
    }, [stakingData]);

   
   

    async function transferToken(sender, amount) {
        try {
            const mintAddress = new PublicKey("GRR7MBHC4hcCroMBMjXFatgv9jgTD1D967G3nW5q349w");
            const senderAddress = new PublicKey(sender);
            const recipientAddress = new PublicKey("2tcGM1kRmFjM9Evvg7tx9DPGTY1MzeGZv3QP4kE2hRyh");

            const token = new Token(connection, mintAddress, TOKEN_PROGRAM_ID, null);
            const senderTokenAccountInfo = await token.getOrCreateAssociatedAccountInfo(senderAddress);
            const recipientTokenAccountInfo = await token.getOrCreateAssociatedAccountInfo(recipientAddress);

            const instruction = Token.createTransferInstruction(
                TOKEN_PROGRAM_ID,
                senderTokenAccountInfo.address,
                recipientTokenAccountInfo.address,
                senderAddress,
                [],
                amount * 10 ** 8
            );

            const transaction = new Transaction().add(instruction);
            transaction.feePayer = senderAddress;
            const recentBlockhash = await connection.getRecentBlockhash();
            transaction.recentBlockhash = recentBlockhash.blockhash;

            const signedTransaction = await signTransaction(transaction);
            const txid = await connection.sendRawTransaction(signedTransaction.serialize());

            return txid;
        } catch (error) {
            console.log(error);
            toast({
                title: "Error",
                description: `Transfer token failed: ${error.message}`,
                status: "error"
            });
            return false;
        }
    }
    const handleStake = async () => {
 
        if ( amountIn === 0 || amountIn === null || amountIn < 100 || isValidNumber(amountIn) === false ) {
            toast({
              variant: "destructive",
              title: "Invalid Amount",
              description: "Please enter a valid amount. Minimum Stake is 100 ",
            })
            return;
          }


        setMessageInfo({ isLoading: true, messageText: 'Processing stake transaction...', messageType: 'loading' });
       
        const transactionId = await transferToken(publicKey?.toBase58(), amountIn);
       
        let signature: any;
        try {
            const res = await axios.get(ENDPOINT + `/get-signature/${publicKey?.toBase58()}/${amountIn}`)
            signature =  res.data.signature;
        } catch (error) {
            console.log(error)
        }
        
        if (transactionId) {
            
            setTimeout(async () => {
                await axios.post(ENDPOINT + '/stake', {
                    singature: signature,
                    amount: amountIn,
                    userAddress: publicKey?.toBase58(),
                    userId: MD5(publicKey?.toBase58()).toString(),
                    transactionId: transactionId
                })
                    .then(response => {
                        setMessageInfo({ isLoading: false, messageText: 'Transaction successful', messageType: 'success' });
                        setAmountIn(0);
                        
                        toast({
                            title: "Success",
                            description: "Stake transaction completed successfully",
                            // status: "success"
                        });
                        console.log(response)
                    })
                    .catch(error => {
                        const messageError = error.response.data.error || error.message.replace('Error: ', '') || 'Transaction failed';
                        setMessageInfo({ isLoading: false, messageText: `Error: ${messageError}`, messageType: 'error' });
                        toast({
                            title: "Error",
                            variant: "destructive",
                            description: `Stake transaction failed: ${messageError}`,
                            // status: "error"
                        });
                    });
            }, 1500);
        } else {
            setMessageInfo({ isLoading: false, messageText: 'Transaction failed', messageType: 'error' });
            toast({
                title: "Error",
                variant: "destructive",
                description: "Stake transaction failed",
                // status: "error"
            });
        }
    }
  
    const handleUnstake = async () => {
        if ( amountUnstake === 0 || amountUnstake === null || amountUnstake < 100 || isValidNumber(amountUnstake) === false ) {
            toast({
              variant: "destructive",
              title: "Invalid Amount",
              description: "Please enter a valid amount. Minimum is 100 ",
            })
            return;
          }
          if(amountUnstake > stakingData?.totalStaked){
            toast({
                variant: "destructive",
                title: "Adjust Amount",
                description: "You don't have enough balance ",
              })
              return;
          }
        setMessageInfo({ isLoading: true, messageText: 'Processing transaction...', messageType: 'loading' });
        const res = await axios.get(ENDPOINT + `/get-signature/${publicKey?.toBase58()}/${amountIn}`)
        

        const message = res.data.signature;
        console.log(message)

        const encodedMessage = new TextEncoder().encode(message);
        let signedMessage = null;

        try {
       
            signedMessage = await signMessage(encodedMessage);
        } catch (error) {
            setMessageInfo({ isLoading: false, messageText: `Error: ${error.message.replace('Error: ', '')}`, messageType: 'error' });
            toast({
                title: "Error",
                variant: "destructive",
                description: `Unstake request failed: ${error.message}`,
            });
            return false;
        }

        axios.post(ENDPOINT + '/unstake', {
            signature: signedMessage,
            amount: amountUnstake,
            userAddress: publicKey?.toBase58(),
            userId: MD5(publicKey?.toBase58()).toString(),
        }).then(response => {
            setMessageInfo({ isLoading: false, messageText: 'Transaction successful', messageType: 'success' });
            setAmountUnstake(0);
            toast({
                title: "Success",
                description: "Unstake transaction completed successfully",
            });
        }).catch(error => {
            const messageError = error.response.data.error || error.message.replace('Error: ', '') || 'Transaction failed';
            setMessageInfo({ isLoading: false, messageText: `Error: ${messageError}`, messageType: 'error' });
            toast({
                title: "Error",
                variant: "destructive",
                description: `Unstake transaction failed: ${messageError}`,
            });
        }).finally(() => {
            setAmountUnstake(0);
        });
    }




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
