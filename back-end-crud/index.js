const express = require("express");
const app = express();
require("./src/Connection/connection")
const user_router =require("./src/router/user_router")
app.use(express.json())
let cors = require('cors')
app.use(cors())


app.use("/api/v1/",user_router);


app.listen(9090,()=>{
    console.log("Port is listing at 9090")
})