import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

mongoose.set('strictQuery', false)
const url = process.env.MONGODB_URI

mongoose
  .connect(url)
  .then(() => console.log('connected to MongoDB'))
  .catch(error => {
    console.log('Error connecting to MongoDB:', error.message)
    process.exit(1)
  })

// Validacion de datos
const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    minLength: 5,
    maxLength: 20,
    required: true
  },
  important: Boolean
})

noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

export default mongoose.model('Note', noteSchema)
// export const Note = mongoose.model('Note', noteSchema)
