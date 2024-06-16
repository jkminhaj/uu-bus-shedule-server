const express = require("express");
const app = express();
const port = process.env.PORT || 2000 ;
const cors = require("cors");

// Middlewares
app.use(cors({
  origin:['http://localhost:5173']
}));

// Mongodb 
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://bus_shedule:6TztN58U4Og9Su4i@cluster0.szfaclu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    await client.connect();
    // Send a ping to confirm a successful connection
    const db = client.db("busSheduleDB");
    const sheduleCollection = db.collection("shedules");

    
    // Get All Shedules 
    app.get("/shedules",async(req,res)=>{
        const result = await sheduleCollection.find().toArray();
        res.send(result);
    })

    // Get a signle shedule
    app.get("/shedules/:id",async(req,res)=>{
      const id = req.params.id;
      const result = await sheduleCollection.findOne({_id : new ObjectId(id)});
      res.send(result);
    })

    // Ping MongoDB deployment
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/',(req,res)=>{
    res.send("Server is working fine")
})
app.listen(port , ()=>{
    console.log(`Bus server is working on http://localhost:${port}`)
})