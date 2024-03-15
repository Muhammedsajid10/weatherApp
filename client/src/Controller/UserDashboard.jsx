import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './UserDashboard.css';

const UserDashboard = () => {
    const [text, setText] = useState("");
    const [username, setUsername] = useState("");

    const Dash = async () => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('futUserInfo'));
            console.log('dashUserIn : ', userInfo);
            const token = userInfo.data.token;
            const name = userInfo.data.name;
            const response = await axios.get('http://localhost:5000/dash', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('dashboard : ', response.data);
            setText(response.data);
            setUsername(name);
        } catch (error) {
            console.log('error on loading dashboard');
        }
    };

    useEffect(() => {
        Dash();
    }, []);

    return (
        <div className="container">
            <h1 className="username">User Name: {username}</h1>
            <h3 className="text">{text}</h3>
        </div>
    );
};

export default UserDashboard;