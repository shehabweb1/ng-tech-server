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
    const userCollection = database.collection("user");
    const cartCollection = database.collection("cart");


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

    app.put('/products/:id', async(req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const product = req.body;

      const updatedProduct ={
        $set: {
          name: product.name,
          image: product.image,
          brand: product.brand,
          price: product.price,
          rating: product.rating,
          type: product.type,
          description: product.description
        }
      }

      const result = await productCollection.updateOne(filter, updatedProduct, options );
      res.send(result);
    });

    app.get('/products', async(req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productCollection.findOne(query);
      res.send(result);
    });

    app.get('/users', async(req, res) => {
      const cursor = userCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });  
   
    app.post('/users', async(req, res) => {
      const addUser = req.body;
      const result = await userCollection.insertOne(addUser);
      res.send(result);
    });

    app.get('/cart', async(req, res) => {
      const cursor = cartCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });  
   
    app.post('/cart', async(req, res) => {
      const addCart = req.body;
      const result = await cartCollection.insertOne(addCart);
      res.send(result);
    });

  
    app.delete('/cart/:id', async(req, res) => {
      const id = req.params.id;
      const query = { _id: id };
      const result = await cartCollection.deleteOne(query);
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