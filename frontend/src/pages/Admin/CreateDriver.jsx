import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const CreateDriver = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { token } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const res = await axios.post(
                'http://localhost:3000/api/auth/create-driver',
                { name, email },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setSuccess(`Driver created successfully! Email sent to ${res.data.email}`);
            setName('');
            setEmail('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create driver');
        }
    };

    return (
        <div className="card">
            <h2>Create Driver Account</h2>
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message" style={{ color: 'green', marginBottom: '1rem' }}>{success}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Driver Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label>Driver Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="form-control"
                    />
                </div>
                <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }}>
                    Create Driver
                </button>
            </form>
        </div>
    );
};

export default CreateDriver;
