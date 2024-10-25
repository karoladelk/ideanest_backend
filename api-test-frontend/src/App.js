import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'https://ideanest-backend.vercel.app/api';

function App() {
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signinEmail, setSigninEmail] = useState('');
  const [signinPassword, setSigninPassword] = useState('');
  const [orgName, setOrgName] = useState('');
  const [authToken, setAuthToken] = useState('');

  const signup = async () => {
    try {
      const response = await axios.post(`${API_URL}/auth/signup`, {
        name: 'Test User', // You can customize this
        email: signupEmail,
        password: signupPassword,
      });
      alert(response.data.message);
    } catch (error) {
      alert('Error signing up: ' + error.response?.data?.message);
    }
  };

  const signin = async () => {
    try {
      const response = await axios.post(`${API_URL}/auth/signin`, {
        email: signinEmail,
        password: signinPassword,
      });
      setAuthToken(response.data.access_token);
      alert('Signed in! Access Token: ' + response.data.access_token);
    } catch (error) {
      alert('Error signing in: ' + error.response?.data?.message);
    }
  };

  const createOrganization = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/organization`,
        {
          name: orgName,
          description: 'A new organization', // You can customize this
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      alert('Organization created! ID: ' + response.data.organization_id);
    } catch (error) {
      alert('Error creating organization: ' + error.response?.data?.message);
    }
  };

  return (
    <div className="App">
      <h1>API Test Frontend</h1>

      <h2>Sign Up</h2>
      <input type="email" placeholder="Email" onChange={(e) => setSignupEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={(e) => setSignupPassword(e.target.value)} />
      <button onClick={signup}>Sign Up</button>

      <h2>Sign In</h2>
      <input type="email" placeholder="Email" onChange={(e) => setSigninEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={(e) => setSigninPassword(e.target.value)} />
      <button onClick={signin}>Sign In</button>

      <h2>Create Organization</h2>
      <input type="text" placeholder="Organization Name" onChange={(e) => setOrgName(e.target.value)} />
      <button onClick={createOrganization}>Create Organization</button>
    </div>
  );
}

export default App;
