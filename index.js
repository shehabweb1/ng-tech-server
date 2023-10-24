const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@learning.axf2sgn.mongodb.net/?retryWrites=true&w=majority`;

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


    const database  = client.db("ngTech")
    const brandCollection = database.collection("brands");
    const productCollection = database.collection("product");


    app.get('/brands', async(req, res) => {
      const cursor = brandCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get('/products', async(req, res) => {
      const cursor = productCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });  
   
    app.post('/products', async(req, res) => {
      const addProduct = req.body;
      const result = await productCollection.insertOne(addProduct);
      res.send(result);
    });

    app.get('/products/:id', async(req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) };
      const result = await productCollection.findOne(query);
      res.send(result);
    });

    
    await client.db("admin").command({ ping: 1 });
    console.log("Ready to connect");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Welcome to our server')
})

app.listen(port, (req, res) => {
    console.log(`NG Tech server is running: ${port}`)
});