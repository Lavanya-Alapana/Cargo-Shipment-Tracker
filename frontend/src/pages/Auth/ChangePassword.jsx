import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const ChangePassword = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const { token, logout } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (newPassword !== confirmPassword) {
            setError('New passwords do not match');
            return;
        }

        try {
            await axios.post(
                'http://localhost:3000/api/auth/change-password',
                { currentPassword, newPassword },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setMessage('Password changed successfully. Please login with new password.');
            setTimeout(() => {
                logout();
                navigate('/login');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to change password');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Change Password</h2>
                <p style={{ marginBottom: '1rem', color: '#666' }}>
                    For security, you must change your password on first login.
                </p>
                {error && <div className="error-message">{error}</div>}
                {message && <div className="success-message" style={{ color: 'green', marginBottom: '1rem' }}>{message}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Current (Temporary) Password</label>
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>New Password</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Confirm New Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn-primary">Change Password</button>
                </form>
            </div>
        </div>
    );
};

export default ChangePassword;
