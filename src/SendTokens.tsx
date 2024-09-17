import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { useState } from "react";



export function SendTokens(){

    const wallet = useWallet();
    const {connection} = useConnection();
    const [amount, setAmount] = useState("");
    const [destination, setDestination] = useState("");
    

    async function onClick(){
        if(!wallet?.publicKey || !connection){
            
            throw new Error("Wallet not connected");
        }
        console.log(destination , amount);
        const transaction = new Transaction();
        transaction.add(
            SystemProgram.transfer({
                fromPubkey: wallet.publicKey,
                toPubkey: new PublicKey(destination),
                lamports: Number(amount)*LAMPORTS_PER_SOL
                ,
            })
        )

        await wallet.sendTransaction(transaction,connection);
        alert(`Sent ${amount} SOL to ${destination}`);
    }

    return (
        <>
            <div style={{marginTop:"10px"}}>
                Send SOL
            </div>
            <div style={{display:"flex", gap:"10px"}}>
                <input type="text" placeholder="Destination" value={destination} onChange={(e)=>{setDestination(e.target.value)}}></input>
                <input type="text" placeholder="Amount" value={amount} onChange={(e)=>{setAmount(e.target.value)}}></input>
                <button onClick={onClick}>Send</button>
            </div>
        </>
    )
}