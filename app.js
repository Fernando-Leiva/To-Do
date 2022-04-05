const express = require('express')
const cors = require("cors")
const path = require('path');

const app = express()

const port = 3000
let tasks = []
let count = 0
let done = false
let index = undefined
let updatedId = undefined

app.use(cors())
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({limit: '50mb', extended: true}));



app.set("view engine", "ejs");

app.get('/',(req, res)=>{
    res.render('index',{ tasks:tasks, taskToUpdate:undefined, index:undefined})
})
app.post('/task',(req,res)=>{
    const description = req.body.task
    const task = {
        id: count, 
        task:description,
        status:'pending'
    }
    tasks.push(task)
    count = count + 1

    res.redirect('/')
    //res.render('index',{ tasks })
})
app.post('/:id/task',(req,res)=>{
 
    const id = req.params.id
    const description = req.body.task
    console.log(tasks[id])
    tasks[id].task = description
    console.log(tasks)
    updatedId = undefined

    res.redirect('/')

})
app.post('/:id/update',(req,res)=>{
   
    updatedId = Number(req.params.id)
    const updatingTask = tasks.find(task => task.id === Number(req.params.id))
    console.log('updatingTaks',updatingTask)
    const task = updatingTask.task
    res.render('index',{tasks:tasks, taskToUpdate:task,index:updatingTask.id})
})
app.post('/:id/delete',(req,res)=>{
    console.log(req.params.id)
    const updatedTasks = tasks.filter(task => task.id !== Number(req.params.id) )

    console.log(updatedTasks)
    if(updatedTasks.length>0){
        tasks = updatedTasks.map((task,index)=> {
            return {
                id:index,
                task:task.task,
                status:task.status
            }
        })
        count=tasks.length
    }else{
        tasks=[]
        count=0
    }
    console.log(tasks)
    res.redirect('/')
})
app.post('/:id/done',(req,res)=>{
    if( tasks[req.params.id].status === "pending"){
        tasks[req.params.id].status = 'done'
    }else{
        tasks[req.params.id].status = 'pending'
    }
    res.redirect('/')
})

app.listen(3000,()=>{
    console.log(`Server up and running in port ${port}`)
})