const express = require('express')
const connection = require('./MongoDb/mongoose')
const authRouter = require('./Router/userRouter')
const locationRouter = require('./Router/locationRoutes')
const notificationRouter = require('./Router/notificationRouter')
const dotenv = require('dotenv')
const cors = require('cors')
const app = express()

connection()
dotenv.config()

app.use(cors())
app.use(express.json())
app.use('/auth',authRouter)
app.use('/location',locationRouter)
app.use('/notification',notificationRouter)


const PORT = process.env.PORT || 5000
app.listen(PORT,()=> {
    console.log(`Server is running on ${PORT}`);
})