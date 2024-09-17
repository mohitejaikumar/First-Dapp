import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useEffect, useState } from "react";



export function ShowBalance(){

    const wallet = useWallet();
    const {connection} = useConnection();
    const [balance,setBalance] = useState(0);

    useEffect(()=>{
        if(wallet?.publicKey && connection){
            connection.getBalance(wallet.publicKey).then((balance)=>{
                console.log(balance);
                setBalance(balance/LAMPORTS_PER_SOL);
            })
        }
    },[wallet?.publicKey,connection])


    return (
        <>
            <div style={{marginTop:"10px"}}>
                Sol Balance :
            </div>
            <div>
                {balance} SOL
            </div>
        </>
    )
}