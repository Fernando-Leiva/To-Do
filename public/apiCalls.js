

const url='http://localhost:3000'
let edit = false



// Set new tasks into the list.  
const setTaskToList = (child) => {
    const divFather = document.getElementById('list')
    divFather.innerHTML += child 
}


// Create the child node to add it into the list of to-dos.
const createChild = (task,set=false) => {
    let child = `
        <div id="${task.id}" value="${task.id}">
            <input type="checkbox" name="${task.id}" onclick="handleStatus(${task.id})" ${task.status=== 'done' &&("checked")}/>
            ${task.status === 'done' ? `<s> ${task.task}</s>`:` <span> ${task.task} </span>`}
            <section>
                <button onClick="handleEdit(${task.id})" id="update" value="${task.id}" ${task.status === 'done'&&("disabled") } >
                    <i class="fa-solid fa-pen"></i>
                </button>
                <button  id="delete" value="${task.id}" onClick="handleDelete(${task.id})"> 
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </section>
        </div>
    `
    if(!set){
        return setTaskToList(child)
    }else{
        return child
    }
}
const getStatusEdit =()=>{
    return edit
}

let divDownLayer = document.getElementById('downLayer').innerHTML = `
    <input class="text" type="text" id="inputTextField"/>
    <button class="button" id="btnAdd"  onClick="addNewTask()"> Add </button>
    <button class="button" id="btnUpdate" onClick="handleUpdate()"> Edit </button>
` 
// Task button to send data to the server.
const addNewTask = async ()=>{
    let inputTextField = document.getElementById('inputTextField').value
    try {
        const response = await fetch(`${url}/task`,{
            method:'POST',
            headers: {
                'Content-Type': 'application/json'   
            },
            body: JSON.stringify({task:inputTextField})
        })
        const body = await response.json()
        createChild(body.task)
        console.log("Esto recibi",body.task)
    } catch (error) {
        console.error(error)
    }finally{
        document.getElementById('inputTextField').value = "" 
    }
}
// Get all tasks.
const handleGetTasks = async () => {
    try {
        const response = await fetch(`${url}/getAll`,{
            method:'GET',
            headers:{
                'Content-Type': 'application/json'   
            }
        })
        const body = await response.json()
        const tasks = body.tasks
        console.log("tasks",tasks)
        if(tasks instanceof Array && tasks.length > 0){
            tasks.forEach(task => createChild(task))
        }
    } catch (error) {
        console.log(error)
    }
}

// Find the task to edit.
const handleEdit = async (id) => {
    
        edit=!!edit
        console.log("edit",id)
        const respose = fetch(`${url}/edit`,{
            method:'POST',
            headers:{
                'Content-Type': 'application/json'   
            },
            body:JSON.stringify({id:id})
        })
        .then(res => res.json())
        .then(data => {
                document.getElementById('inputTextField').value=data.task
                edit = !!edit
            }
        ).catch(error => {
            console.log(error)
        })
       /*  console.log("response", (await respose).json())
        const body = await respose.json()
        const task = body.task
        document.getElementById('inputTextField').innerHTML = task.task
         */
   
}

// Update the task.
const handleUpdate = async() =>{
    try {
        let inputTextField = document.getElementById('inputTextField').value
        const respose = await fetch(`${url}/update`,{
            method:"PUT",
            headers:{
                'Content-Type': 'application/json'   
            },
            body:JSON.stringify({task:{description:inputTextField}})
        })
        const body = await respose.json()
        document.getElementById(String(body.task.id)).innerHTML = createChild( body.task,true); 
        document.getElementById('inputTextField').value=""
        console.log("Task updated",body) 
    } catch (error) {
        console.log(error)
    }
}

// Delete button this is for removing tasks.
const handleDelete = async (id) => {
    try {
        //const id = document.getElementById('delete').value
        const response = await fetch(`${url}/delete`,{
            method:'DELETE',
            headers:{
                'Content-Type': 'application/json'   
            },
            body:JSON.stringify({id:id})
        })
        let list = document.getElementById("list");
        let d_nested = document.getElementById(String(id));
        list.removeChild(d_nested);
        const body = await response.json()
        console.log("Eliminado",body)
       
    } catch (error) {
        console.error(error)
    }
}

const handleStatus =  async (id) => {
  console.log(id)
  try {
      const response = await fetch(`${url}/done`,{
          method:'PUT',
          headers:{
            'Content-Type': 'application/json'   
          },
          body:JSON.stringify({id:id})
      })
      const body = await response.json()
      console.log('bodu',body.task)

     document.getElementById(String(id)).innerHTML = createChild( body.task,true); 
   
  } catch (error) {
        console.log(error)   
  }
}

handleGetTasks()