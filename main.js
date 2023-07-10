var user_Id = '';
var offlineModeStatus = false;
var offlineActivities = [];
$('.loader').style.width = $('.app').offsetWidth + 'px';
var delay = 2000;
window.onload = () => {
    let id = localStorage.getItem('userId')
    if(!id){
        fetch('http://localhost:3000/')
        .then(response => response.json())
        .then(data => {
            localStorage.setItem('userId',data)
            user_Id = data 
            notify(`Welcome! You can start adding your tasks.`,'success')
        })
        .catch(err => {
            notify('An error occured while connecting to the server')
            $('.loader p').textContent = 'Sorry, try again later...'
            $('.loader p').style.color = '#fc0000'; $('.loader .spinner').style.borderBottomColor = '#fc0000'
        })
    }else{
        user_Id = id
        fetch(`http://localhost:3000/${user_Id}`)
        .then(response => response.json())
        .then(data => {
            let tojson = JSON.stringify(data)
            localStorage.setItem('tasks',tojson)
            render(data)
            setTimeout(() => {
                 $('.loader').style.display = 'none'
            },2000)
        })
        .catch(err => {
            notify('We encounted a problem while fetching your todos.')
            $('.loader p').textContent = 'Loading offline tasks...'
            setTimeout(() => {
                offlineModeStatus = true
                OfflineMode()
            },5000)
        })
    }
}

function OfflineMode(){
    notify('Switching to offline mode!','info')
    let data = localStorage.getItem('tasks')
    let obj = JSON.parse(data)
    render(obj)
    $('.loader p').textContent = 'Finishing up. Just a moment...'
    setTimeout(() => {
        $('.loader').style.display = 'none'
    },2000)
}

let isOpenOnce = false
const sse = new EventSource('http://localhost:3000/sse')
sse.onopen = function(){
    let len = offlineActivities.length
    if(!len){
        offlineModeStatus = false;
        setTimeout(() => {
            notify('Server connected and now in sync...','success')
        },5000)
    }else{
        fetch(`http://localhost:3000/updateTasks/${user_Id}`,{
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify(offlineActivities)
        })
        .then(response => response.json())
        .then(data => {
            localStorage.setItem('tasks',JSON.stringify(data))
            offlineActivities = []
            render(data)
            offlineModeStatus = false
            notify('Your todo now in sync with the server...','success')
            sse.close()
        })
        .catch(err => {
            offlineModeStatus = true
            notify('An error occured while syncing with the server...')
        })
    }
}
sse.onerror = (err) => {
    offlineModeStatus = true
}

function render(ele){
    let len = ele.length
    if(!len || !ele){
        $('.empty-todo').style.display = 'flex';
        $('.wrapper').style.display = 'none';
    }else{
        $('.wrapper').style.display = 'flex';
        $('.empty-todo').style.display = 'none';
        let tasks = '';
        ele.forEach(element => {
            let html = `<div class="todo" id=${element.id}>
            <div class="task">
            <h2> ${element.title} </h2>
            <p> ${element.descr} </p>
            <time> ${element.date} <span>${element.time}</span></time>
        </div>  
        <div class="topt">
            <button class="mark" title="mark as done">
                <img class="unmarked ${element.done ? 'hide': ''}" src="./img/unmarked.png">
                <img class="marked ${!element.done ? 'hide': ''}" src="./img/marked.png">
            </button>
            <button class="del" title="delete task">
                <img src="./img/delete.png">
            </button>
        </div></div>`
        tasks += html
        });
        $('.wrapper').innerHTML = tasks
    }
    loadDOM(1500)
}

function $(ele){
    return document.querySelector(ele)
}

$('.addTask').onclick = () => {
    $('.addTask').style.display = 'none';
    $('.task-form').style.display = 'flex';
    $('.input input').focus()
}

if(window.innerWidth <= 600){
$('.mobile-add').onclick = () => {
    $('.app').style.display = 'none'
    $('.sec2').style.display = 'flex'
    $('.input input').focus()
}
}

let input = $('input')

input.onpaste = () => {
    return false
}
$('.input textarea').onpaste = () => {
    return false
}

input.onfocus = (e) => {
    e.target.parentElement.style.borderColor = '#7d9bfd';
    $('.input label').style.fontSize = '0.7rem'
    $('.input label').style.color = '#0059ff'
}
input.onblur = (e) => {
    if(e.target.value == ""){
        $('.input label').style.fontSize = '0.8rem'
        $('.input label').style.color = '#111'
        e.target.parentElement.style.borderColor = 'rgba(10,10,10,0.2)';
    }else{
        e.target.parentElement.style.borderColor = 'rgba(10,10,10,0.1)';
    }
}
$('.input input').onkeypress = (e) => {
    let keybd = e.keyCode
    if(keybd == 13){
        $('.input textarea').focus()
    }
}

function notify(msg,type="error"){
    let mobDialog = document.querySelector('.mobiledlg')
    let dialog = document.querySelector('.dialog')
    dialog.style.display = 'flex';
    window.innerWidth > 600 ? mobDialog.style.display = 'none' : mobDialog.style.display = 'flex'
    $('.dialog p').textContent = msg
    $('.mobiledlg p').textContent = msg
    dialog.classList.add(type) 
    setTimeout(() => {
        dialog.style.display = 'none';
        mobDialog.style.display = 'none'
        dialog.classList.remove(type)
    },5000)
    $('.dialog button').onclick = () => {
        dialog.style.display = 'none'
        dialog.classList.remove(type)
    }
    $('.mobiledlg button').onclick = () => {
        mobDialog.style.dialog = 'none'
    }
}

$('.task-form form').onsubmit = (e) => {
    e.preventDefault()
    let taskTitle = input.value
    let taskDescr = $('.input textarea').value
    let data = {taskTitle,taskDescr}
    let vals = Object.values(data)
    let valuate = vals.every((ele) => {
        return(ele != "")
    })
    if(!valuate){
         notify('Fill all fields they are required')
    }else{
        input.value = ""
        $('.input textarea').value = ""
        if(!offlineModeStatus){
        fetch(`http://localhost:3000/addTask/${user_Id}`,{
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            localStorage.setItem('tasks',JSON.stringify(data))
            render(data)
            notify('Your todos has been updated!','success')
        })
        .catch(err => {
            notify('Oooops! We have trouble adding your task!')
        })
    }else{
        let taskId = Date.now().toString(36)
        data['id'] = taskId
        data['action'] = 'addTask'
        data['title'] = data['taskTitle']
        data['descr'] = data['taskDescr']
        data['date'] = new Date().toLocaleDateString()
        data['time'] = new Date().toLocaleTimeString()
        data['done'] = false
        offlineActivities.push(data)
        let offtasks = localStorage.getItem('tasks')
        let storeData = JSON.parse(offtasks)
        storeData.unshift(data)
        let tojson = JSON.stringify(storeData)
        localStorage.setItem('tasks',tojson)
        render(storeData)
        notify('Added to offline storage!','info')
    }
    }
}
let tnav = document.querySelectorAll('.tnav button')
tnav.forEach(ele => {
    ele.onclick = (e) => {
        let tasks = JSON.parse(localStorage.getItem('tasks'))
        $('.all').classList.remove('active'); $('.done').classList.remove('active'); $('.undone').classList.remove('active')
        if(e.target.classList.contains('done')){
            let done = tasks.filter(ele => ele.done == true)
            render(done)
        }
        if(e.target.classList.contains('undone')){
            let undone = tasks.filter(ele => !ele.done)
            render(undone)
        }
        if(e.target.classList.contains('all')){
            render(tasks)
        }
        e.target.classList.add('active')
    }
})

function loadDOM(delay){
setTimeout(() => {
    let taskdiv = document.querySelectorAll('.topt .mark')
    taskdiv.forEach(ele => {
        ele.addEventListener('click',(e) => {
            let tid = e.target.parentElement.parentElement.parentElement.id
            if(offlineModeStatus){
                let ltasks = JSON.parse(localStorage.getItem('tasks'))
                let edited = []
                ltasks.forEach(el => {
                    let bdone = el.done
                    if(el.id == tid){
                        el.done = !bdone
                        offlineActivities.push({action: 'mark',id: el.id,done: el.done})
                    }
                    edited.push(el)
                })
                e.target.classList.toggle('hide')
                if(e.target.nextElementSibling){
                    e.target.nextElementSibling.classList.toggle('hide')
                }
                if(e.target.previousElementSibling){
                    e.target.previousElementSibling.classList.toggle('hide')
                }
                localStorage.setItem('tasks',JSON.stringify(edited))
            }else{
                let marked = []
                let done
                let stasks = JSON.parse(localStorage.getItem('tasks'))
                stasks.forEach((ts) => {
                    let bdone = ts.done
                    if(ts.id == tid){
                        done = !bdone
                    }
                })
                let postedData = {action: 'mark',done,id: tid}
                marked.push(postedData)
                fetch(`http://localhost:3000/updateTasks/${user_Id}`,{
                    method: 'POST',
                    headers: {'Content-Type':'application/json'},
                    body: JSON.stringify(marked)
                })
                .then(response => response.json())
                .then(data => {
                    localStorage.setItem('tasks',JSON.stringify(data))
                    render(data)
                    notify('Action performed to the server','info')
                })
            }
        })
    })
    let deletebtn = document.querySelectorAll('.topt .del')
    deletebtn.forEach(ele => {
        ele.addEventListener('click',(e) => {
            let tid = e.target.parentElement.parentElement.parentElement.id
            if(offlineModeStatus){
                let store = JSON.parse(localStorage.getItem('tasks'))
                let del = store.filter(el => el.id != tid)
                localStorage.setItem('tasks',JSON.stringify(del))
                let activity = {action: 'removeTask',id: tid}
                offlineActivities.push(activity)
                $(`#${tid}`).remove()
            }else{
                let deleted = []
                let postedData = {action: 'removeTask',id: tid}
                deleted.push(postedData)
                fetch(`http://localhost:3000/updateTasks/${user_Id}`,{
                    method: 'POST',
                    headers: {'Content-Type':'application/json'},
                    body: JSON.stringify(deleted)
                })
                .then(response => response.json())
                .then(data => {
                    localStorage.setItem('tasks',JSON.stringify(data))
                    render(data)
                    notify('Action performed to the server','info')
                })
            }
        })
    })
    delay = 2000
},delay)
}

loadDOM(delay)