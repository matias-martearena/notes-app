import dotenv from 'dotenv'
import express from 'express'
import { corsMiddleware } from './middlewares/cors.js'
import { errorHandler } from './middlewares/errorHandler.js'
import Note from './models/note.js'

dotenv.config()

const app = express()

app.use(express.static('dist'))
app.use(express.json())
app.use(corsMiddleware())

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (req, res) => {
  Note.find().then(notes => {
    res.json(notes)
  })
})

app.get('/api/notes/:id', (req, res, next) => {
  Note
    .findById(req.params.id)
    .then(note => {
      note ? res.json(note) : res.status(404).end()
    })
    .catch(error => next(error))
})

app.post('/api/notes', (req, res, next) => {
  const { body } = req

  if (body.content === undefined) {
    res.status(400).json({ error: 'content missing' })
  }

  if (typeof (body.content) !== 'string' || typeof (body.important) !== 'boolean') {
    res.status(400).json({ error: 'content type are not valid' })
  }

  const note = new Note({
    content: body.content,
    important: body.important || false
  })

  note
    .save()
    .then(savedNote => {
      res.json(savedNote)
    })
    .catch(error => next(error))
})

app.delete('/api/notes/:id', (req, res, next) => {
  Note
    .findByIdAndDelete(req.params.id)
    .then(result => {
      if (result === null) res.status(404).send({ error: 'Note not exists' })
      res.status(204).end()
    })
    .catch(error => next(error))
})

// Validacion de datos:
app.put('/api/notes/:id', (req, res, next) => {
  const { content, important } = req.body

  Note
    .findByIdAndUpdate(
      req.params.id,
      { content, important },
      { new: true, runValidators: true, context: 'query' })
    .then(updatedNote => {
      if (updatedNote === null) res.status(400).send({ error: 'Note not found' })
      res.json(updatedNote)
    })
    .catch(error => next(error))
})

const unknowEndpoint = (req, res, next) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknowEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT ?? 3001
app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`)
})
