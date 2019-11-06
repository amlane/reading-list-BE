const express = require("express");
const graphqlHTTP = require("express-graphql");
const schema = require("./schema/schema.js");
const mongoose = require("mongoose");

const app = express();

// connect to Atlas MongoDB
mongoose.connect("mongodb+srv://admin:Cr41.80ab@gql-reading-list-zxyb8.mongodb.net/test?retryWrites=true&w=majority", { useNewUrlParser: true })
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

