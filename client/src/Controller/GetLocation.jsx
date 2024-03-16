import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Card, Container, Row, Col } from 'react-bootstrap';
import WeatherGraph from './WeatherGraph'; 
import './GetLocation.css';

const GetLocation = () => {
    const [locations, setLocations] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        fetchLocation();
    }, []);

    const fetchLocation = async () => {
        try {
            const token = localStorage.getItem('futUserInfo') ? JSON.parse(localStorage.getItem('futUserInfo')).data.token : '';
            const userId = JSON.parse(localStorage.getItem('futUserInfo')).data.userId; // Get the user ID from localStorage
            const response = await axios.get(`http://localhost:5000/location/user/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setLocations(response.data);
            console.log("SetLocations : ", response.data);
        } catch (error) {
            console.error("Error while fetching data:", error);
        }
    };

    const handleCardClick = (index) => {
        setSelectedLocation(locations[index]);
    };

    const handleCloseGraph = () => {
        setSelectedLocation(null);
    };

    return (
        <Container className='cont'>
            <h1 className='getlocH'>Saved Locations</h1>
            <Row xs={1} md={3} className="g-4">
                {locations.map((location, index) => (
                    <Col key={index}>
                        <Card
                            className="cardd"
                            onClick={() => handleCardClick(index)}
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                        >
                            <Card.Body>
                                <Card.Title>{location.name}</Card.Title>
                                {location.weatherData && location.weatherData.length > 0 && (
                                    <>
                                        <Card.Text>
                                            <strong>Date:</strong>{" "}
                                            {new Date(location.weatherData[0].date).toLocaleDateString()}
                                        </Card.Text>
                                        <Card.Text>
                                            <strong>Temperature:</strong>{" "}
                                            {location.weatherData[0].temperature}°C
                                        </Card.Text>
                                        <Card.Text>
                                            <strong>Condition:</strong>{" "}
                                            {location.weatherData[0].condition}
                                        </Card.Text>
                                    </>
                                )}
                                {isHovered && (
                                    <div className="tooltip">Click to show graph</div>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
            {selectedLocation && (
                <div className="graph-container">
                    <WeatherGraph data={selectedLocation.weatherData} />
                    <button className='clsbtn' onClick={handleCloseGraph}>Close Graph</button>
                </div>
            )}
        </Container>
    );
};

export default GetLocation;
