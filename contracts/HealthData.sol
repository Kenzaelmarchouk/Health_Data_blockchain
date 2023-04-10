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
        //HealthRecord[] HealthRecords;

    }
    struct HealthRecord {
    uint256 healthRecordId;    
    uint256 height;             // height in centimeters
    uint256 weight;             // weight in kilograms
    string bloodType;           // blood type
    string treatmentHash;
    address doctorAddress;
}
 struct Doctor {
        address doctorAddress;
        string name;
        string hospital;
        bool authorized;
    }
mapping(address => Patient) public patients;
mapping(address => HealthRecord[]) public healthRecords;
mapping(address => Doctor) public doctors;

event PatientCreated(address indexed patientAddress, string name, uint256 birthDate, string homeaddress, string email, string telephone);
function createPatient(string memory _name, uint256 _birthdate, string memory _homeaddress, string memory _email, string memory _telephone) public {
    // Ensure that the patient has not already created their identity
    require(patients[msg.sender].created == false, "Patient identity already exists");

    // Create the patient identity
    Patient storage patient = patients[msg.sender];
    patient.name = _name;
    patient.birthDate = _birthdate;
    patient.homeaddress = _homeaddress;
    patient.email = _email;
    patient.telephone = _telephone;
    patient.created = true;
        // Emit an event to signal that a new patient has been created
        emit PatientCreated(msg.sender, _name, _birthdate, _homeaddress, _email, _telephone);
    }


/////////////// HealthRecord ///////////
event HealthRecordCreated(address indexed patientAddress, address indexed doctorAddress ,uint256 indexed healthRecordId, uint256 height, uint256 weight, string bloodType, string treatmentHash);
function createHealthRecord(address _patientAddress, uint256 _healthRecordId, uint256 _height, uint256 _weight, string memory _bloodType, string memory _treatmentHash) public {
    require(doctors[msg.sender].authorized, "You are not an authorized doctor");
    // Make sure the patient has an identity created
    //require(patients[msg.sender].created == true, "Patient identity not found");
    require(patients[_patientAddress].created, "The patient is not registered");
        _healthRecordId = healthRecords[_patientAddress].length + 1;
        HealthRecord memory healthRecord = HealthRecord(_healthRecordId, _height, _weight, _bloodType, _treatmentHash, msg.sender);
        healthRecords[_patientAddress].push(healthRecord);
        emit HealthRecordCreated(_patientAddress, msg.sender, _healthRecordId, _height, _weight, _bloodType, _treatmentHash);
    
}
function createDoctor(string memory _name, string memory _hospital) public {
        require(!doctors[msg.sender].authorized, "Doctor already exists");
        doctors[msg.sender] = Doctor(msg.sender, _name, _hospital, true);
    }
////////////// authorized dactors and revok
 function authorizeDoctor(address _doctorAddress) public {
        require(doctors[msg.sender].authorized, "You are not an authorized doctor");
        doctors[_doctorAddress].authorized = true;
    }

    function revokeDoctor(address _doctorAddress) public {
        require(doctors[msg.sender].authorized, "You are not an authorized doctor");
        doctors[_doctorAddress].authorized = false;
    }    
/////////////////View HealthData
function viewPatient(address patientAddress) public view returns (string memory, uint256, string memory, string memory, string memory, HealthRecord[] memory) {
    require(patients[patientAddress].created == true, "Patient does not exist");
    return (patients[patientAddress].name, patients[patientAddress].birthDate, patients[patientAddress].homeaddress, patients[patientAddress].email, patients[patientAddress].telephone, healthRecords[patientAddress]);
}

function getDoctorRecords(address _patientAddress) public view returns (HealthRecord[] memory) {
        require(doctors[msg.sender].authorized, "You are not an authorized doctor");
        require(patients[_patientAddress].created, "Patient does not exist");
        return healthRecords[_patientAddress];
    }

}
