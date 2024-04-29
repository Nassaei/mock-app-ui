import './Account.css';
import React, { useState, useEffect  } from 'react';
import { useLocation } from 'react-router-dom';

export default function Dashboard() {
    const location = useLocation();
    const [customerId, setCustomerId] = useState('');
    useEffect(() => {
        setCustomerId(location.state && location.state.customerId);
    }, [location.state]);

    // / State variables for storing user data
    const [errorMessage, setErrorMessage] = useState('');
    const [customer, setCustomer] = useState(null);
    const [account, setAccount] = useState(null);

    // Function to format account balance as currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-MY', { style: 'currency', currency: 'MYR' }).format(amount);
    };

    const handleCustomerInquiry = (event) => {
        event.preventDefault();
        // Submit form
        const formData = { customerId };
        fetch('http://localhost:8080/mockapp/customerInquiry', {
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
                    alert('Error to get customer details.');
                }
            })
            .then(data => {
                setAccount(false);
                setCustomer(data);               
            })
            .catch((error) => {
                console.error('Error enquire user:', error);
                setErrorMessage('Error enquire user');
            });
    };

    const handleAccountInquiry = (event) => {
        event.preventDefault();
        // Submit form
        const formData = { customerId };
        fetch('http://mock.app.com:8080/mockapp/accountInquiry', {
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
                    alert('Error to get account details.');
                }
            })
            .then(data => {
                setCustomer(false);
                setAccount(data);               
            })
            .catch((error) => {
                console.error('Error enquire account:', error);
                setErrorMessage('Error enquire account');
            });
    };

    return (
        <form>
            <div className="container">
                <h1>Welcome {customerId}!</h1>
                <div>
                    <button type="submit" className="btn-submit" onClick={handleCustomerInquiry}>Customer Inquiry</button>
                </div>
                <div>
                    <button type="submit" className="btn-submit" onClick={handleAccountInquiry}>Account Inquiry</button>
                </div>
                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                {customer && (
                    <div>
                        <h2>Customer Details</h2>
                        <p><b>Customer ID:</b> {customer.customerId}</p>
                        <p><b>Name:</b> {customer.name}</p>
                        <p><b>IC No:</b> {customer.icNo}</p>
                        <p><b>Address:</b> {customer.address}</p>
                        <p><b>Email:</b> {customer.email}</p>
                        <p><b>Phone No:</b> {customer.phoneNo}</p>
                    </div>
                )}
                {account && (
                    <div>
                        <h2>Account Details</h2>
                        <p><b>Account No:</b> {account.accountNo}</p>
                        <p><b>Account Type:</b> {account.accountType}</p>
                        <p><b>Status:</b> {account.status}</p>
                        <p><b>Balance:</b> {formatCurrency(account.accountBalance)}</p>
                    </div>
                )}
            </div>
        </form>
    );
}
