
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';

import {
    WalletModalProvider,
    WalletDisconnectButton,
    WalletMultiButton
} from '@solana/wallet-adapter-react-ui';


// Default styles that can be overridden by your app
import '@solana/wallet-adapter-react-ui/styles.css';
import './App.css'
import { RequestAirdrop } from './RequestAirdrop';
import { ShowBalance } from './ShowBalance';
import { SignMessage } from './SignMessage';
import { SendTokens } from './SendTokens';
import AllTokens from './AllTokens';
import LiquidityPool from './LiquidityPool';


function App() {



  return (
    <>
      <ConnectionProvider endpoint={"https://api.devnet.solana.com"}>
              <WalletProvider wallets={[]} autoConnect>
                  <WalletModalProvider>
                    <div style={{ display: 'flex', justifyContent: "space-between" }}>
                      <WalletMultiButton />
                      <WalletDisconnectButton />
                    </div>
                    {/* <RequestAirdrop/>
                    <ShowBalance />
                    <SignMessage />
                    <SendTokens />
                    <AllTokens /> */}
                    <LiquidityPool />
                  </WalletModalProvider>
              </WalletProvider>
      </ConnectionProvider>
    </>
      
  )
}

export default App
