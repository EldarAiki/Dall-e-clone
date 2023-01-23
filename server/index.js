import express from "express";
import * as dotenv from 'dotenv'
import cors from 'cors'
import connectDB from "./mongoDB/connects.js";
import postRoutes from './routes/postRoutes.js'
import dalleRoutes from './routes/dalleRoutes.js'

dotenv.config()

const app =express()
app.use(cors())
app.use(express.json({ limit: '50mb' }))

app.use('/api/v1/posts', postRoutes)
app.use('/api/v1/dalle', dalleRoutes)

app.get('/', async(req, res) => {
    res.send('Hello from DALL-E!')
})

const port = process.env.PORT || 8080

const startServer = async () => {

    try {
        connectDB(process.env.MONGODB_URL)
        app.listen(port, () => console.log(`Server has started on port ${port}`))
    } catch (error) {
        console.log('Something went wrong, ', error)
    }
    
}

startServer()