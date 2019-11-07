const graphql = require("graphql");
const _ = require("lodash");
const Book = require("../models/book.js");
const Author = require("../models/author.js");

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull
} = graphql;

//dummy data
// var books = [
//     { name: "Great Expectations", genre: "Social Criticism", id: "1", author_id: "1" },
//     { name: "Fragile Things", genre: "Fantasy", id: "2", author_id: "2" },
//     { name: "Little Women", genre: "Coming of Age", id: "3", author_id: "3" },
//     { name: "Oliver Twist", genre: "Crime Fiction", id: "4", author_id: "1" },
//     { name: "American Gods", genre: "Fantasy", id: "5", author_id: "2" },
//     { name: "The Christmas Carol", genre: "Fairy Tale", id: "6", author_id: "1" }
// ]

// var authors = [
//     { name: "Charles Dickens", age: 44, id: "1" },
//     { name: "Neil Gaiman", age: 42, id: "2" },
//     { name: "Louisa May Alcott", age: 36, id: "3" }
// ]

const BookType = new GraphQLObjectType({
    name: "Book",
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        author: {
            type: AuthorType,
            resolve(parent, args) {
                // console.log(parent)
                // return _.find(authors, { id: parent.author_id })
                return Author.findById(parent.author_id)
            }
        }
    })
});

const AuthorType = new GraphQLObjectType({
    name: "Author",
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                // return _.filter(books, { author_id: parent.id })
                return Book.find({ author_id: parent.id })
            }
        }
    })
});


const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        book: {
            type: BookType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                // code to get data from db / other source
                // console.log(typeof (args.id)) -> output: "string"
                // return _.find(books, { id: args.id });
                return Book.findById(args.id)
            }
        },
        author: {
            type: AuthorType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                // return _.find(authors, { id: args.id });
                return Author.findById(args.id)
            }
        },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                // return books
                return Book.find();
            }
        },
        authors: {
            type: new GraphQLList(AuthorType),
            resolve(parent, args) {
                // return authors
                return Author.find();
            }
        }
    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addAuthor: {
            type: AuthorType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                age: { type: new GraphQLNonNull(GraphQLInt) }
            },
            resolve(parent, args) {
                let author = new Author({
                    name: args.name,
                    age: args.age
                })
                return author.save();
            }
        },
        addBook: {
            type: BookType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                genre: { type: new GraphQLNonNull(GraphQLString) },
                author_id: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve(parent, args) {
                let book = new Book({
                    name: args.name,
                    genre: args.genre,
                    author_id: args.author_id
                });
                return book.save();
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});