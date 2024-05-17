const express = require('express');
const cors = require('cors');
require('dotenv').config();
const port = process.env.port || 5000;
const app = express()

app.use(cors({origin: ["http://localhost:5173", "https://advanto-ef40b.web.app"]}))
app.use(express.json())


app.get('/', (req, res)=>{
    res.send('Advanto server is running')
})

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@0.h4rhhst.mongodb.net/?retryWrites=true&w=majority&appName=0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    const database = client.db("AllSpotsDB");
    const spotsCollection = database.collection("spotsCollection")

    app.post('/allSpots', async(req, res)=>{
        const newSpot = req.body
        const result = await spotsCollection.insertOne(newSpot)
        res.send(result)
    })
    
    app.get('/allSpots', async(req, res)=>{
        const cursor = spotsCollection.find()
        const result = await cursor.toArray()
        res.send(result)
    })

    app.get('/allSpots/:id', async(req, res)=>{
      const id = req.params.id
      const query = {_id : new ObjectId(id)}
      const result = await spotsCollection.findOne(query);
      res.send(result)
    })

   app.get('/mySpot/:userEmail', async(req, res)=>{
      const userEmail = req.params.userEmail
      const query = {userEmail: userEmail}
      const result = await spotsCollection.find(query).toArray();
      res.send(result)
    })  
    
    app.delete('/allSpots/:id', async(req, res)=>{
      const id = req.params.id
      const query = {_id : new ObjectId(id)}
      const result = await spotsCollection.deleteOne(query)
      res.send(result)
    })

    app.put('/allSpots/:id', async(req, res)=>{
      const id = req.params.id
      const spot = req.body
      const filter = {_id: new ObjectId(id)}
      const options = { upsert: true };  
      const updateSpot = {
        $set: {
          image: spot.image,
          tourists_spot_name: spot.tourists_spot_name,
          country_Name: spot.country_Name,
          location:spot.location,
          short_description: spot.short_description, 
          average_cost: spot.average_cost,
          seasonality: spot.seasonality, 
          travel_time:spot.travel_time, 
          totalVisitorsPerYear: spot.totalVisitorsPerYear,
          userEmail: spot.userEmail,
          userName: spot.userName
        }
      }
      const result = await spotsCollection.updateOne(filter, updateSpot, options);
      res.send(result)

    })
    



    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.listen(port, ()=>{
    console.log(`server is running on ${port} this port`);
})