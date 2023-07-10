const express = require('express')
const fs = require('fs')
const eventEmitter = require('events')
const cors = require('cors')
const {body} = require('express-validator')
const bodyParser = require('body-parser')
const session = require('express-session')

const file = fs.readFileSync('./todos.json','utf8')
let data = JSON.parse(file)

const app = express()
const event = new eventEmitter()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded())
app.use(session({
    secret: 'D4R3T5E3R5C4B6LP79',
    resave: false,
    saveUninitialized: true
}))
app.use(function(err,req,res,next){
    console.log(err.stack)
    res.status(500).send('Ooops something went wrong!')
})
app.use(cors())

function generateId(){
    let fn = Date.now().toString(36)
    return fn
}

app.get('/sse',(req,res) => {
    res.set({
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    })
    res.write('data: Hello working')
})

app.get('/',(req,res) => {
    let id = generateId()
    req.session.user = id
    data[id] = []
    let json = JSON.stringify(data)
    fs.writeFileSync('./todos.json',json)
    res.json(id)
})
app.get('/:id',(req,res,next) => {
    let id = req.params.id
    let todos = data[id]
    res.json(todos)
})
app.post('/addTask/:user',(req,res) => {
    let usr = req.params.user
    let body = req.body
    let date = new Date().toLocaleDateString()
    let time = new Date().toLocaleTimeString()
    let taskId = generateId()
    let task = {id: taskId,title: body.taskTitle,descr: body.taskDescr,date,time,done:false}
    data[usr].unshift(task)
    let jsonData = JSON.stringify(data)
    fs.writeFileSync('./todos.json',jsonData)
    res.json(data[usr])
})
app.post('/updateTasks/:user',(req,res) => {
    let usr = req.params.user
    let body = req.body
    body.forEach(ele => {
        let action = ele.action
        let usrId = ele.id
        let task = {id: ele.id,title: ele.taskTitle,descr: ele.taskDescr,date: ele.date,time: ele.time,done: ele.done}
        switch(action){
            case 'addTask':
                data[usr].unshift(task)
                break
            case 'removeTask':
                data[usr] = data[usr].filter(el => el.id != usrId)
                break
            case 'mark':
                data[usr].forEach(el => {
                    if(el.id == ele.id){
                        el.done = ele.done
                    }
                })
                break
            default:
                throw new Error(`Error processing the command ${action}`)
                break
        }
    })
    let jsonData = JSON.stringify(data)
    fs.writeFileSync('./todos.json',jsonData)
    res.json(data[usr])
})
app.listen(3000,() => console.log('Server listening'))