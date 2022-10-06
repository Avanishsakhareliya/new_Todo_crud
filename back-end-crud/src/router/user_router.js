const express = require("express");
const app = express();
let router = express.Router();
app.use(router);
let bodyParser = require('body-parser')
router.use(bodyParser.json({ limit: '500mb' }))

// controller
const {login,signup} = require("../controller/userController")
const {createNotes, listNotes, deleteNotes, editNotes}=require("../controller/notesController")
router.post('/login',login)
router.post('/signup',signup)

// notes----------------
router.post('/create',createNotes)
router.get('/listnotes',listNotes)
router.post('/delete/:id',deleteNotes)
router.post('/edit/:id',editNotes)

module.exports = router;
