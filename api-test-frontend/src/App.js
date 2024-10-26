import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'https://ideanest-backend.vercel.app/api';

function App() {
  const [authToken, setAuthToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ message: '', type: '' });
  const [organizations, setOrganizations] = useState([]);
  const [isSignUp, setIsSignUp] = useState(false);
  const [formState, setFormState] = useState({
    email: '',
    password: '',
    orgName: '',
    orgDescription: '',
    updateOrgId: '',
    updateOrgName: '',
    updateOrgDescription: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const showError = (message) => setFeedback({ message, type: 'error' });
  const showSuccess = (message) => setFeedback({ message, type: 'success' });

  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp);
    setFeedback({});
    setFormState({ email: '', password: '' });
  };

  const handleAuth = async () => {
    setLoading(true);
    setFeedback({});
    try {
      const endpoint = isSignUp ? '/auth/signup' : '/auth/signin';
      const response = await axios.post(`${API_URL}${endpoint}`, {
        email: formState.email,
        password: formState.password,
      });
      setAuthToken(response.data.access_token);
      showSuccess(isSignUp ? 'Signed up successfully!' : 'Signed in successfully!');
    } catch (error) {
      showError(error.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrganizations = async () => {
    setLoading(true);
    setFeedback({});
    try {
      const response = await axios.get(`${API_URL}/organization`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setOrganizations(response.data.organizations || []);
    } catch (error) {
      showError(error.response?.data?.message || 'Error fetching organizations');
    } finally {
      setLoading(false);
    }
  };

  const createOrganization = async () => {
    setLoading(true);
    setFeedback({});
    try {
      const response = await axios.post(
        `${API_URL}/organization`,
        { name: formState.orgName, description: formState.orgDescription || 'A new organization' },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      showSuccess('Organization created successfully!');
      fetchOrganizations();
    } catch (error) {
      showError(error.response?.data?.message || 'Error creating organization');
    } finally {
      setLoading(false);
    }
  };

  const updateOrganization = async () => {
    setLoading(true);
    setFeedback({});
    try {
      const response = await axios.put(
        `${API_URL}/organization/${formState.updateOrgId}`,
        { name: formState.updateOrgName, description: formState.updateOrgDescription },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      showSuccess('Organization updated successfully!');
      fetchOrganizations();
    } catch (error) {
      showError(error.response?.data?.message || 'Error updating organization');
    } finally {
      setLoading(false);
    }
  };

  const deleteOrganization = async (id) => {
    setLoading(true);
    setFeedback({});
    try {
      await axios.delete(`${API_URL}/organization/${id}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      showSuccess('Organization deleted successfully!');
      fetchOrganizations();
    } catch (error) {
      showError(error.response?.data?.message || 'Error deleting organization');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authToken) fetchOrganizations();
  }, [authToken]);

  return (
    <div className="App">
      <h1>Organization Management</h1>
      {feedback.message && <div className={`feedback ${feedback.type}`}>{feedback.message}</div>}
      {loading && <div className="loading">Loading...</div>}

      {!authToken ? (
        <div className="auth-container">
          <h2>{isSignUp ? 'Sign Up' : 'Sign In'}</h2>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formState.email}
            onChange={handleInputChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formState.password}
            onChange={handleInputChange}
          />
          <button onClick={handleAuth} disabled={loading}>
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
          <p onClick={toggleAuthMode} className="toggle-auth">
            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </p>
        </div>
      ) : (
        <div className="dashboard">
          <section>
            <h2>All Organizations</h2>
            {organizations.length > 0 ? (
              organizations.map((org) => (
                <div key={org._id} className="organization">
                  <p><strong>Name:</strong> {org.name}</p>
                  <p><strong>Description:</strong> {org.description}</p>
                  <p><strong>Members:</strong> {org.members?.join(', ') || 'No members'}</p>
                  <button onClick={() => deleteOrganization(org._id)} disabled={loading}>
                    Delete
                  </button>
                </div>
              ))
            ) : (
              <p>No organizations found.</p>
            )}
          </section>

          <section>
            <h2>Create Organization</h2>
            <input
              type="text"
              name="orgName"
              placeholder="Organization Name"
              value={formState.orgName}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="orgDescription"
              placeholder="Description (optional)"
              value={formState.orgDescription}
              onChange={handleInputChange}
            />
            <button onClick={createOrganization} disabled={loading}>
              Create Organization
            </button>
          </section>

          <section>
            <h2>Update Organization</h2>
            <input
              type="text"
              name="updateOrgId"
              placeholder="Organization ID"
              value={formState.updateOrgId}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="updateOrgName"
              placeholder="New Organization Name"
              value={formState.updateOrgName}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="updateOrgDescription"
              placeholder="New Description"
              value={formState.updateOrgDescription}
              onChange={handleInputChange}
            />
            <button onClick={updateOrganization} disabled={loading}>
              Update Organization
            </button>
          </section>
        </div>
      )}
    </div>
  );
}

export default App;
