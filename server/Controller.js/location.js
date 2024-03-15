const Location = require('../Model/locationModel');



const addLocation = async (req, res) => {
    try {
        const { userId, name, weatherData } = req.body;

        // Add the current date to the weatherData array
        const currentDate = new Date();
        const formattedWeatherData = {
            temperature: weatherData.temperature,
            condition: weatherData.condition,
            date: currentDate
        };

        const location = await Location.create({ userId, name, weatherData: [formattedWeatherData] });
        res.status(201).json(location);
    } catch (error) {
        console.log('Error while adding location:', error);
        res.status(500).json({ error: "An error occurred while adding the location." });
    }
}




const getLocations = async (req, res) => {
    try {
        const locations = await Location.find();
        res.status(200).json(locations);
    } catch (error) {
        console.log('Error on while getting locations.......', error);
        res.status(500).json({ error: "An error occurred while getting the locations." });
    }
}

module.exports = { addLocation, getLocations };
