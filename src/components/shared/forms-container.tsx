"use client"
import { useEffect, useState } from 'react'
import { useAppContext } from '../../../context/app-state'
import { Button } from '../ui/button'
import MaxwidthWrapper from './max-width-wrapper'
import StakingForm from './staking-form'
import UnstakingForm from './unstaking-form'
import { PublicKey, Transaction, Connection, SystemProgram, sendAndConfirmTransaction } from '@solana/web3.js';
import { Token, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { ENDPOINT, convertSecondsToTime } from '../../../utils/constants'
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { SHA256, MD5 } from 'crypto-js';
import axios from 'axios'
import { useToast } from '../ui/use-toast'

const opts = {
  preflightCommitment: "processed"
};

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
    const { publicKey, wallet, signTransaction } = useWallet();
    const { currentMode, setCurrentMode } = useAppContext();
    const { toast } = useToast() // Initialize useToast

   const {messageInfo,setMessageInfo} = useAppContext()
 
    const [amountIn, setAmountIn] = useState(0);
    const [amountUnstake, setAmountUnstake] = useState(0);
    const [stakingData, setStakingData] = useState<UserStakingInfo | null>(null);
    const [stakePool, setStakePool] = useState(1);
    const [stakingPoolData, setStakingPoolData] = useState(null);
    const [stakingDuration, setStakingDuration] = useState(0);
    const [poolsInfo, setPoolsInfo] = useState(null);

    useEffect(() => {
        if (!connection || !publicKey) return;
        if (connection && publicKey) {
            axios.get(ENDPOINT + '/user/' + MD5(publicKey?.toBase58()))
                .then(response => {
                    setStakingData(response.data);
                    // console.log(response.data); // Log the response data
                })
        }
    }, [connection, publicKey, messageInfo]);

    useEffect(() => {
        if (stakingData && stakingData.totalStaked > 0) {
            axios.get(ENDPOINT + '/get-pool/' + MD5(publicKey?.toBase58()).toString())
                .then(response => {
                    setStakingPoolData(response.data);
                })
        }
    }, [stakingData]);

    useEffect(() => {
        if (stakingData) {
            const interval = setInterval(() => {
                setStakingDuration(convertSecondsToTime((stakingData.stakingStartDate + 86400000 * stakingPoolData.lockDuration - Date.now()) / 1000));
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [stakingPoolData]);

    useEffect(() => {
        if (stakePool) {
            axios.get(ENDPOINT + '/get-pools/')
                .then(response => {
                    setPoolsInfo(response.data);
                })
        }
    }, [stakePool]);

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
 console.log(stakingData)
    const handleStake = async () => {
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
  
// console.log(getTransactionInfo('3WsKHWE2yX6BLQnHJYLgCw93ZexnYsAYXhrs8CywNAgUqZmiBFazSfB8b3WUJAGAJk6HxgJQNUcMnBQ37gW9gxSg') )     
    const handleUnstake = async () => {
        setMessageInfo({ isLoading: true, messageText: 'Processing transaction...', messageType: 'loading' });
        const message = await (await axios.get(ENDPOINT + `/get-signature/${publicKey?.toBase58()}/${amountIn}`)).data.signature;
        const encodedMessage = new TextEncoder().encode(message);
        let signedMessage = null;

        try {
            signedMessage = await window.solana.request({
                method: 'signMessage',
                params: {
                    message: encodedMessage,
                    display: 'utf8',
                },
            });
        } catch (error) {
            setMessageInfo({ isLoading: false, messageText: `Error: ${error.message.replace('Error: ', '')}`, messageType: 'error' });
            toast({
                title: "Error",
                variant: "destructive",
                description: `Unstake request failed: ${error.message}`,
                // status: "error"
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
                // status: "success"
            });
        }).catch(error => {
            const messageError = error.response.data.error || error.message.replace('Error: ', '') || 'Transaction failed';
            setMessageInfo({ isLoading: false, messageText: `Error: ${messageError}`, messageType: 'error' });
            toast({
                title: "Error",
                variant: "destructive",
                description: `Unstake transaction failed: ${messageError}`,
                // status: "error"
            });
        }).finally(() => {
            setAmountUnstake(0);
        });
    }

    const handleClaim = async () => {
        setMessageInfo({ isLoading: true, messageText: 'Processing unstake transaction...', messageType: 'loading' });
        const message = await (await axios.get(ENDPOINT + `/get-signature/${publicKey?.toBase58()}/${amountIn}`)).data.signature;
        const encodedMessage = new TextEncoder().encode(message);
        let signedMessage = null;

        try {
            signedMessage = await window.solana.request({
                method: 'signMessage',
                params: {
                    message: encodedMessage,
                    display: 'utf8',
                },
            });
        } catch (error) {
            setMessageInfo({ isLoading: false, messageText: `Error: ${error.message.replace('Error: ', '')}`, messageType: 'error' });
            toast({
                title: "Error",
                variant: "destructive",
                description: `Claim request failed: ${error.message}`,
                // status: "error"
            });
            return false;
        }

        axios.post(ENDPOINT + '/claim', {
            signature: signedMessage,
            amount: amountIn,
            userAddress: publicKey?.toBase58(),
            userId: MD5(publicKey?.toBase58()).toString(),
        }).then(response => {
            setMessageInfo({ isLoading: false, messageText: 'Transaction successful', messageType: 'success' });
            toast({
                title: "Success",
                description: "Claim transaction completed successfully",
                // status: "success"
            });
        }).catch(error => {
            const messageError = error.response.data.error || error.message.replace('Error: ', '') || 'Transaction failed';
            setMessageInfo({ isLoading: false, messageText: `Error: ${messageError}`, messageType: 'error' });
            toast({
                title: "Error",
                description: `Claim transaction failed: ${messageError}`,
                // status: "error"
            });
        });
    }

    const showPoolInfo = (poolId) => {
        setMessageInfo({ isLoading: false, messageText: `APY : ${poolsInfo.pools[poolId].apy}% and Token Lock Duration : ${poolsInfo.pools[poolId].lockDuration} Days`, messageType: 'info', boxType: 'info' });
        setStakePool(poolId);
        toast({
            title: "Pool Info",
            description: `APY: ${poolsInfo.pools[poolId].apy}%\nToken Lock Duration: ${poolsInfo.pools[poolId].lockDuration} Days`,
            status: "info"
        });
    }

    // console.log('staking_data', stakingData)
    return (
        <MaxwidthWrapper>
            <section className='py-12 ease-in-out duration-300 transition-all flex items-center justify-center flex-col'>
                <div className='bg-white py-2 ease-in-out duration-300 transition-all rounded-2xl px-3 flex'>
                    <div 
                        onClick={() => setCurrentMode('staking')}
                        className={
                            currentMode === 'staking' ?
                            'bg-green-600 px-4 cursor-pointer py-3 rounded-3xl text-white font-bold' :
                            'px-4 py-3 cursor-pointer text-black font-bold'
                        }>
                        Staking
                    </div>
                    <div
                        onClick={() => setCurrentMode('unstaking')}
                        className={
                            currentMode === 'unstaking' ?
                            'bg-green-600 cursor-pointer px-4 py-3 rounded-3xl text-white font-bold' :
                            'px-4 py-3 cursor-pointer text-black font-bold'
                        }>
                        Unstaking
                    </div>
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
                            handleClaim={handleClaim} />
                    }
                </div>
            </section>
        </MaxwidthWrapper>
    )
}

export default FormsContainer
