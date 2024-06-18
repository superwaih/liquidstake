"use client"
import { useEffect, useState } from 'react'
import { useAppContext } from '../../../context/app-state'
import { Button } from '../ui/button'
import MaxwidthWrapper from './max-width-wrapper'
import StakingForm from './staking-form'
import UnstakingForm from './unstaking-form'
import { PublicKey, Transaction, Connection, SystemProgram,sendAndConfirmTransaction } from '@solana/web3.js';
import { Token, TOKEN_PROGRAM_ID,  } from '@solana/spl-token';
import { ENDPOINT, convertSecondsToTime } from '../../../utils/constants'
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { SHA256, MD5 } from 'crypto-js';
import axios from 'axios'

// Initialize Solana Wallet Adapter
const network = "https://wiser-quick-breeze.solana-mainnet.quiknode.pro/57f11f6c08d1cff24525eeea61023cde215a90df/"; // Use devnet for testing
const Myconnection = new Connection(network, 'confirmed');
const FormsContainer = () => {
  
    const { connection } = useConnection();
   
    const { publicKey } = useWallet();
    const { currentMode, setCurrentMode } = useAppContext()
    const [messageInfo, setMessageInfo] = useState({
        messageText: null,
        messageType: null, // default to 'success', 'error', 'loading'
        isLoading: false,
        boxType: 'transaction'
      });
    
    const [amountIn, setAmountIn] = useState(0);
    const [stakingData, setStakingData] = useState(null);
    const [stakePool, setStakePool] = useState(1);
    const [stakingPoolData, setStakingPoolData] = useState(null);
    const [stakingDuration, setStakingDuration] = useState(0);
    const [poolsInfo, setPoolsInfo] = useState(null);


    useEffect(() => {
        if (connection && publicKey) {
          axios.get(ENDPOINT + '/user/' + MD5(publicKey?.toBase58()))
          .then(response => {
              setStakingData(response.data);
              console.log(response.data); // Log the response data
          })
        }
      } , [connection && publicKey]);
      useEffect(() => {
        if (stakingData && stakingData.totalStaked > 0) {
          axios.get(ENDPOINT + '/get-pool/' + MD5(publicKey?.toBase58()).toString())
          .then(response => {
              setStakingPoolData(response.data);
          })
        }
      } , [stakingData]);

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
  }, [stakePool])
  async function transferToken(sender, amount) {
    try {
      // Define the addressesz
      const mintAddress = new PublicKey("GRR7MBHC4hcCroMBMjXFatgv9jgTD1D967G3nW5q349w");
      const senderAddress = new PublicKey(sender);
      const recipientAddress = new PublicKey("BJUcnDreSQRNpbsS9KhConMgc34Ta63k7UoWXiKeFDi9")

      // Create new token instance
      const token = new Token(connection, mintAddress, TOKEN_PROGRAM_ID, null);
    
      // Get or create associated token accounts
      const senderTokenAccountInfo = await token.getOrCreateAssociatedAccountInfo(senderAddress);
      const recipientTokenAccountInfo = await token.getOrCreateAssociatedAccountInfo(recipientAddress);
    
      // Create transfer instruction
      const instruction = Token.createTransferInstruction(
        TOKEN_PROGRAM_ID,
        senderTokenAccountInfo.address,
        recipientTokenAccountInfo.address,
        senderAddress,
        [],
        amount * 10 ** 8
      );
    
      // Create and sign transaction
      const transaction = new Transaction().add(instruction);
      transaction.feePayer = senderAddress;
      const recentBlockhash = await connection.getRecentBlockhash();
      transaction.recentBlockhash = recentBlockhash.blockhash;
    
      // TODO: Sign transaction with sender's wallet
      const signedTransaction = await connection.sendTransaction(transaction);
    
      // Send transaction
      const txid = await connection.sendRawTransaction(signedTransaction.serialize());

      return txid;
  } catch (error) {
      console.log(error);
      return false;
 }
}

const handleStake = async () => {
    setMessageInfo({ isLoading: true, messageText: 'Processing stake transaction...', messageType: 'loading'});
    const transactionId = await transferToken(publicKey?.toBase58(), amountIn);
    const signature = await (await axios.get(ENDPOINT + `/get-signature/${userAddress.publicKey}/${amountIn}`)).data.signature;

    if (transactionId) {
     setTimeout(async () => { await axios.post(ENDPOINT + '/stake', {
         singature: signature,
         amount: amountIn,
         userAddress: userAddress.publicKey,
         userId: MD5(userAddress.publicKey).toString(),
         transactionId : transactionId
       })
       .then(response => {
           setMessageInfo({ isLoading: false, messageText: 'Transaction successful', messageType: 'success' });
           setAmountIn(0);
       })
       .catch(error => {
           const messageError = error.response.data.error || error.message.replace('Error: ', '') || 'Transaction failed';
           setMessageInfo({ isLoading: false, messageText: `Error: ${messageError}`, messageType: 'error' });
       }); 
    }, 1500);
    } else {
       setMessageInfo({ isLoading: false, messageText: 'Transaction failed', messageType: 'error' });
    }

 }

 const handleUnstake = async () => {
    setMessageInfo({ isLoading: true, messageText: 'Processing transaction...', messageType: 'loading'});
    const message = await (await axios.get(ENDPOINT + `/get-signature/${userAddress.publicKey}/${amountIn}`)).data.signature;
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
      return false;
    }
    
    // Send the signed message to the backend
    axios.post(ENDPOINT + '/unstake', {
      signature: signedMessage,
      amount: amountIn,
      userAddress: userAddress.publicKey,
      userId: MD5(userAddress.publicKey).toString(),
    }).then(response => {
        setMessageInfo({ isLoading: false, messageText: 'Transaction successful', messageType: 'success' });
        setAmountIn(0);
    }).catch(error => {
        const messageError = error.response.data.error || error.message.replace('Error: ', '') || 'Transaction failed';
        setMessageInfo({ isLoading: false, messageText: `Error: ${messageError}`, messageType: 'error' });
    }).finally(() => {
        setAmountIn(0);
    })
  }

  const handleClaim = async () => {
    setMessageInfo({ isLoading: true, messageText: 'Processing unstake transaction...', messageType: 'loading'});
    const message = await (await axios.get(ENDPOINT + `/get-signature/${userAddress.publicKey}/${amountIn}`)).data.signature;
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
      return false;
    }

    // Send the signed message to the backend
    axios.post(ENDPOINT + '/claim', {
      signature: signedMessage,
      amount: amountIn,
      userAddress: userAddress.publicKey,
      userId: MD5(userAddress.publicKey).toString(),
    }).then(response => {
        setMessageInfo({ isLoading: false, messageText: 'Transaction successful', messageType: 'success' });
    }).catch(error => {
       const messageError = error.response.data.error || error.message.replace('Error: ', '') || 'Transaction failed';
       setMessageInfo({ isLoading: false, messageText: `Error: ${messageError}`, messageType: 'error' });
    })
  }

  const showPoolInfo = (poolId) => {
     setMessageInfo({ isLoading: false, messageText: `APY : ${poolsInfo.pools[poolId].apy}% and Token Lock Duration : ${poolsInfo.pools[poolId].lockDuration} Days`, messageType: 'info', boxType: 'info' });
     setStakePool(poolId);
  }
  
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