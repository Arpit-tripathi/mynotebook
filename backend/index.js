// const connectToMongo = require('./db');

// connectToMongo();


const connectToMongo = require('./db');


connectToMongo()
  .then(() => {
    // Code to execute after successful connection
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

  const express = require('express')
const app = express()
const port = 5000

app.use(express.json())
//Available Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})