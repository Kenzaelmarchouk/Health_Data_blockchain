import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { signIn } from 'next-auth/react';
import { useAccount, useConnect, useSignMessage, useDisconnect } from 'wagmi';
import { useRouter } from 'next/router';

import { useAuthRequestChallengeEvm } from '@moralisweb3/next';
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap styles

function SignIn() {
    const { connectAsync } = useConnect();
    const { disconnectAsync } = useDisconnect();
    const { isConnected } = useAccount();
    const { signMessageAsync } = useSignMessage();
    const { requestChallengeAsync } = useAuthRequestChallengeEvm();
    const { push } = useRouter();

    
    
    
      

    const handleAuth = async () => {
        if (isConnected) {
            await disconnectAsync();
        }

        const { account, chain } = await connectAsync({ connector: new MetaMaskConnector() });

        const { message } = await requestChallengeAsync({ address: account, chainId: chain.id });

        const signature = await signMessageAsync({ message });

        // redirect user after success authentication to '/user' page
        const { url } = await signIn('moralis-auth', { message, signature, redirect: false, callbackUrl: '/user' });
        /**
         * instead of using signIn(..., redirect: "/user")
         * we get the url from callback and push it to the router to avoid page refreshing
         */
        push(url);
    };

    return (
        <div>
             <header className="bg-dark text-white text-center py-5">
      <h1 className="display-4">Health data management </h1>
      <ul className="list-inline">
        <li className="list-inline-item"><a href="/" className="text-white">About</a></li>
        <li className="list-inline-item"><a href="/signin" className="text-white">Login</a></li>
      </ul>
    </header>    
        
    <h3 className="text-center mt-4">Authentication with your wallet</h3>
      <button className="btn btn-primary mx-auto d-block mt-3" onClick={handleAuth}>
        Authenticate via Metamask
      </button>
      
     
        </div>
        
    );
}

export default SignIn;