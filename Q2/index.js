const express = require("express");
const path = require("path");
const multer = require("multer");
const alert = require("alert");

const app = express();

app.set("views", "./views");
app.set("view engine", "ejs");
app.use(express.static("stylesheet"));

const storage = multer.diskStorage({
    destination: "./uploads",
    filename: (req, file, callback) => {
        callback(null, file.originalname);
    }
});

const upload = multer({storage:storage});

app.use(express.urlencoded({extended:true}));

app.get("/", (req, res) => {
    res.render("index", {inputFile: req.query.inputFile});
});

app.post("/upload", upload.single("avatar"), (req, res) => {
    console.log(req.file);
    if(req.file != undefined){
        res.redirect("/?inputFile=true");
    }else{
        res.redirect("/");
    }

});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server started listening on port ${PORT}\nVisit: http://localhost:${PORT}`);
});