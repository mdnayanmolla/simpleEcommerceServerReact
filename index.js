const express = require('express');
const cors = require('cors')
const app = express();
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId} = require('mongodb');

const port = process.env.PORT || 5000;

//middleware 

app.use(cors())
app.use(express.json())


console.log(process.env.DB_USER)


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ols5myy.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
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
    
    const productsCollection = client.db('productsDB').collection('products')
    const userCollection = client.db('productsDB').collection('user')

    app.get('/products', async(req,res)=>{
        const corsor = productsCollection.find()
        const result = await corsor.toArray()
        res.send(result);
    })

    app.get('/products/:id', async(req,res)=>{
      const id  = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await productsCollection.findOne(query)
      res.send(result)
    })


     app.post('/products', async(req,res)=>{
        const addProduct = req.body;
        console.log(addProduct);
        const result = await productsCollection.insertOne(addProduct);
        res.send(result);
     })


  app.put('/products/:id', async(req,res)=>{
    const id = req.params.id;
    const filter = {_id: new ObjectId(id)}
    const options = {upsert:true};
    const updateProduct = req.body;
    const product = {
      $set: {
         name : updateProduct.name,
         price : updateProduct.price,
         brand : updateProduct.brand,
         photo : updateProduct.photo,
         description : updateProduct.description
      }
    }

    const result = await productsCollection.updateOne(filter,product,options)
    res.send(result)
  })
//User related apis
app.post('/user', async(req,res)=>{
  const user = req.body;
  console.log(user)
  const result = await userCollection.insertOne(user);
  res.send(result)
});


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req,res)=>{
   res.send('Assignment 10 is running')
});
app.listen(port,()=>{
    console.log(`Assignemnt 10 is running ${port}`)
})