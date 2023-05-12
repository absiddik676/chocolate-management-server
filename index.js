const express = require('express')
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000
const cors = require('cors')

app.use(cors())
app.use(express.json())



const uri = "mongodb+srv://absiddik:siddik12**@cluster0.l9yjteg.mongodb.net/?retryWrites=true&w=majority";

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
    await client.connect();

    const chocolateCollation = client.db('chocolateDB').collection('chocolate')

    app.get('/chocolates', async(req,res) => {
      const cursor = await chocolateCollation.find().toArray();
      res.send(cursor)
    })

    app.get('/chocolate/:id', async(req,res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const cursor = await chocolateCollation.findOne(query);
      res.send(cursor)
    })

    app.post('/chocolate',async(req,res)=>{
      const newChocolate = req.body;
      console.log(newChocolate);
      const result = await chocolateCollation.insertOne(newChocolate);
      res.send(result)
    })

    app.put('/chocolate/:id',async(req,res) =>{
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const chocolate = req.body
      console.log(chocolate);
      const updateDoc = {
        $set: {
          name:chocolate.name,
          category:chocolate.category,
          country:chocolate.country,
          photo:chocolate.photo
        },
      }
      const result = await chocolateCollation.updateOne(filter, updateDoc, options);
      res.send(result)

    })

    app.delete('/chocolate/:id', async (req,res) =>{
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await chocolateCollation.deleteOne(query);
      res.send(result)
    })
   
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})