"use client"
import Navbar from "@/components/shared/navbar";
import Image from "next/image";
import { useAppContext } from "../../context/app-state";
import StakingForm from "@/components/shared/staking-form";
import UnstakingForm from "@/components/shared/unstaking-form";
import FormsContainer from "@/components/shared/forms-container";

export default function Home() {
 
  return (
    <main className=" ">
      <Navbar />
     <FormsContainer />
    </main>
  );
}
