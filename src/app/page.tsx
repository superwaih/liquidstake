"use client"
import Navbar from "@/components/shared/navbar";
import Image from "next/image";
import { useAppContext } from "../../context/app-state";
import StakingForm from "@/components/shared/staking-form";
import UnstakingForm from "@/components/shared/unstaking-form";
import FormsContainer from "@/components/shared/forms-container";
import { useEffect } from "react";
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { ENDPOINT } from "../../utils/constants";
import axios from "axios"
import { MD5 } from 'crypto-js';

export default function Home() {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
 
  return (
    <main className=" ">
      <Navbar />
     <FormsContainer />
    </main>
  );
}
