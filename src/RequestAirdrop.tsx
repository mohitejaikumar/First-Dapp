import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useState } from "react";



export function RequestAirdrop(){

    const wallet = useWallet();
    const {connection} = useConnection();
    const [amount,setAmount] = useState("0");

    async function requestAirdrop(){
        if(wallet?.publicKey && connection){
            await connection.requestAirdrop(wallet.publicKey,Number(amount)*LAMPORTS_PER_SOL);
            alert(`Airdropped ${amount} SOL to ${wallet.publicKey.toBase58()}`);
        }
    }

    return (
        <div style={{display:"flex", gap:"10px" , marginTop:"20px"}}>
            <input type="text" id="amount" placeholder="Amount" onChange={(e)=>{setAmount(e.target.value)}}></input>
            <button onClick={()=>requestAirdrop()}>Request Airdrop</button>
        </div>
    )
}