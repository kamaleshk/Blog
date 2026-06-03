require("dotenv").config()
const express = require("express");
const mongoDB = require("./config/database");
const ExpressMongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");
const redis = require("./config/redis");

const userRouter = require("./routes/user");
const postRouter = require("./routes/posts");
const authRouter = require("./routes/auth");


const app = express();

mongoDB();

["logs"].forEach(dir=>{
    if(!fs.existsSync(dir)){
        fs.mkdirSync(dir)
    }
})

const accessLogStream = fs.createWriteStream(path.join(__dirname, "logs", "access.log"), {flags: "a"})


app.use(express.json({ limit : "10mb"}))
app.use(express.urlencoded({extended: true}));

//Logging
app.use(morgan("combined", {stream: accessLogStream}))

app.use(helmet())
// app.use(
//   ExpressMongoSanitize({
//     replaceWith: "_"
//   })
// );
//app.use(xss());
app.use(cors());

app.use("/api/users", userRouter);
app.use("/api/posts", postRouter);
app.use("/api/auth", authRouter);

app.use((req, res)=>{
    res.status(400).json({
        message:"Route not found",
        requestUrl: req.originalUrl
    })
})

app.use((err, req, res, next)=>{
    res.status(500).json({
        message: err.message || "Internal server error"
    })
})

const PORT = process.env.PORT;
app.listen(PORT, ()=>{
    console.log(`The port running on ${PORT}`)
})