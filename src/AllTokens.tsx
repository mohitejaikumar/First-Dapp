import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { createAssociatedTokenAccountInstruction, createTransferInstruction, getAccount, getAssociatedTokenAddress} from "@solana/spl-token";
import { useCallback, useEffect, useState } from "react";
import { LAMPORTS_PER_SOL, PublicKey, Transaction, TransactionInstruction } from "@solana/web3.js";
import { Metaplex } from "@metaplex-foundation/js";
import { ENV, TokenListProvider } from "@solana/spl-token-registry";

interface TokenAccountType{
    mint_address:PublicKey,
    amount:bigint,
    tokenName?:string,
    tokenSymbol?:string,
    tokenLogo?:string
}


export default function AllTokens(){

    const {connection} = useConnection();
    const wallet = useWallet();
    const [allTokens , setAllTokens] = useState<TokenAccountType[]>([]);
    const [destination,setDestination] = useState("");
    const [amount,setAmount] = useState("");
    


    const getMetadata = useCallback(async (mint_address:string)=>{
        let tokenName:string = "";
        let tokenSymbol:string = "";    
        let tokenLogo:string|undefined = "";
        if(connection){
            const metaplex = Metaplex.make(connection);
            const mintAddress = new PublicKey(mint_address);
            const metadataAccount = metaplex
            .nfts()
            .pdas()
            .metadata({ mint: mintAddress });
            const metadataAccountInfo = await connection.getAccountInfo(metadataAccount);

            if (metadataAccountInfo) {
                const token = await metaplex.nfts().findByMint({ mintAddress: mintAddress });
                tokenName = token.name;
                tokenSymbol = token.symbol;
                tokenLogo = token.json?.image;
                alert('Follow Token22 Standard');
            }
            else {
                const provider = await new TokenListProvider().resolve();
                const tokenList = provider.filterByChainId(ENV.MainnetBeta).getList();
                console.log(tokenList)
                const tokenMap = tokenList.reduce((map, item) => {
                map.set(item.address, item);
                return map;
                }, new Map());

                const token = tokenMap.get(mintAddress);
                console.log("token" , token);
                tokenName = "";
                tokenSymbol = "";
                tokenLogo = "";
                alert('Follow Solana Labs Token List');
            }
        }

        return {tokenName,tokenSymbol,tokenLogo};
    },[connection])



    useEffect(()=>{

        async function getAllTokens(){
            const tokens:TokenAccountType[] = [];
            if(wallet?.publicKey && connection){
                const tokenAccounts = await connection.getParsedTokenAccountsByOwner(wallet.publicKey,{programId:new PublicKey('TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb')});
                console.log(tokenAccounts);
                tokenAccounts.value.forEach((tokenAccount)=>{
                    
                    tokens.push({
                        mint_address:new PublicKey(tokenAccount.account.data.parsed.info.mint),
                        amount:tokenAccount.account.data.parsed.info.tokenAmount.amount,
                        ...getMetadata(tokenAccount.account.data.parsed.info.mint)
                    })
                })
            
            }
            setAllTokens(()=>tokens);
        }
        getAllTokens();
    },[wallet?.publicKey,connection , getMetadata])



    async function transferTokens(mint_address:string){
        
        if(wallet?.publicKey && connection){
            // get ATA of payer 
            // get ATA of destination
            // if not exist , create instruction to create it over connection 
            // pass instruction to transaction object 
            // get recent blochash 
            // sign transcation passing that blockhash 
            // send it over connection 
            // confirm transaction 
            console.log(mint_address , destination , amount);
            const transactionInstructions: TransactionInstruction[] = [];
            const associatedTokenFrom = await getAssociatedTokenAddress(
                new PublicKey(mint_address),
                wallet.publicKey
            );
            const fromAccount = await getAccount(connection, associatedTokenFrom);
            const associatedTokenTo = await getAssociatedTokenAddress(
                new PublicKey(mint_address),
                new PublicKey(destination)
            );
            console.log('fromAccount' , fromAccount);
            if (!(await connection.getAccountInfo(associatedTokenTo))) {
                transactionInstructions.push(
                    createAssociatedTokenAccountInstruction(
                        wallet.publicKey,
                        associatedTokenTo,
                        new PublicKey(destination),
                        new PublicKey(mint_address)
                    )
                );
            }
            transactionInstructions.push(
                createTransferInstruction(
                fromAccount.address, // source
                associatedTokenTo, // dest
                wallet.publicKey, // payer
                Number(amount)*LAMPORTS_PER_SOL
                )
            );

            const transaction = new Transaction().add(...transactionInstructions);

            // sign Transaction steps 
            const blockHash = await connection.getLatestBlockhash();
            transaction.feePayer = wallet.publicKey;
            transaction.recentBlockhash = blockHash.blockhash;
            //@ts-ignore
            const signed = await wallet.signTransaction(transaction);
            

            const signature = await connection.sendRawTransaction(signed.serialize());
            alert(`Transaction signature: ${signature}`);
            await connection.confirmTransaction({
                blockhash: blockHash.blockhash,
                lastValidBlockHeight: blockHash.lastValidBlockHeight,
                signature
            });
            alert(`Transaction confirmed`);
        }
    }




    return (
        <>
            <div style={{marginTop:"10px"}}>
                SPL Tokens
            </div>
            <div>
                { allTokens && allTokens.map((token,index)=>{
                        return (
                            <>  
                                <div key={index}>
                                    <div>
                                        Mint Address : {token.mint_address.toString()}
                                    </div>
                                    <div>
                                        Amount : {Number((token.amount).toString())/LAMPORTS_PER_SOL}
                                    </div>
                                    <div>
                                        Name : {token.tokenName}
                                    </div>
                                    <div>
                                        Symbol : {token.tokenSymbol}
                                    </div>
                                    <div>
                                        Logo : {token.tokenLogo}
                                    </div>
                                    <div>
                                        <input type="text" placeholder="Destination" onChange={(e)=>{setDestination(e.target.value)}}></input>
                                        <input type="text" placeholder="Amount" onChange={(e)=>{setAmount(e.target.value)}}></input>
                                        <button onClick={()=>{transferTokens(token.mint_address.toString())}}>Send Tokens</button>
                                    </div>
                                </div>
                            </>
                        )
                    })
                }
            </div>
            
        </>
    )
}