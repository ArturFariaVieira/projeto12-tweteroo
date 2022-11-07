import express from "express";
import cors from "cors";
import bancotweets from "./tweets.js";
import bancousuarios from "./usuarios.js";

const app = express();
app.use(express.json());
app.use(cors());
const users = bancousuarios;
const tweets = bancotweets;
let funciona;
app.post("/sign-up", (req, res) => {
    const { username, avatar } = req.body;
    if (!username || !avatar) {
        res.status(400).send("Todos os campos são obrigatórios");
        return;
    }
    if (!checkUrl(avatar)) {
        res.status(404).send("Url do avatar não válida!");
        return;

    }
    else {
        if (users.find((user) => user.username == username)) {
            res.status(201).send("Ok");
        }
        else {
            users.push(req.body)
            res.status(201).send("OK")
        }

    }
})
app.get("/tweets", (req, res) => {
    const page = parseInt(req.query.page);
    if (page < 1) {
        res.status(400).send("Informe uma página válida!");
        return;
    }
    else {
        let limiteinf = (tweets.length - (10 * page))
        let limitesup = (tweets.length - (10 * (page - 1)))
        if ((page * 10 - tweets.length) > 10) {
            return;
        }
        console.log(tweets.length)
        if (limiteinf < 0) {
            res.send(tweets.slice(0, limitesup).reverse())
            return;
        }
        res.send(tweets.slice(limiteinf, limitesup).reverse())

    }
})
app.post("/tweets", (req, res) => {
    let validauser = req.headers.user;
    let validapost = req.body.tweet;   
    if (!validauser) {
        res.status(400).send("Usuario nao encontrado");
        return;
    }
    if (!validapost) {
        res.status(400).send("Todos os campos são obrigatórios");
        return;
    }
    else {
        let avatarpost = users.filter(user => user.username == validauser)[0].avatar;
        let novotweet = {
            username: validauser,
            avatar: avatarpost,
            tweet: validapost
        };
        tweets.push(novotweet);
        res.status(201).send("OK");
    }
})
app.get("/tweets/:username", (req, res) => {
    let filter = req.params.username;
    let tweetsfiltrados = tweets.filter((tweet) => tweet.username == filter);
    res.status(201).send(tweetsfiltrados.reverse());
})

app.listen(5000);
function checkUrl(string) {
    try {
        let url = new URL(string)
        funciona = true;
    } catch (err) {
        funciona = false;
    } return funciona;
}