import React, { useState } from "react";
import { getWeb3 } from "./utils/web3Utils"; // Utilitaire pour se connecter à Web3
import HealthDataContract from "./HealthData.json"; // Contrat HealthData

const PatientForm = () => {
  // États pour les champs du formulaire
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [homeAddress, setHomeAddress] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Connexion à Web3
    const web3 = await getWeb3();
    const accounts = await web3.eth.getAccounts();
    const networkId = await web3.eth.net.getId();
    const deployedNetwork = HealthDataContract.networks[networkId];
    const healthDataContractInstance = new web3.eth.Contract(
      HealthDataContract.abi,
      deployedNetwork && deployedNetwork.address
    );

    // Appeler la fonction createPatient du contrat HealthData
    await healthDataContractInstance.methods
      .createPatient(name, birthDate, homeAddress, email, telephone)
      .send({ from: accounts[0] })
      .on("receipt", (receipt) => {
        // La transaction a été réussie, vous pouvez vérifier les données créées ici
        console.log("Receipt:", receipt);
        // Vous pouvez également émettre un événement ou mettre à jour l'interface utilisateur pour indiquer que les données ont été créées avec succès.
      })
      .on("error", (error) => {
        // La transaction a échoué, vous pouvez gérer les erreurs ici
        console.error("Error:", error);
      });

    // Réinitialiser les champs du formulaire après la soumission
    setName("");
    setBirthDate("");
    setHomeAddress("");
    setEmail("");
    setTelephone("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="Nom"
      />
      <input
        type="text"
        value={birthDate}
        onChange={(event) => setBirthDate(event.target.value)}
        placeholder="Date de naissance"
      />
      <input
        type="text"
        value={homeAddress}
        onChange={(event) => setHomeAddress(event.target.value)}
        placeholder="Adresse domicile"
      />
      <input
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="Email"
      />
      <input
        type="tel"
        value={telephone}
        onChange={(event) => setTelephone(event.target.value)}
        placeholder="Téléphone"
      />
      <button type="submit">Créer le patient</button>
    </form>
  );
};

export default PatientForm;
