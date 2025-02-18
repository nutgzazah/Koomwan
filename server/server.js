const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const colors = require('colors')
const morgan = require('morgan')
const connectDB = require('./config/db')

//DOTENV
dotenv.config()

//MONGODB CONNECTION
connectDB()

//REST OBJECT
const app = express()

//Middlewares
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

//ROUTES
app.use('/api/v1/auth', require('./routes/authRoutes'))
app.use('/api/v1/user', require('./routes/userRoutes'))
app.use('/api/v1/forum', require('./routes/forumRoutes'))
app.use('/api/v1/admin', require('./routes/adminRoutes'))
app.use('/api/v1/storage', require('./routes/storageRoutes'))

//PORT
const PORT = process.env.PORT || 8080

//listen
app.listen(PORT,() => {
    console.log(`Server Running ${PORT}`.bgGreen.white)
})