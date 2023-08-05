const connectToMongoose=require('./db');
const express = require('express');
connectToMongoose();

const app = express()
const port = 4000

// app.get('/', (req, res) => {
//   res.send('Hello Node!')
// })
app.use(express.json())
//All available routers
app.use('/api/auth',require('./routes/auth'))
app.use('/api/notes',require('./routes/notes'))

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})