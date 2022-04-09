const express = require('express')
const cors = require("cors")
const path = require('path');

const app = express()

const port = 3000
let tasks = []
let count = 0
let done = false
let aboutToUpdate = undefined
let updatedId = undefined

app.use(cors())
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({limit: '50mb', extended: true}));



app.set("view engine", "ejs");

app.get('/',(req, res)=>{
     res.render('index',{ tasks:tasks, taskToUpdate:undefined, index:undefined}) 
    //res.render('index')
})
app.get('/getAll',(req,res)=>{
    res.json({tasks:tasks})
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
    console.log(tasks)
    res.json({task:task})
})
app.put('/update',(req,res)=>{
    const task = req.body.task
    const id = aboutToUpdate
    aboutToUpdate=undefined
    const updatingTask = tasks.find(task => task.id === id)  
    console.log(updatingTask)
    for (let task of tasks) {
        if(task.id === id){
            task.task = req.body.task.description
        }
    }
    //task = task.description
    console.log(tasks)
    updatedId = undefined
    res.json({task:updatingTask})

})
app.post('/edit',(req,res)=>{
    updatedId = Number(req.body.id)
    aboutToUpdate = updatedId
    console.log(tasks)
    console.log("edit",updatedId)
    const updatingTask = tasks.find(task => task.id === updatedId)
    console.log('updatingTaks',updatingTask)
    const task = updatingTask.task
    res.json({task:task})
    /* res.render('index',{tasks:tasks, taskToUpdate:task,index:updatingTask.id}) */
})
app.delete('/delete',(req,res)=>{
    console.log(req.body)
    const deletedTask = tasks.find(task => task.id === Number(req.body.id))
    const updatedTasks = tasks.filter(task => task.id !== Number(req.body.id) )
    console.log(updatedTasks)
  /*   if(updatedTasks.length>0){
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
    } */
    tasks=updatedTasks
    console.log("After delete",tasks)
    res.json({task:deletedTask})
})
app.put('/done',(req,res)=>{
    const id = Number(req.body.id)
    const updatingTask = tasks.find(task => task.id === id)  
    console.log(updatingTask)
    
    if( updatingTask.status === "pending"){
        updatingTask.status = 'done'
    }else{
        updatingTask.status = 'pending'
    }
    res.json({task:updatingTask})
})

app.listen(3000,()=>{
    console.log(`Server up and running in port ${port}`)
})