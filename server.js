const express = require("express");
const multer=require("multer");
const axios = require('axios');

var app=express();

app.use(express.urlencoded({"extended":false}));

//Setting storage space
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        cb(null,file.originalname );
    }
});

var upload = multer({ storage: storage });


app.listen(8081,function(){
    console.log("Server started");
});

//path to use static files
app.use(express.static('public'));

app.get('/',(req,resp)=>{
    // resp.send("hello");
    // console.log(__dirname);
    resp.sendFile(__dirname+"/public/form.html");
});

app.post('/getResponse',upload.single('image'),async (req,resp)=>{
    if(!req.file)
    {
        // const err=new Error("Please Upload your pic");
        // resp.send(err);
        // return err;
        return resp.status(400).send({
            message: 'Please Upload your pic!'
         });
    }

    axios.post('https://southcentralus.api.cognitive.microsoft.com/customvision/v3.0/Prediction/79932071-d9ec-4b15-bcb4-fed8abb183c2/detect/iterations/Iteration3/url',{"url":'https://i.stack.imgur.com/X6jI3.png'},
    {headers:{'Prediction-Key':'9639493e007b461da7aa33ab262a1bda','Content-Type':'application/json'}}).then((ans)=>{
        console.log(ans.data.predictions);
        resp.send(ans.data.predictions);
    }).catch((err)=>{
        console.log(err);
    });
    // resp.send("File uploaded");
});