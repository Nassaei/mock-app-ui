import './SuccessRegister.css';
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Account() {
    const location = useLocation();
    const customerId = location.state && location.state.customerId;
    const accountNo = location.state && location.state.accountNo;
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    
    const handleLogin = (event) => {
        event.preventDefault();
        navigate('/login');
    };
    return (
        <form>
            <div className="container">
                <h4>Account Number {accountNo} has been successfully created for user {customerId}</h4>
                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                <div>
                    <button type="submit" className="btn-submit" onClick={handleLogin}>Login</button>
                </div>
            </div>
        </form>
    );
}
