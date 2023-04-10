import { getSession, signOut } from 'next-auth/react';
import Web3 from 'web3';
import HealthData from "./HealthData.json";
import React, { useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap styles


   
function User({ user }) {
  const [selectedRole, setSelectedRole] = useState(null);

  const handleRoleSelection = (role) => {
    setSelectedRole(role);
    }
    const handleRedirect = () => {
      if (selectedRole === 'patient') {
        window.location.href = '/identity'; // Redirect to patient page
      } else if (selectedRole === 'doctor') {
        window.location.href = '/doctor'; // Redirect to doctor page
      } else {
       alert('no role is chosen');
      }
    }
    return (
        
        <div className="container mt-5">
       
    
    
    <h4 className="mt-4">User session:</h4>
      <pre className="bg-light p-3">{JSON.stringify(user, null, 2)}</pre>
      <h3>Please select your role:</h3>
      <div className="btn-group mt-3" role="group">
        <button
          type="button"
          className={`btn btn-primary ${selectedRole === 'patient' ? 'active' : ''}`}
          onClick={() => handleRoleSelection('patient')}
        >
          Patient
        </button>
        <button
          type="button"
          className={`btn btn-primary ${selectedRole === 'doctor' ? 'active' : ''}`}
          onClick={() => handleRoleSelection('doctor')}
        >
          Doctor
        </button>
      </div>
      <button
        type="button"
        className="btn btn-primary mt-3"
        onClick={handleRedirect}
        disabled={!selectedRole}
      >
        Continue
      </button>
      <br></br>
    

      <button className="btn btn-danger mt-3" onClick={() => signOut({ redirect: '/signin' })}>
        Sign out
      </button>
        </div>
        
    );
}

export async function getServerSideProps(context) {
    const session = await getSession(context);

    if (!session) {
        return {
            redirect: {
                destination: '/signin',
                permanent: false,
            },
        };
    }

    return {
        props: { user: session.user },
    };
}

export default User;