// Login.js
import React, { useState, useEffect  } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import bcrypt from 'bcryptjs';

const Login = () => {
    const [customerId, setCustomerId] = useState('');
    const [password, setPassword] = useState('');
    const [customer, setCustomer] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const navigate = useNavigate();

    // Event handlers for input changes and validations
    const handleCustomerIdChange = (event) => {
        const value = event.target.value;
        // Validate name: Only allow alphabets, spaces, and hyphens
        if (/^[a-zA-Z\s-]*$/.test(value)) {
            setCustomerId(value);
        } else {
            setErrorMessage('CustomerId must not contain special characters');
        }
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    // Toggle password visibility
    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    // Hash password function
    const hashPassword = async (password) => {
        const saltRounds = 10; // Number of salt rounds for bcrypt
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    };

    const handleLogin = async (event) => {
        event.preventDefault();

        // Hash the password
        const hashedPassword = await hashPassword(password);

        // Send login request to microservice
        const formData = { customerId, password: hashedPassword };
        fetch('http://mock.app.com:8080/loginPage', {
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
                throw response.status;
            }
        })
        .then(data => {
            // Set the customer object return from response
            setCustomer(data); 
            bcrypt.compare(password, data.password, function(err , isMatch) {
                if(err) {
                    throw err;
                } else if(!isMatch) {
                    alert('Invalid Password!');
                } else {
                    navigate('/dashboard', { state: { customerId: data.customerId } });
                }
            }
            );
            
        })
        .catch((error) => {
            console.error('Error logging in:', error);
            alert('Error logging in. Please try again later.');
        });
    };

    return (
        <form>
            <div className="container">
                <h1>Login</h1>
                <div className="label-text">
                    <label>Customer Id</label>
                    <input type="text" value={customerId} onChange={handleCustomerIdChange} placeholder="First Name" required />
                </div>
                <div className="label-text">
                    <label>Password</label>
                    <div className="password-content">
                        <input type={passwordVisible ? 'text' : 'password'} className="password-input" value={password} onChange={handlePasswordChange} placeholder="Password" required />
                        <button className="btn-hide" type="button" onClick={togglePasswordVisibility}>{passwordVisible ? 'Hide' : 'Show'}</button>
                    </div>
                </div>
                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                <div>
                    <button type="submit" className="btn-submit" onClick={handleLogin}>Login</button>
                </div>
            </div>
        </form>
    );
};

export default Login;
