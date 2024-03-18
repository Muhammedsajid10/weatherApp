import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
const Login = ({ setUserInfo, userInfo }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const validateForm = () => {
        if (email.trim() === '' || password.trim() === '') {
            setError('All fields are required...');
            return false;
        }
        return true;
    }

    const logData = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        try {
            const response = await axios.post('http://localhost:5000/auth/login', { email, password });
            console.log("postData : ", response.data);
            setUserInfo(response.data);
            if (userInfo) {
                navigate('/weather');
            }
        } catch (error) {
            console.log('error on while posting data..');
            setError('Login failed. Please check your credentials and try again.');
        }
    }

    return (
        <div className="container contLog">
            <h1 className='LogHd'>Login page</h1>
            {error && <div className='error-message'>{error}</div>}
            <div className="form-wrapper">
                <Form onSubmit={logData}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" placeholder="Enter email" value={email} onChange={(e) => { setEmail(e.target.value); setError('') }} />
                        <Form.Text className="text-muted">
                            We'll never share your email with anyone else.
                        </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => { setPassword(e.target.value); setError('') }} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicCheckbox">
                        <Form.Check type="checkbox" label="Check me out" />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>
                <div className="login-link">
                    Don't have an account? <Link to="/">Sinpup now</Link>
                </div>
            </div>
        </div>
    )
}

export default Login;

