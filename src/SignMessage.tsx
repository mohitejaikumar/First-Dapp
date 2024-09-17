import { useWallet } from "@solana/wallet-adapter-react";
import { useState } from "react";
import { ed25519 } from '@noble/curves/ed25519';
import bs58 from 'bs58';



export function SignMessage(){

    const { publicKey, signMessage } = useWallet();
    const [message,setMessage] = useState("");
    

    async function onClick(){
        if (!publicKey) throw new Error('Wallet not connected!');
        if (!signMessage) throw new Error('Wallet does not support message signing!');

        // encode message 
        const encodedMessage = new TextEncoder().encode(message);
        const signature = await signMessage(encodedMessage);

        // verify signature
        if(!ed25519.verify(signature,encodedMessage,publicKey.toBytes())){
            throw new Error("Invalid signature");
        }

        alert(`Message signature: ${bs58.encode(signature)}`);
    }

    return (
        <>
            <div style={{marginTop:"10px" , display:"flex", gap:"10px"}}>
                <input type="text" value={message} onChange={(e)=>{setMessage(e.target.value)}}></input>
                <button onClick={onClick}>Sign Message</button>
                
            </div>
        </>
    )
}