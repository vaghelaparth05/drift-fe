import express from "express"
import cors from "cors"
import OpenAI from "openai"
import dotenv from "dotenv"
dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

app.post("/chat", async (req, res) => {

  const { event, messages } = req.body

  const systemPrompt = `
You are an AI guide for the event "${event.name}" in Melbourne.
Help visitors with:
- food recommendations
- event timings
- what to do
- directions
- nearby attractions
`

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      ...messages
    ]
  })

  res.json({
    reply: completion.choices[0].message.content
  })
})

app.listen(3000, () => {
  console.log("AI server running")
})