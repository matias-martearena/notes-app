import express from 'express'
import fs from 'node:fs'
import { corsMiddleware } from './middlewares/cors.js'

const app = express()

app.use(express.json())
app.use(corsMiddleware())
app.use(express.static('dist'))

let notes = JSON.parse(fs.readFileSync('./database/notes.json', 'utf-8'))

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (req, res) => {
  res.json(notes)
})

app.get('/api/notes/:id', (req, res) => {
  const id = Number(req.params.id)
  const note = notes.find(note => note.id === id)
  note ? res.json(note) : res.status(404).end()
})

app.delete('/api/notes/:id', (req, res) => {
  const id = Number(req.params.id)
  notes = notes.filter(note => note.id !== id)

  res.status(204).end()
})

const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => n.id))
    : 0
  return maxId + 1
}

app.post('/api/notes', (req, res) => {
  const { body } = req

  if (!body.content) {
    return res.status(400).json({
      error: 'content missing'
    })
  }

  const note = {
    content: body.content,
    important: Boolean(body.important) || false,
    id: generateId()
  }

  notes = notes.concat(note)

  res.json(note)
})

const unknowEndpoint = (req, res, next) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknowEndpoint)

const PORT = process.env.PORT ?? 3001
app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`)
})
