const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const app = express()
require('dotenv').config()

// Connect to the database
mongoose
  .connect(process.env.MONGO_URI, {
    dbName: 'doctoryQcm',
  })
  .then(() => console.log('Connected to the database'))
  .catch((err) => console.error('Database connection error:', err))

// Middleware
app.use(helmet())
app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(morgan('tiny'))

// // Define routes
const userRoutes = require('./routes/userRoutes')
const categoryRoutes = require('./routes/categoryRoutes')
const yearRoutes = require('./routes/yearRoutes')
const moduleRoutes = require('./routes/moduleRoutes')
const courseRoutes = require('./routes/courseRoutes')
const questionRoutes = require('./routes/questionRoutes')
const noteRoutes = require('./routes/noteRoutes')
const favouriteRoutes = require('./routes/favouriteRoutes')
const signalRoutes = require('./routes/signalRoutes')
const answerRoutes = require('./routes/answerRoutes')
const statsRoutes = require('./routes/statsRoutes')
const simulationRoutes = require('./routes/simulationRoutes')
const residencyRoutes = require('./routes/residencyRoutes')
const residencyQuestionRoutes = require('./routes/residencyQuestionRoutes')
const downloadRoutes = require('./routes/downloadRoutes')
const fileRoutes = require("./routes/fileRoutes");
const versionRoutes = require("./routes/versionRoutes");


const api = process.env.API_URL

app.use('/users', userRoutes)
app.use('/categories', categoryRoutes)
app.use('/years', yearRoutes)
app.use('/modules', moduleRoutes)
app.use('/courses', courseRoutes)
app.use('/questions', questionRoutes)
app.use('/notes', noteRoutes)
app.use('/favourites', favouriteRoutes)
app.use('/signals', signalRoutes)
app.use('/answers', answerRoutes)
app.use('/stats', statsRoutes)
app.use('/simulations', simulationRoutes)
app.use('/residencies', residencyRoutes)
app.use('/residencyQuestions', residencyQuestionRoutes)
app.use('/downloads', downloadRoutes)
app.use("/file", fileRoutes);
app.use("/versions", versionRoutes);
app.use("/uploads", express.static("uploads"));

app.get('/', function (req, res) {
  res.send('Welcome to Doctory QCM')
})
// Handle 404 errors
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err)
  res.status(err.status).json({ message: err })
})

// Start the server
const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
