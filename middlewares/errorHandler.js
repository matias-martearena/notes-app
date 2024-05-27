export const errorHandler = (error, req, res, next) => {
  console.log(`Error: 
  ------ 
  ${error.message}
  ------`)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }

  next(error)
}
