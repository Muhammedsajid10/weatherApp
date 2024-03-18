import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Form, Button, Card, Navbar, Nav, NavDropdown } from 'react-bootstrap';
import Chart from 'chart.js/auto';
import Swal from 'sweetalert2';
import './WeatherDisplay.css';
import { useNavigate } from 'react-router-dom';

const WeatherDisplay = () => {
    const [locations, setLocations] = useState([]);
    const [city, setCity] = useState('');
    const apiKey = '20c95c576c94e7d3738be657289b55d7';
    const [userId, setUserId] = useState('');
    const [username, setUsername] = useState('')
    const navigate = useNavigate();

    useEffect(() => {
        try {
            const tokenData = localStorage.getItem('futUserInfo');
            if (tokenData) {
                const parsedTokenData = JSON.parse(tokenData);
                setUserId(parsedTokenData.data.userId);
                setUsername(parsedTokenData.data.name);
            }
        } catch (error) {
            console.error('Error parsing token data:', error);

        }
    }, []);



    useEffect(() => {
        locations.forEach(location => {
            const ctx = document.getElementById(`chart-${location.city.replace(/\s+/g, '-')}`);
            if (ctx) {
                if (ctx.chart) {
                    ctx.chart.destroy(); // Destroy the existing chart instance
                }
                const chart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: ['Temperature'],
                        datasets: [{
                            label: 'Temperature (°C)',
                            data: [location.current.main.temp],
                            borderColor: 'rgba(75, 192, 192, 1)',
                            tension: 0.1
                        }]
                    },
                    options: {
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                });
                ctx.chart = chart; // Store the chart instance on the canvas element
            }
        });
    }, [locations]);

    const sendEmailNotification = async (email, subject, text) => {
        try {
            const tokenData = localStorage.getItem('futUserInfo');
            const token = tokenData ? JSON.parse(tokenData).data.token : null;

            if (!token) {
                console.error('Token not found in localStorage');
                return;
            }
            await axios.post('http://localhost:5000/notification/schedule', { email, subject, message: text }, {
                headers: {
                    Authorization: `Bearer ${token}`
                },

            });
            console.log('Email notification scheduled successfully.');
        } catch (error) {
            console.error('Error scheduling email notification:', error);
        }
    };

    const saveLocationToBackend = async (location, userId) => {
        try {
            const tokenData = localStorage.getItem('futUserInfo');
            const token = tokenData ? JSON.parse(tokenData).data.token : null;

            if (!token) {
                console.error('Token not found in localStorage');
                return;
            }

            const currentDate = new Date();
            await axios.post('http://localhost:5000/location/add', {
                userId: userId,
                name: location.city,
                weatherData: {
                    date: currentDate,
                    temperature: location.current.main.temp,
                    condition: location.current.weather[0].description
                }
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            // Send email notification for the saved location
            const email = localStorage.getItem('futUserInfo') ? JSON.parse(localStorage.getItem('futUserInfo')).data.email : '';
            await sendEmailNotification(email, 'Weather Notification', `Weather for ${location.city}: ${location.current.main.temp}°C, ${location.current.weather[0].description}`);

            console.log('Location saved successfully.');
            Swal.fire({
                icon: 'success',
                title: 'Location Saved',
                text: `Weather for ${location.city} has been saved.and also email notifi scheduled`,
                confirmButtonText: 'OK'
            });
        } catch (error) {
            console.error('Error saving location:', error);
        }
    };

    const fetchWeather = async (city) => {
        try {
            const currentWeatherResponse = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
            );

            const forecastResponse = await axios.get(
                `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
            );

            const filteredForecast = forecastResponse.data.list.filter((item) => {
                // Filter out forecast data for the next 5 days
                const forecastDate = new Date(item.dt * 1000);
                const currentDate = new Date();
                const nextFiveDays = new Date(currentDate.setDate(currentDate.getDate() + 5));
                return forecastDate.getDate() <= nextFiveDays.getDate();
            });

            const newLocation = {
                city: currentWeatherResponse.data.name,
                current: currentWeatherResponse.data,
                forecast: filteredForecast
            };

            setLocations([...locations, newLocation]);

        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleCityChange = (e) => {
        setCity(e.target.value);
    };

    const handleAddLocation = () => {
        fetchWeather(city);
        setCity('');
    };

    const handleSaveLocation = async (location) => {
        await saveLocationToBackend(location, userId);
    };

    const handleDetectLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                fetchWeatherByCoords(latitude, longitude);
            }, (error) => {
                console.error('Error getting geolocation:', error);
            });
        } else {
            console.error('Geolocation is not supported by this browser.');
        }
    };

    const fetchWeatherByCoords = async (latitude, longitude) => {
        try {
            const currentWeatherResponse = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
            );

            const forecastResponse = await axios.get(
                `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
            );

            const filteredForecast = forecastResponse.data.list.filter((item) => {
                // Filter out forecast data for the next 5 days
                const forecastDate = new Date(item.dt * 1000);
                const currentDate = new Date();
                const nextFiveDays = new Date(currentDate.setDate(currentDate.getDate() + 5));
                return forecastDate.getDate() <= nextFiveDays.getDate();
            });

            const newLocation = {
                city: currentWeatherResponse.data.name,
                current: currentWeatherResponse.data,
                forecast: filteredForecast
            };

            setLocations([...locations, newLocation]);

        } catch (error) {
            console.error('Error:', error);
        }
    };

    const getIconUrl = (icon) => `http://openweathermap.org/img/w/${icon}.png`;
    const savedLOc = () => {
        navigate('/getLoc');
    };

    const handleLogout = () => {
        // Perform logout actions here
        localStorage.removeItem('futUserInfo');
        // Reset userId state
        setUserId('');
        // Redirect to the login page
        navigate('/login');
    };


    return (
        <Container className="weather-display-container">
            {/* <Navbar bg="dark" variant="dark">
                <Container>
                    <Navbar.Brand href="#home">Weather App</Navbar.Brand>
                    <Nav className="me-auto">
                        <Nav.Link href="#home">Home</Nav.Link>
                        <Nav.Link href="#saved">Saved Locations</Nav.Link>
                    </Nav>
                </Container>
            </Navbar> */}

            <Navbar bg="dark" variant="dark">
                <Container>
                    <Navbar.Brand href="#home">Weather App</Navbar.Brand>
                    <Nav className="me-auto">
                        <Nav.Link href="#home">Home</Nav.Link>
                        <Nav.Link href="/getLoc">Saved Locations</Nav.Link>
                    </Nav>
                    {userId ? (
                        <Nav>
                            <NavDropdown title={`Welcome, ${username}`} id="basic-nav-dropdown">

                                <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    ) : (
                        <Button variant="outline-primary" onClick={() => navigate('/login')}>Account</Button>
                    )}
                </Container>
            </Navbar>





            <h1 className="text-center mt-3 mb-5">Weather Dashboard</h1>
            <div><Button className='savdLoc' onClick={savedLOc}>Saved Location</Button></div>
            <Form>
                <Row className="mb-3">
                    <Col>
                        <Form.Control
                            type="text"
                            placeholder="Can Add Multiple Location"
                            value={city}
                            onChange={handleCityChange}
                        />
                    </Col>
                    <Col xs="auto">
                        <Button onClick={handleAddLocation}>Add Location</Button>
                    </Col>
                    <Col xs="auto">
                        <Button onClick={handleDetectLocation}>Detect Current Location</Button>
                    </Col>
                </Row>
            </Form>
            <Row xs={1} md={3} className="g-4">
                {locations && locations.map((location, index) => (
                    <Col key={index}>
                        <Card className="weather-card">
                            <Card.Body>
                                <Button className='btnn' onClick={() => handleSaveLocation(location)}>Save Location</Button>
                                <Card.Title>{location.city}</Card.Title>
                                <Card.Text>
                                    Temperature: {location.current.main.temp}°C<br />
                                    Weather Description: {location.current.weather[0].description}
                                </Card.Text>
                                <img src={`http://openweathermap.org/img/w/${location.current.weather[0].icon}.png`} alt="Weather Icon" />
                                <div>
                                    <canvas id={`chart-${location.city.replace(/\s+/g, '-')}`} width="400" height="200"></canvas>
                                </div>
                                {location.forecast && (
                                    <div>
                                        <h5 style={{ marginTop: "53px", fontWeight: "bold" }}>5-Day Forecast:</h5>
                                        <Row xs={1} md={1} className="g-4">
                                            {location.forecast.map((forecastItem, index) => (
                                                <Col key={index}>
                                                    <Card className="forecast-card">
                                                        <Card.Body>
                                                            <Card.Text>Date: {new Date(forecastItem.dt * 1000).toLocaleDateString()}</Card.Text>
                                                            <Card.Text>Temperature: {forecastItem.main.temp}°C</Card.Text>
                                                            <Card.Text>Weather Description: {forecastItem.weather[0].description}</Card.Text>
                                                            <img className="forecast-icon" src={getIconUrl(location.current.weather[0].icon)} alt="Weather Icon" />
                                                        </Card.Body>
                                                    </Card>
                                                </Col>
                                            ))}
                                        </Row>
                                    </div>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default WeatherDisplay;
