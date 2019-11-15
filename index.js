const express = require("express");
const graphqlHTTP = require("express-graphql");
const schema = require("./schema/schema.js");
const mongoose = require("mongoose");
const cors = require("cors");
require('dotenv').config();

const app = express();

// allow cross origin requests
app.use(cors());

// connect to Atlas MongoDB
mongoose.connect(process.env.MONGODB_URI, { useUnifiedTopology: true, useNewUrlParser: true })
mongoose.connection.once("open", () => {
    console.log("connected to database")
});

app.use("/graphql", graphqlHTTP({
    schema,
    graphiql: true
}))

app.listen(4000, () => {
    console.log("💥💥💥 Server is listening on port 4000 💥💥💥")
})

