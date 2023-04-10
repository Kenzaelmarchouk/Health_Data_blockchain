import React, { useState, useEffect } from 'react';
import { getSession, signOut } from 'next-auth/react';
import HealthData from './HealthData.json';
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap styles

import { getAccount } from '@wagmi/core';
import { networks } from '../../truffle-config';
import Web3 from 'web3';


const DoctorPage = () => {

  const providerUrl="http://127.0.0.1:8545";
  
  const [web3, setWeb3] = useState(null);
  const [ad, setpatientAddress]=useState(null);
  //const [patientAddress, setPatientAddress] = useState('');
  const [healthData, setHealthData] = useState('');
  const [healthDataContract, setHealthDataContract] = useState(null);
  
  
  useEffect(() => async () =>{
    const initWeb3 = async () => {
      const web3Instance = new Web3(providerUrl);
      setWeb3(web3Instance);

      
      let provider = window.ethereum;
      if (typeof provider !== 'undefined') {
        try {
          await provider.request({method: 'eth_requestAccounts'});
        } catch (error) {
          console.error('Failed to connect to Ethereum provider:', error);
        }
      }
      const networkId = await web3Instance.eth.net.getId();
    const contractAddress = HealthData.networks[networkId].address;
    const healthDataContractInstance = new web3Instance.eth.Contract(HealthData.abi, contractAddress);
    const accounts = await web3Instance.eth.getAccounts();
    const patientAddress = accounts[0]; 
    setpatientAddress(patientAddress);
    setHealthDataContract(healthDataContractInstance);
    console.log("succed");
      
    }
    initWeb3();
    
    
  }, []);
  const handleViewHealthData = async () => {
    try {
        const result = await healthDataContract.methods.viewPatient(ad).call();
        setHealthData(result);
    }catch (error) {
        console.error('Error:', error);
      }
}
  return(
    <div>
      <header className="bg-dark text-white text-center py-5">
  <h1 className="display-4">Health data management </h1>
  <ul className="list-inline">
    <li className="list-inline-item"><a href="/" className="text-white">About</a></li>
    <li className="list-inline-item"><a href="/signin" className="text-white">Login</a></li>
  </ul>
</header> 
        <h1>View Health Data</h1>
      <input
        type="text"
        placeholder="Enter Patient Address"
        value={ad}
        onChange={(e) => setpatientAddress(e.target.value)}
      />
      <button className="btn btn-primary" onClick={handleViewHealthData}>View Data</button>
      {healthData && (
        <div className="mt-3">
          <h2>Health Data:</h2>
          <p>Name: {healthData[0]}</p>
          <p>BirthDate: {healthData[1]}</p>
          <p>Email: {healthData[3]}</p>
          <p>Tel: {healthData[4]}</p>
        </div>
      )}

    </div>
  )
};
export default DoctorPage;