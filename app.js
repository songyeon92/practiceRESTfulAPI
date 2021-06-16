const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const ejs = require('ejs');
const { truncate } = require('fs');
const app = express();
const hostname = '127.0.0.1';
const port = 3000;

app.set('view engine','ejs'); 
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({
    extended: true
}));

mongoose.connect('mongodb://localhost:27017/wikiDB', {useNewUrlParser: true, useUnifiedTopology: true});

const articleSchema = {
    title: String, 
    content: String
};

const Article = mongoose.model('Article', articleSchema);

app.get("/articles", (req, res) => {
    Article.find((err, foundArticles) => {
        if (!err) {
            res.send(foundArticles);
        } else {
            res.send(err);
        }
    });
});

app.post("/articles", (req, res) => {
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });

    newArticle.save((err) => {
        if (!err) {
            res.send("Successfully added a new ariticle.");
        } else {
            res.send(err);
        }
    });
});

app.delete("/articles", (req, res) => {
    Article.deleteMany((err) => {
          if (!err) {
              res.send("Successfully deleted all articles.");
          } else {
              res.send(err);
          }
    });
});


app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

