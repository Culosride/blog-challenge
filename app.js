import express from "express";
import mongoose from "mongoose";

// import and use the dirname() method from the path module.
// The dirname method takes a path as a parameter and returns the directory name of the path.
import path from "path";
// fileURLToPath method from the url module to get the filename.
import {fileURLToPath} from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
import lodash from "lodash"
const _ = lodash

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended: true}));

const regex = new RegExp("^$|^[ \t]+$");

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/blogDB').catch(err => console.log("catch on connect", err));

  const postSchema = new mongoose.Schema({
    title: {
      type: String,
      required: [true, "Title required"]
    },
    body: {
      type: String,
      required: [true, "Title required"]
    }
  })

  const Post = mongoose.model("Post", postSchema)

  app.get("/", async (req, res) => {
    const posts = await Post.find()
    res.render("home", {
      content: homeStartingContent,
      posts: posts
    });
  })

  app.post("/compose", (req, res) => {
    const title = req.body.postTitle
    const body = req.body.postBody
    const newPost = new Post({
      title: title,
      body: body
    })

    if(regex.test(title) || regex.test(body)) {
      res.redirect("/compose")
    } else {
      newPost.save()
      res.redirect("/")
    }
  })

  app.get("/posts/:postTitle", async (req, res) => {
    const urlParam = _.lowerCase(req.params.postTitle.toLowerCase())
    const posts = await Post.find()
    posts.forEach(post => {
      const title = _.lowerCase(post.title.toLowerCase())
      const content = post.body
      if((title) === (urlParam)) res.render("post", {title: post.title, body: content})
    })
  })
}


app.get("/about", (req, res) => {
  res.render("about", {content: aboutContent});
})


app.get("/contact", (req, res) => {
  res.render("contact", {content: contactContent});
})

app.get("/compose", (req, res) => {
  res.render("compose", {content: ""});
})

app.listen(3000);
