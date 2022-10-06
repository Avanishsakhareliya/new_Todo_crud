const mongoose = require("mongoose");

let URL='mongodb+srv://avanish:avanish2811@cluster0.ihusvf8.mongodb.net/?retryWrites=true&w=majority'

mongoose.connect(URL, { useNewUrlParser: true, useUnifiedTopology: true })
.then(()=>{
    console.log("connection is done")
})
.catch((err)=>{
    console.log(err)
})