const express = require('express'),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    app = express();

mongoose.connect("mongodb://127.0.0.1:27017/Blog_App", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});
app.set("view engine", "ejs");

const blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {
        type: Date,
        default: Date.now
    }
})

let Blog = mongoose.model("Blog", blogSchema);

app.use(express.static("public"));
app.use(bodyParser.urlencoded({
    extended: true
}));

// Blog.create({
//     title: "Test Blog",
//     image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1352&q=80",
//     body: "Hello this is a blog post!"
// })

app.get("/", (req, res) => {
    res.redirect("/blogs");
})

app.get("/blogs", (req, res) => {
    Blog.find({}, (err, blogs) => {
        if (err) console.log(err);
        else {
            res.render("index", {
                blogs: blogs
            });
        }
    })
})

app.listen(3000, () => {
    console.log("Server listening on 3000");
})