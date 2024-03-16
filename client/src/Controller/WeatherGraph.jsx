import React from 'react';
import { Line } from 'react-chartjs-2';
import './WeatherGraph.css';


const WeatherGraph = ({ data }) => {
    const chartData = {
        labels: data.map(item => item.date),
        datasets: [
            {
                label: 'Temperature (°C)',
                data: data.map(item => item.temperature),
                borderColor: 'rgba(75, 192, 192, 1)',
                tension: 0.1
            }
        ]
    };

    return (
        <div className="graph-container">
            <div className="graph">
                <Line data={chartData} />
            </div>
        </div>
    );
    
};

export default WeatherGraph;
