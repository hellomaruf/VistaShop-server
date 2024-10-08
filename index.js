const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("VistaShop Running........");
});

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.0o9qayn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const productsCollections = client.db("VistaShopDB").collection("products");

    // Get All Products Data------------------------>
    app.get("/productsData", async (req, res) => {
      const page = parseInt(req.query.page);
      const size = parseInt(req.query.size);
      console.log(page, size);
      
      const count = await productsCollections.find().count();
      const body = req.body;
      const result = await productsCollections
        .find(body)
        .skip(page * size)
        .limit(size)
        .toArray();
      res.send({ result, count });
    });

    // Sorting by newest and oldest data----------------------------->
    // app.get("/products", async (req, res) => {
    //   const { sort } = req.query;
    //   console.log(sort);

    //   let sortOption;
    //   if (sort === "newest") {
    //     sortOption = { createdAt: -1 };
    //   } else if (sort === "oldest") {
    //     sortOption = { createdAt: 1 };
    //   } else {
    //     sortOption = {};
    //   }

    //   const result = await productsCollections.find().sort(sortOption);
    //   res.send(result);
    // });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`VistaShop listening on port ${port}`);
});
