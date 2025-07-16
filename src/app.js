import express from 'express'

const app = express()

app.use("/hello",(req, res)=>{
    res.send("Hello worldd!")
})

app.listen(6969, ()=>{
    console.log("Server running on PORT 6969...");
})