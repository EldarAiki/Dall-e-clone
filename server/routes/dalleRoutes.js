import express from 'express'
import * as dotenv from 'dotenv'
import { Configuration, OpenAIApi } from 'openai'

dotenv.config()

const router = express.Router()

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
})

const openai = new OpenAIApi(configuration)

router.route('/').get((req, res) => {
    res.send('Hello from DALL-E and GPT-3!')
})

router.route('/').post(async (req, res) => {
    try {
        const { prompt, size } = req.body

        const imageResponse = await openai.createImage({
            prompt,
            n: 1,
            size,
            response_format: 'b64_json'
        })

        const image = imageResponse.data.data[0].b64_json

        const audioResponse = await openai.textToSpeech({
            text: prompt,
            response_format: 'mp3'
        })

        const audio = audioResponse.data.data[0].audio

        res.status(200).json({ photo: image, audio: audio })
    } catch (error) {
        console.log('Something went wrong ', error)
        res.status(500).send(error?.response.data.error.message)
    }
})

export default router 
