import './Account.css';
import React, { useState, useEffect  } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Account() {
    const location = useLocation();
    const [customerId, setCustomerId] = useState('');
    useEffect(() => {
        setCustomerId(location.state && location.state.customerId);
    }, [location.state]);
    // / State variables for storing user data
    const [accountType, setAccountType] = useState('');
    const [accountNo, setAccountNo] = useState('');
    const [accountStatus, setAccountStatus] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    // To set accountType value on change
    const handleAccountTypeChange = (event) => {
        setAccountType(event.target.value);
    };
    
    const handleSubmit = (event) => {
        event.preventDefault();
        // Validate form fields
        if (!accountType) {
            setErrorMessage('Please select an Account Type');
            return;
        }
        // Submit form
        const formData = { customerId, accountType };
        fetch('http://mock.app.com:8080/mockapp/accountCreation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    alert('Unable to create account.');
                }
            })
            .then((data) => {
                console.log('Account registration successful:', data);
                setAccountNo(data.accountNo);
                // Reset form fields after successful registration
                setAccountType('');
                setErrorMessage('');
                // Navigate to the next page
                navigate('/registered', { state: { customerId: data.customerId, accountNo: data.accountNo } });
            })
            .catch((error) => {
                console.error('Error registering account:', error);
                setErrorMessage('Error registering account');
            });
    };
    return (
        <form>
            <div className="container">
                <h1>Account Creation</h1>
                <div className="label-text">
                    <label>Customer Id</label>
                    <input type="text" value={customerId} readOnly />
                </div>
                <div className="label-text">
                    <label>Account Type</label>
                    <select value={accountType} onChange={handleAccountTypeChange} required>
                        <option value="">Select Account Type</option>
                        <option value="Current">Current</option>
                        <option value="Savings">Savings</option>
                    </select>
                </div>
                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                <div>
                    <button type="submit" className="btn-submit" onClick={handleSubmit}>Submit</button>
                </div>
            </div>
        </form>
    );
}
