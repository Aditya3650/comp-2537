const express = require('express')
const app = express()
const https = require('https');
const bodyparser = require("body-parser");
app.set('view engine', 'ejs');


app.use(bodyparser.urlencoded({
    parameterLimit: 100000,
    limit: '50mb',
    extended: true
}));

app.listen(process.env.PORT || 5000, function (err) {
    if (err)
        console.log(err);
})


const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/timelineDB",
    { useNewUrlParser: true, useUnifiedTopology: true });
const eventSchema = new mongoose.Schema({
    text: String,
    hits: Number,
    time: String
});
const eventModel = mongoose.model("timelineevent", eventSchema);


app.get('/timeline/getAllEvents', function (req, res) {
    // console.log("received a request for "+ req.params.city_name);
    eventModel.find({}, function (err, data) {
        if (err) {
            console.log("Error " + err);
        } else {
            console.log("Data " + data);
        }
        res.send(data);
    });
})

//C
app.put('/timeline/insert', function (req, res) {
    console.log(req.body)
    eventModel.create({
        text: req.body.text,
        time: req.body.time,
        hits: req.body.hits
    }, function (err, data) {
        if (err) {
            console.log("Error " + err);
        } else {
            console.log("Data " + data);
        }
        res.send(data);
    });
})

//U
app.get('/timeline/inreaseHits/:id', function (req, res) {
    console.log(req.params)
    eventModel.updateOne({
       _id : req.params.id
    }, {
        $inc : { hits: 1}
    }, function (err, data) {
        if (err) {
            console.log("Error " + err);
        } else {
            console.log("Data " + data);
        }
        res.send("Update is good!");
    });
})


//D
app.get('/timeline/remove/:id', function (req, res) {
    // console.log(req.params)
    eventModel.remove({
       _id : req.params.id
    }, function (err, data) {
        if (err) {
            console.log("Error " + err);
        } else {
            console.log("Data " + data);
        }
        res.send("Delete is good!");
    });
})






app.get('/profile/:id', function (req, res) {

    const url = `https://pokeapi.co/api/v2/pokemon/${req.params.id}`

    data = ""
    poke_price = Math.floor(Math.random() * 10) + 1;

    https.get(url, function (https_res) {
        https_res.on("data", function (chunk) {
            data += chunk
        })

        https_res.on("end", function () {
            data = JSON.parse(data)        

            res.render("profile.ejs", {
                "id": data.id,
                "name": data.name,
                "hp": data.stats[0]["base_stat"],
                "attack": data.stats[1]["base_stat"],
                "defense": data.stats[2]["base_stat"],
                "specialAttack": data.stats[3]["base_stat"],
                "specialDefense": data.stats[4]["base_stat"],
                "speed": data.stats[5]["base_stat"],
                "price": poke_price,
            })
        })
    })
});

app.use(express.static('./public'))