const express = require('express');
const cors = require('cors');
const port = process.env.port || 5000;
const app = express()

app.use(express.json())
app.use(cors())

app.get('/', (req, res)=>{
    res.send('Advanto server is running')
})

app.listen(port, ()=>{
    console.log(`server is running on ${port} this port`);
})