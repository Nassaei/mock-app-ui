import './Customer.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import bcrypt from 'bcryptjs';

export default function Customer() {
    // State variables for storing user data
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [icNo, setIcNo] = useState('');
    const [address, setAddress] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNo, setPhoneNo] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [customerId, setCustomerId] = useState('');
    const navigate = useNavigate();

    // Event handlers for input changes and validations
    const handleFirstNameChange = (event) => {
        const value = event.target.value;
        // Validate name: Only allow alphabets, spaces, and hyphens
        if (/^[a-zA-Z\s-]*$/.test(value)) {
            setFirstName(value);
        } else {
            setErrorMessage('Name must not contain special characters');
        }
    };

    const handleLastNameChange = (event) => {
        const value = event.target.value;
        // Validate name: Only allow alphabets, spaces, and hyphens
        if (/^[a-zA-Z\s-]*$/.test(value)) {
            setLastName(value);
        } else {
            setErrorMessage('Name must not contain special characters');
        }
    };

    const handleIcNoChange = (event) => {
        const value = event.target.value;
        // Validate input: Only allow numbers and length <= 12
        if (/^\d{0,12}$/.test(value)) {
            setIcNo(value);
            setErrorMessage(''); // Clear any previous error message
        } else {
            setErrorMessage('Identification Number must be numeric and have at most 12 digits');
        }
    };
    
    const handleAddressChange = (event) => {
        const value = event.target.value;
        // Validate address: Length should not exceed 200 characters
        if (value.length <= 300) {
          setAddress(value);
        } else {
          setErrorMessage('Address must not exceed 200 characters');
        }
    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handlePhoneNoChange = (event) => {
        setPhoneNo(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleConfirmPasswordChange = (event) => {
        setConfirmPassword(event.target.value);
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
    

    // Form submission handler
    const handleSubmit = async (event) => {
        event.preventDefault();
        // Validate form fields
        if (!firstName || !lastName || !icNo || !address || !email || !phoneNo || !password || !confirmPassword) {
            setErrorMessage('Please fill in all fields');
            return;
        }
        if (password !== confirmPassword) {
            setErrorMessage('Passwords do not match');
            return;
        }
        // Validate email format using a regular expression
        if (!/^\S+@\S+\.\S+$/.test(email)) {
            setErrorMessage('Invalid email format');
            return; // Exit early if email is invalid
        }
        // Validate phone number: Only allow numbers and length should be between 10 to 11 digits
        if (!/^\d{10,11}$/.test(phoneNo)) {
            setErrorMessage('Phone number must be between 10 to 11 digits');
            return; // Exit early if phone number is invalid
        }

        try{
            // Hashed password
            const hashedPassword = await hashPassword(password);

            // Send form data to microservice
            const formData = { firstName, lastName, icNo, address, email, phoneNo, password: hashedPassword };

            fetch('http://mock.app.com:8080/mockapp/cutomerRegistration', {
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
            .then((data) => {
                console.log('Registration successful:', data);
                // Set customerId return from response
                setCustomerId(data.customerId);
                // Reset form fields after successful registration
                setFirstName('');
                setLastName('');
                setIcNo('');
                setAddress('');
                setEmail('');
                setPhoneNo('');
                setErrorMessage('');
                // Navigate to the next page
                navigate('/account', { state: { customerId: data.customerId } });
            })
            .catch((error) => {
                console.error('Error registering user:', error);
                setErrorMessage('Error registering user');
            });
        } catch (error) {
            console.error('Error hashing password:', error);
            setErrorMessage('Error hashing password');
        }
    };

    return (
        <form>
            <div className="container">
                <h1>Customer Registration</h1>
                <div className="label-text">
                    <label>First Name</label>
                    <input type="text" value={firstName} onChange={handleFirstNameChange} placeholder="First Name" required />
                </div>
                <div className="label-text">
                    <label>Last Name</label>
                    <input type="text" value={lastName} onChange={handleLastNameChange} placeholder="Last Name" required />
                </div>
                <div className="label-text">
                    <label>Identification Number</label>
                    <input type="text" value={icNo} onChange={handleIcNoChange} placeholder="IC No" required />
                </div>
                <div className="label-text">
                    <label>Address</label>
                    <input type="text" value={address} onChange={handleAddressChange} placeholder="Address" required />
                </div>
                <div className="label-text">
                    <label>Email</label>
                    <input type="email" value={email} onChange={handleEmailChange} placeholder="Email" required />
                    </div>
                <div className="label-text">
                    <label>Phone Number</label>
                    <input type="tel" value={phoneNo} onChange={handlePhoneNoChange} placeholder="Phone No" required />
                </div>
                <div className="label-text">
                    <label>Password</label>
                    <div className="password-content">
                        <input type={passwordVisible ? 'text' : 'password'} className="password-input" value={password} onChange={handlePasswordChange} placeholder="Password" required />
                        <button className="btn-hide" type="button" onClick={togglePasswordVisibility}>{passwordVisible ? 'Hide' : 'Show'}</button>
                    </div>
                </div>
                <div className="label-text">
                    <label>Confirm Password</label>
                    <input type="password" value={confirmPassword} onChange={handleConfirmPasswordChange} placeholder="Confirm Password" required />
                </div>
                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                <div>
                    <button type="submit" className="btn-submit" onClick={handleSubmit}>Submit</button>
                </div>
            </div>
        </form>
    )
}