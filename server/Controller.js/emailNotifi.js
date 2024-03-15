const schedule = require('node-schedule');
const nodemailer = require('nodemailer');
const Location = require('../Model/locationModel');

// Create a reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
  service: 'gmail',
  tls: {
    rejectUnauthorized: false // Ignore TLS verification (not recommended for production)
  }
});

// Function to send email notification
const sendEmailNotification = async (email, subject, text) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_ADDRESS,
      to: email,
      subject,
      text,
      auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD
      }
    });
    console.log('Email sent successfully.');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

// Schedule email notification at 12 pm every day except Sundays
schedule.scheduleJob('0 12 * * 1-6', async () => {
  try {
    // Get weather data for saved locations and customize notification message
    const locations = await Location.find();
    let message = 'Today\'s weather for your saved locations:\n';
    locations.forEach(location => {
      message += `${location.name}: ${location.weatherData[0].temperature}°C, ${location.weatherData[0].condition}\n`;
    });

    // Send email notification to the authenticated user's email
    sendEmailNotification('njrjr100@gmail.com', 'Weather Notification', message); 
  } catch (error) {
    console.error('Error scheduling email notification:', error);
  }
});

module.exports = sendEmailNotification;
