require("dotenv").config()

const express = require("express")
const connectDB = require("./congif/connectdb")
const dns = require("dns")
dns.setServers(["1.1.1.1","8.8.8.8"])

const app = express()

connectDB()
app.listen(3000,()=>console.log("hellos"))
