const express = require('express');
const cors = require('cors');
const app = express()
const port = process.env.PORT || 5000;


app.use(express.json())
app.use(cors())




const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://snu_seam:IVb56JYXtSvpIaq8@cluster0.4rme0sq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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


        const notesCollection = client.db("NotesDb").collection("notesCollection");

        app.post('/notes',async(req,res)=>{
            const notes = req.body;
            console.log(notes);
            const result = await notesCollection.insertOne(notes);
            res.send(result)
        })

        app.get('/notes',async(req,res)=>{
            const cursor = notesCollection.find();
            const result = await cursor.toArray()
            res.send(result)
        })

        app.get('/notes/:id',async(req,res)=>{
            const id = req.params.id;
            const query = {_id : new ObjectId(id)}
            const result = await notesCollection.findOne(query);
            res.send(result)
        })

        app.delete('/notes/:id',async(req,res)=>{
            const id = req.params.id;
            console.log(id);
            const query = {_id : new ObjectId(id)}
            const result = await notesCollection.deleteOne(query)
            res.send(result)
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send("notes server is running")
})

app.listen(port, () => {
    console.log(`Notes server is running on port ${port}`);
})