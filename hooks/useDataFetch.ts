
import axios from "axios";
import { MD5 } from "crypto-js";
import { useEffect, useState } from "react";
import { ENDPOINT, isValidNumber, transferToken } from "../utils/constants";
import { useToast } from "@/components/ui/use-toast";
import { useAppContext } from "../context/app-state";
import { useConnection, useWallet } from '@solana/wallet-adapter-react';

export const useDataFetch = ()=>{
    const { connection } = useConnection();
    const { publicKey, wallet, signTransaction, signMessage} = useWallet();
   
    const { toast } = useToast() // Initialize useToast
    const [amountIn, setAmountIn] = useState(0);
    const [amountUnstake, setAmountUnstake] = useState(0);
    const {messageInfo,setMessageInfo} = useAppContext()
    const [stakingData, setStakingData] = useState<UserStakingInfo | null>(null);


    useEffect(() => {
        if (!connection || !publicKey) return;
    
        const fetchStakingData = async () => {
          try {
            const response = await axios.get(`${ENDPOINT}/user/${MD5(publicKey.toBase58())}`);
            setStakingData(response.data);
          } catch (error) {
            console.error('Failed to fetch staking data:', error);
          }
        };
    
        fetchStakingData();
      }, [connection, publicKey, messageInfo]);


      useEffect(() => {
        if (stakingData && stakingData.totalStaked > 0) {
          const fetchStakingPoolData = async () => {
            try {
              const response = await axios.get(`${ENDPOINT}/get-pool/${MD5(publicKey?.toBase58()).toString()}`);
              // Assuming there's a function or state to set this data
              setStakingPoolData(response.data);
            } catch (error) {
              console.error('Failed to fetch staking pool data:', error);
            }
          };
    
          fetchStakingPoolData();
        }
      }, [stakingData, publicKey]);


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
       
        const transactionId = await transferToken(connection, publicKey?.toBase58(), amountIn);
       
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
      return{
        stakingData,
        handleStake,
        handleUnstake,
        amountIn,
        amountUnstake,
        setAmountIn,
        setAmountUnstake
      }
}