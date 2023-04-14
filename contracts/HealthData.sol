// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;


contract HealthData {
    address public owner;
    
    struct Patient {
        address patientAddress;
        string name;
        uint256 birthDate;
        string homeaddress;
        string email;
        string telephone;
        bool created;
        mapping(address => bool) authorizedDoctors;
        HealthRecord[] healthRecords;
    }
    
    struct HealthRecord {
        uint256 healthRecordId;    
        string treatmentHash;
        address doctorAddress;
    }
    
    mapping(address => Patient) public patients;
    
    event PatientCreated(address indexed patientAddress, string name, uint256 birthDate, string homeaddress, string email, string telephone);
    event HealthRecordCreated(address indexed patientAddress, address indexed doctorAddress, uint256 indexed healthRecordId, string treatmentHash);
    event AuthorizationRequested(address indexed patientAddress, address indexed doctorAddress);
    event AuthorizationApproved(address indexed patientAddress, address indexed doctorAddress);
    event AuthorizationRevoked(address indexed patientAddress, address indexed doctorAddress);
    
    function createPatient(string memory _name, uint256 _birthdate, string memory _homeaddress, string memory _email, string memory _telephone) public {
        // Ensure that the patient has not already created their identity
        require(patients[msg.sender].created == false, "Patient identity already exists");

        // Create the patient identity
        Patient storage patient = patients[msg.sender];
        patient.patientAddress = msg.sender;
        patient.name = _name;
        patient.birthDate = _birthdate;
        patient.homeaddress = _homeaddress;
        patient.email = _email;
        patient.telephone = _telephone;
        patient.created = true;
        
        // Emit an event to signal that a new patient has been created
        emit PatientCreated(msg.sender, _name, _birthdate, _homeaddress, _email, _telephone);
    }

    function createHealthRecord(address _patientAddress, uint256 _healthRecordId, string memory _treatmentHash, address _sender) public {
        require(patients[_patientAddress].created, "The patient is not registered");
        require(patients[_patientAddress].authorizedDoctors[_sender], "You are not an authorized doctor");
        
        _healthRecordId = patients[_patientAddress].healthRecords.length + 1;
        HealthRecord memory healthRecord = HealthRecord(_healthRecordId, _treatmentHash, _sender);
        patients[_patientAddress].healthRecords.push(healthRecord);
        
        emit HealthRecordCreated(_patientAddress, _sender, _healthRecordId, _treatmentHash);
    }

    function viewPatientData(address _patientAddress, address _sender) public view returns (string memory, uint256, string memory, string memory, string memory, HealthRecord[] memory) {
        Patient storage patient = patients[_patientAddress];
        require(patient.created, "Patient does not exist");
        require(patient.authorizedDoctors[_sender], "Doctor is not authorized to view patient data");

        return (patient.name, patient.birthDate, patient.homeaddress, patient.email, patient.telephone, patient.healthRecords);
    }

    function requestAuthorization(address _patientAddress) public {
        require(patients[_patientAddress].created, "Patient does not exist");
        require(!patients[_patientAddress].authorizedDoctors[msg.sender], "Doctor is already authorized");
        // Update the authorizedDoctors mapping
    patients[_patientAddress].authorizedDoctors[msg.sender] = false;

        emit AuthorizationRequested(_patientAddress, msg.sender);
    }

     function sendAuthorizationRequest(address _patientAddress, address _doctorAddress) public {
        require(patients[_patientAddress].created, "Patient does not exist");
        require(patients[_patientAddress].patientAddress == msg.sender, "Only patient can send authorization request");

        // Add doctor to authorized doctors mapping
        patients[_patientAddress].authorizedDoctors[_doctorAddress] = true;

        // Emit an event to signal that an authorization request has been sent
        emit AuthorizationApproved(_patientAddress, _doctorAddress);
    }
    function revokeAuthorization(address _patientAddress, address _doctorAddress) public {
    require(patients[_patientAddress].created, "Patient does not exist");
    require(patients[_patientAddress].authorizedDoctors[_doctorAddress], "Doctor is not authorized");

    // Update the authorizedDoctors mapping
    patients[_patientAddress].authorizedDoctors[_doctorAddress] = false;

    emit AuthorizationRevoked(_patientAddress, _doctorAddress);
}
    }    