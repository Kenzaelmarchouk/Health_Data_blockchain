import React, { useState, useEffect } from 'react';
import { getSession, signOut } from 'next-auth/react';
import healthData from './HealthData.json';
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap styles

import { getAccount } from '@wagmi/core';
import { networks } from '../../truffle-config';
import Web3 from 'web3';


const IdentityPage = () => {

  const providerUrl="http://127.0.0.1:8545";
  
  const [web3, setWeb3] = useState(null);
  const [Data, setData] = useState({});
  const [healthDataContract, setHealthDataContract] = useState(null);
  const [ad, setpatientAddress]=useState(null);
  const [patientData, setPatientData] = useState({
    name: '',
    birthDate: '',
    homeAddress: '',
    email: '',
    telephone: ''
  });
  useEffect(() =>  () =>{
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
    const contractAddress = healthData.networks[networkId].address;
    const healthDataContractInstance = new web3Instance.eth.Contract(healthData.abi, contractAddress);
    const accounts = await web3Instance.eth.getAccounts();
    const patientAddress = accounts[0]; 
    setpatientAddress(patientAddress);
    setHealthDataContract(healthDataContractInstance);
    console.log("succed");
      
    }
    initWeb3();
    
    
  }, []);
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setPatientData({ ...patientData, [name]: value });
  };
  
  const createPatient = async () => {
    console.log("move to");
    

    
      try {
        const { name, birthDate, homeAddress, email, telephone } = patientData;
        await healthDataContract.methods.createPatient(name, birthDate, homeAddress, email, telephone).send({ from: ad ,gas: 600000});
        console.log('Patient created successfully');
        // TODO: Show success message or redirect to another page
      } catch (error) {
       console.error('Failed to create patient:', error);
        // TODO: Show error message
      }
    

    
  };
  const viewPatient = async () => {
    try {
      // Call the viewPatient function on the healthDataContract contract
      const data = await healthDataContract.methods.viewPatient(ad).call();
      console.log('Patient data:', data);
      setData({
        
        name: data[0],
        birthDate: data[1],
        homeAddress: data[2],
        email: data.email[3],
        telephone: data[4]
      });
      
    } catch (error) {
      console.error('Failed to view patient:', error);
      // TODO: Show error message
    }
  };
  const handleFormSubmit = (event) => {
    event.preventDefault(); // prevent form submission
    createPatient(); // invoke createPatient function
  };
  

 return (
  
  <div className="container mt-5">
    <header className="bg-dark text-white text-center py-5">
  <h1 className="display-4">Health data management </h1>
  <ul className="list-inline">
    <li className="list-inline-item"><a href="/" className="text-white">About</a></li>
    <li className="list-inline-item"><a href="/signin" className="text-white">Login</a></li>
  </ul>
</header> 
    <h2>Create Patient</h2>
      <form >
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={patientData.name}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="birthDate">Birth Date</label>
          <input
            type="text"
            className="form-control"
            id="birthDate"
            name="birthDate"
            value={patientData.birthDate}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="homeAddress">Home Address</label>
          <input
            type="text"
            className="form-control"
            id="homeAddress"
            name="homeAddress"
            value={patientData.homeAddress}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="text"
            className="form-control"
            id="email"
            name="email"
            value={patientData.email}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="telephone">Telephone</label>
          <input
            type="text"
            className="form-control"
            id="telephone"
            name="telephone"
            value={patientData.telephone}
            onChange={handleInputChange}
          />
        </div>
        <button className="btn btn-primary" id="createPatientBtn" onClick={handleFormSubmit}>Create Patient</button>

        
      </form>
      <br></br>
      <h2>View Data</h2>
      <button className="btn btn-primary" onClick={viewPatient}>View Patient</button>
      {Data && (
  <div>
    <h1>Patient Data</h1>
    <p>Name: {Data.name}</p>
    <p>Birth Date: {Data.birthDate}</p>
    <p>Home Address: {Data.homeAddress}</p>
    <p>Email: {Data.email}</p>
    <p>Telephone: {Data.telephone}</p>
  </div>
)}
      
        

  </div>
 )
};
export default IdentityPage;