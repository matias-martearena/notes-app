// TODO: Borrar: wGFQCC6ivTffWMA1
// NOTE: Conectando a la base de datos
import mongoose from 'mongoose'

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

if (process.argv.length === 4 || process.argv.length > 5) {
  console.log('Error: Argument not valid')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://mongodbmatiasmartearena:${password}@cluster0.8u2jbh2.mongodb.net/noteApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)

mongoose.connect(url)

// Esquema de una nota
const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean
})

// Modelo de la nota en base al esquema
// Primer parametro: Nombre del modelo
// Note - Nombre singular del modelo
// notes - Nombre en plural del modelo (minusculas para la coleccion)
// Segundo parametro: Esquema
const Note = mongoose.model('Note', noteSchema)

// NOTE: Creando un nuevo documento en la base de datos
if (process.argv.length === 5) {
  // Crea un objeto con la ayuda del modelo Note
  const note = new Note({
    content: process.argv[3],
    important: process.argv[4]
  })

  // Guarda la nota en la DB
  note.save().then(result => {
    console.log(`${result.content} ${result.important}`)
    mongoose.connection.close() // Cierra la conexion para que termine la ejecucion
  })
}

// NOTE: Obteniendo objetos de la base de datos
if (process.argv.length === 3) {
  // Los objetos se recuperan con el metodo find del modelo Note
  Note.find().then(result => {
    console.log('Notes:')
    result.forEach(note => {
      console.log(`Added: ${note.content} ${note.important}`)
    })
    mongoose.connection.close()
  })

  // Busqueda con filtrado
  // Note.find({ content: 'HTML is easy' }).then(result => {
  //   result.forEach(note => {
  //     console.log(note)
  //   })
  //   mongoose.connection.close()
  // })

  // Note.find({ important: true }).then(result => {
  //   result.forEach(note => {
  //     console.log(note)
  //   })
  //   mongoose.connection.close()
  // })
}
