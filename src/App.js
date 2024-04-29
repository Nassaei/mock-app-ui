import logo from './logo.svg';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Customer from './Customer';
import Account from './Account';
import SuccessRegister from './SuccessRegister';
import Login from './Login';
import Dashboard from './Dashboard';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Customer />} />
        <Route path="/account" element={<Account />} />
        <Route path="/registered" element={<SuccessRegister />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
