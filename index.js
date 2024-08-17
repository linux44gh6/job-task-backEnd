const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pnsxsk9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
 
const phoneCollection=client.db('Job_Task').collection('mobile')
async function run() {
  try {

    app.get('/phone', async (req, res) => {
      try {
        const page = parseInt(req.query.page) || 1;  
        const limit = parseInt(req.query.limit) || 10;  
        const search = req.query.search || '';
        const skip = (page - 1) * limit;  
    
        const searchFilter = search ? { productName: { $regex: search, $options: 'i' } } :{};

        const result = await phoneCollection
          .find(searchFilter)
          .skip(skip)  
          .limit(limit)  
          .toArray();
        const totalItems = await phoneCollection.countDocuments();
        const totalPages = Math.ceil(totalItems / limit);
    
        
        res.send({
          items: result,  
          totalPages,  
          currentPage: page,  
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
      }
    });
    await client.connect();
    
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    
  }
}
run().catch(console.dir);

app.get('/',(req,res)=>{
  res.send('The server Running On')
})


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
