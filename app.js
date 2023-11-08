const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
mongoose.connect("");


const articleSchema = {
    title: String,
    content: String
}

const Article = mongoose.model("Article", articleSchema)

app.route("/articles")

    .get(
        async (req, res) => {
            try {
                const articles = await Article.find({});
                res.status(200).send(articles);
            } catch(err) {
                res.status(500).send({message: "Erro na solicitação"});
            }
        }
    )

    .post(
        async (req, res) => {
            try {
                const titleReq = req.body.title;
                const contentReq = req.body.content;
                const article = new Article ({
                    title: titleReq,
                    content: contentReq
                })
                await article.save()
            } catch(err) {
                res.status(500).send({message: "Erro na solicitação"});
            } finally {
                res.status(201).send({ message: "Sucesso! Adicionou um novo artigo." });
            }
        }
    )

    .delete(
        async (req, res) => {
            try {
                await Article.deleteMany({});
            } catch (err) {
                res.status(500).send({message: "Erro na solicitação"});
            } finally {
                res.status(200).send({ message: "Sucesso na exclusão de todos artigos" })
            }
        }
    )

app.route("/articles/:specificArticle")
    .get(
        async (req, res) => {
            try {
                const search = req.params.specificArticle;
                const article = await Article.findOne({title: search});
                if(!article)
                    res.status(200).send({message: "Nenhum artigo com esse título encontrado."});
                else
                    res.status(200).send(article);
            } catch(err) {
                res.status(500).send({message: "Erro na solicitação"});
            }
            
        }
    )

    .put(
        async (req, res) => {
            try {
                const newTitle = req.body.title;
                const newContent = req.body.content;
                await Article.updateOne({title: req.params.specificArticle}, {title: newTitle, content: newContent}, {overwrite: true});
            } catch (err) {
                res.status(500).send({message: "Erro na solicitação"});
            } finally {
                res.status(200).send({message: "Put realizado com sucesso"});
            }
        }
    )

    .patch(
        async (req, res) => {
            try {
                await Article.updateOne({title: req.params.specificArticle}, {$set: req.body}, {overwrite: true});
            } catch (err) {
                res.status(500).send({message: "Erro na solicitação"});
            } finally {
                res.status(200).send({message: "Patch realizado com sucesso"})
            }
        }
    )

    .delete (
        async (req, res) => {
            try {
                await Article.deleteOne({title: req.params.specificArticle})
            } catch (err) {
                res.status(500).send({message: "Erro na solicitação"});
            } finally {
                res.status(200).send({message: "Delete realizado com sucesso"})
            }
        }
    )

app.listen(3000, function() {
  console.log("Server started on port 3000");
});