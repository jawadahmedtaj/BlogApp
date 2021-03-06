const express = require("express"),
  methodOverride = require("method-override"),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  expressSanitizer = require("express-sanitizer"),
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
});

let Blog = mongoose.model("Blog", blogSchema);

app.use(express.static("public"));
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(methodOverride("_method"));
app.use(expressSanitizer());

// Blog.create({
//     title: "Test Blog",
//     image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1352&q=80",
//     body: "Hello this is a blog post!"
// })

app.get("/", (req, res) => {
  res.redirect("/blogs");
});

app.get("/blogs", (req, res) => {
  Blog.find({}, (err, blogs) => {
    if (err) console.log(err);
    else {
      res.render("index", {
        blogs: blogs
      });
    }
  });
});

app.get("/blogs/new", (req, res) => {
  res.render("new");
});

app.post("/blogs", (req, res) => {
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.create(req.body.blog, (err, newBlog) => {
    if (err) res.render("new");
    else res.redirect("/blogs");
  });
});

app.get("/blogs/:id", (req, res) => {
  Blog.findById(req.params.id, (err, foundBlog) => {
    if (err) res.redirect("/blogs");
    else res.render("show", { blog: foundBlog });
  });
});

app.get("/blogs/:id/edit", (req, res) => {
  Blog.findById(req.params.id, (err, foundBlog) => {
    if (err) res.redirect("/blogs");
    else res.render("edit", { blog: foundBlog });
  });
});

app.put("/blogs/:id", (req, res) => {
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog) => {
    if (err) res.redirect("/blogs/" + req.params.id + "/edit");
    else res.redirect("/blogs/" + req.params.id);
  });
});

app.delete("/blogs/:id", (req, res) => {
  Blog.findByIdAndRemove(req.params.id, err => {
    if (err) res.redirect("/blogs");
    else res.redirect("/blogs");
  });
});

app.listen(3000, () => {
  console.log("Server listening on 3000");
});
