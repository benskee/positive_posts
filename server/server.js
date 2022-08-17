const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()


app.use(cors())

app.use(express.json({ extended: false }))

app.use('/api/users', require('./routes/users'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));