"use client"
import * as web3 from '@solana/web3.js';

import * as walletAdapterReact from '@solana/wallet-adapter-react'; 
import * as walletAdapterWallets from '@solana/wallet-adapter-wallets';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import '@solana/wallet-adapter-react-ui/styles.css'

import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PropsWithChildren, useEffect, useState } from 'react';

const QUICKNODE_RPC = 'https://wiser-quick-breeze.solana-mainnet.quiknode.pro/57f11f6c08d1cff24525eeea61023cde215a90df/';


const WalletLayout = ({children} : PropsWithChildren) =>{
    const [balance, setBalance] = useState<number | null>(0);
    const endpoint = QUICKNODE_RPC
    const wallets = [
        //  new walletAdapterWallets.UnsafeBurnerWalletAdapter(),
        new walletAdapterWallets.PhantomWalletAdapter(),
        // new walletAdapterWallets.SolflareWalletAdapter()
    ];
    const { connection } = useConnection();
    const { publicKey } = useWallet();
    useEffect(() => {
        const getInfo = async () => {
            if (connection && publicKey) {
                // we get the account info for the user's wallet data store and set the balance in our application's state
                const info = await connection.getAccountInfo(publicKey);
                setBalance(info!.lamports / web3.LAMPORTS_PER_SOL);
            }
        }
        getInfo();
        // the code above will execute whenever these variables change in any way
    }, [connection, publicKey]);
  
    

    return(
<>
<walletAdapterReact.ConnectionProvider endpoint={endpoint}>
                {/* makes the wallet adapter available to the entirety of our application (wrapped in this component) */}
                <walletAdapterReact.WalletProvider wallets={wallets}>
                    {/* provides components to the wrapped application */}
                    <WalletModalProvider>
                       {children}
                    </WalletModalProvider>
                </walletAdapterReact.WalletProvider>
            </walletAdapterReact.ConnectionProvider>
</>
    )
}

export default WalletLayout