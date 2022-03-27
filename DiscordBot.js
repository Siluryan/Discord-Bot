const Discord = require("discord.js")
const fetch = require("node-fetch")
const keepAlive = require("./server")
const Database = require("@replit/database")

const db = new Database()
const client = new Discord.Client()
const Words = [""]
const starterReturn = [""]

db.get("return").then(returns => {
  if (!returns || returns.length < 1) {
    db.set("return", starterReturn)
  }
})

db.get("responding").then(value => {
  if (value == null) {
    db.set("responding", true)
  }
})

function updateReturn(returnMessage) {
  db.get("return").then(returns => {
    returns.push([returns])
    db.set("return", returns)
  })
}

function deleteReturn(index) {
  db.get("return").then(returns => {
    if (returns.length > index) {
      returns.splice(index, 1)
      db.set("return", returns)
    }
  })  
}

client.on("ready", () => {
  console.log('Logged in ${client.user.tag}!')
})

client.on("message", msg => {

  if (msg.content.startsWith("$new")) {
    returnMessage = msg.content.split("$new ")[1]
    updateReturn(returnMessage)
    msg.channel.send("New return message added.")
  }

  if (msg.content.startsWith("$del")) {
    index = parseInt(msg.content.split("$del ")[1])
    deleteReturn(index)
    msg.channel.send("return message deleted.")
  }

  if (msg.content.startsWith("$list")) {
    db.get("return").then(returns => {
      msg.channel.send(returns)
    })
  }

  if (msg.content.startsWith("$responding")) {
    value = msg.content.split("$responding ")[1]

    if (value.toLowerCase() == "true") {
      db.set("responding", true)
      msg.channel.send("Responding is on.")
    } else {
       db.set("responding", false)
      msg.channel.send("Responding is off.")     
    }
  }
})

keepAlive()
client.login(process.env.TOKEN)
