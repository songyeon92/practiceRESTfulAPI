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

app.route("/articles")

.get((req, res) => {
    Article.find((err, foundArticles) => {
        if (!err) {
            res.send(foundArticles);
        } else {
            res.send(err);
        }
    });
})

.post((req, res) => {
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
})

.delete((req, res) => {
    Article.deleteMany((err) => {
          if (!err) {
              res.send("Successfully deleted all articles.");
          } else {
              res.send(err);
          }
    });
});

//////////////////////////////// request targeting a specific article

app.route("/articles/:articleTitle")

.get((req, res) => {
    Article.findOne({ title: req.params.articleTitle }, (err, foundArticle) => {
        if (foundArticle) {
            res.send(foundArticle);
        } else {
            res.send("No articles matching that title was found");
        }
    });
})

.put((req, res) => {
    Article.update(
        { title: req.params.articleTitle },
        { title: req.body.title, content: req.body.content },
        { overwrite: true },
        (err) => {
            if (!err) {
                res.send("Successfully updated article.");
            } 
        }
    );
})

.patch((req, res) => {

    // req.body = {
    //     title: "TEST",
    //     content: "TEST"
   
    
    Article.update(
        { title: req.params.articleTitle },
        { $set: req.body },
        (err) => {
            if (!err) {
                res.send("Successfully updated article.");
            } else {
                res.send(err);
            }
        }
    );
})

.delete((req, res) => {
    Article.deleteOne(
        { title: req.params.articleTitle },
        (err) => {
            if (!err) {
                res.send("Successfully deleted the article.");
            } else {
                res.send(err);
            }
        }
    );
});





app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

