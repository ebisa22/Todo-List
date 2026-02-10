 
import { id } from "date-fns/locale";
import { Task } from "./models.js";
import "./styles/main.css";
import { differenceInCalendarDays,format} from "date-fns";
 
const main = (() => {
  let flagProject=false;
  let flagTask=false;
  let filterProj;
  let filterTask;
  const Events = {};
  let currentProj;
  let currentTask;
  let currentCheckBox;

  //capitalizing function
function capitalize(str) {
  if (!str) 
    return "";
  return str[0].toUpperCase() + str.slice(1).toLowerCase();
}
  const cacheDom = {
    usernamePara:document.querySelector("#username-para"),
    addProject: document.querySelector(".header"),
    projectContainer: document.querySelector(".proj-input"),
    projectInput: document.querySelector(".proj-input input"),
    yesProject: document.querySelector(".proj-input .yes"),
    noProject: document.querySelector(".proj-input .no"),
    myProjectContainer: document.querySelector(".my-container"),
    defProjectContainer: document.querySelector(".project-container"),

    deleteProjectDialog: document.querySelector(".proj-del-dialog"),
    deleteYesProj: document.querySelector(".ok-del"),
    deleteNoProj: document.querySelector(".no-del"),

    taskAddLink: document.querySelector(".add-link"),
    taskDialog: document.querySelector("#task-form"),
    addTask: document.querySelector(".task-btns .add"),
    cancelTask: document.querySelector(".task-btns .cancel"),

    titleInput: document.querySelector("#task-title"),
    dueDateInput: document.querySelector("#task-date"),
    dueTimeInput: document.querySelector("#task-time"),
    projectOptions: document.querySelector(".proj-options"),

    todayContainer: document.querySelector(".today-cont"),
    tomorrowContainer: document.querySelector(".tomorrow-cont"),
    allContainer: document.querySelector(".all-cont"),

    deleteTaskDialog: document.querySelector(".task-del-dialog"),
    deleteYesTask: document.querySelector(".ok-del-task"),
    deleteNoTask: document.querySelector(".no-del-task"),

    sideRight: document.querySelector(".side-right"),
    sideTitle: document.querySelector(".side-title"),
    sideTime: document.querySelector(".side-time"),
    todoContainer: document.querySelector(".todo-container"),
    addTodoBtn: document.querySelector("#add-todo"),
    addTodoInput: document.querySelector("#todoInp"),
  };
   //LISTING TODOS FUNCtion
    
  function listTodo() {
    if (!flagTask ||
       !localStorage.getItem("totalTask")
      ) return;
       
      if(!(document.querySelector(".active-task"))){
        cacheDom.sideTitle.textContent="";
        cacheDom.sideTime.textContent="";
        cacheDom.todoContainer.textContent="";
        cacheDom.sideRight.classList.add("hidden-right");
        return;
      }

    let totalTask = JSON.parse(localStorage.getItem("totalTask"));
    totalTask = toDateFunction(totalTask);
    let task;

    for (let temptask of totalTask) {
      if (temptask.id == filterTask) {
        task = temptask;
        break;
      }
    }
      if(!task){
        return;
            }

    cacheDom.sideTitle.textContent = task.title;
    if (task.project == "daily") {
      const now = new Date();
      cacheDom.sideTime.textContent = format(now, "MMM d, yyyy");
    } else {
      const date = task.dueDate;
      cacheDom.sideTime.textContent = format(date, "MMM d, yyyy");
    }
    //clears todo list container
    cacheDom.todoContainer.innerHTML = "";

    //if there is no todo it returns
    if (task.checklist.length == 0) {
      return;
    }

    for (let todo of task.checklist) {
      const li = document.createElement("li");
      const tick = document.createElement("p");
      tick.classList.add("tick");
      tick.textContent = "✓";

      const todoPara = document.createElement("p");
      todoPara.classList.add("todo-para");
      todoPara.textContent = todo;

      const delIcon = document.createElement("div");
      delIcon.classList.add("del-todo");
      delIcon.textContent = "❌";
      li.append(tick, todoPara, delIcon);
      cacheDom.todoContainer.appendChild(li);
    }
  }

  //tochange date string backto date object 
  function toDateFunction(totalTask){
      
      for(let task of totalTask){
        task.dueDate=new Date(task.dueDate);
        task.dueTime=new Date(task.dueTime);
      }
      return totalTask;
  }

  const counter={
     today:0,
     tomorrow:0,
     all:0,
     daily:0,
     work:0,
     travel:0,
     education:0,
     my:0,
  }

  function displayCounter(){
    for(let proj in counter)
     {
      const counterContainer=document.querySelector(`#${proj}`);
      const count=counterContainer.querySelector(".count");
      count.textContent=counter[proj];
      counter[proj]=0;
     }
 
  }

   function counterFunction(){
    if(!localStorage.getItem("totalTask")){
      return;
    }
      
      let now=new Date();
      let total=JSON.parse(localStorage.getItem("totalTask"));
      total=toDateFunction(total);
      for(let task of total){
        if(task.project=="daily"){
          counter.daily++;
          counter.today++;
        }

        else if(task.project=="work"){
          counter.work++;
          if(differenceInCalendarDays(task.dueDate,now)==0){
            counter.today++;
          }
          else if(differenceInCalendarDays(task.dueDate,now)==1){
            counter.tomorrow++;
          }
          else{
            counter.all++;
          }
          
        }

        else if(task.project=="travel"){
          counter.travel++;
          if(differenceInCalendarDays(task.dueDate,now)==0){
            counter.today++;
          }
          else if(differenceInCalendarDays(task.dueDate,now)==1){
            counter.tomorrow++;
          }
          else{
            counter.all++;
          }
          
        }
        
        else if(task.project=="education"){
          counter.education++;
          if(differenceInCalendarDays(task.dueDate,now)==0){
            counter.today++;
          }
          else if(differenceInCalendarDays(task.dueDate,now)==1){
            counter.tomorrow++;
          }
          else{
            counter.all++;
          }
          
        }
        else{
          counter.my++;
           if (differenceInCalendarDays(task.dueDate, now) == 0) {
             counter.today++;
           } else if (differenceInCalendarDays(task.dueDate, now) == 1) {
             counter.tomorrow++;
           } else {
             counter.all++;
           }
        }
      }
     
      displayCounter();
   }

 
 function storeDefaultProjects() {

    if(localStorage.getItem("projects"))
        return;
    const projects = ["daily", "work", "travel", "education"];

    if(localStorage.getItem("projects")){
    localStorage.removeItem("projects");
    }
    localStorage.setItem("projects", JSON.stringify(projects));
  }
    
  
  function subscribe(event, fName) {
    if (!Events[event]) Events[event] = [];

    Events[event].push(fName);
  }

  function publish(eventName, parameter) {
    for (let event of Events[eventName]) {
      event(parameter);
    }
  }
  //clearing functions

  function clearAllTasks(project){
         if (!localStorage.getItem("totalTask")) 
               return;

         let totalTask = JSON.parse(localStorage.getItem("totalTask"));
         totalTask=totalTask.filter(task=>{
            return task.project!=project;
         });
         localStorage.removeItem("totalTask");
         localStorage.setItem("totalTask",JSON.stringify(totalTask));
  } 

  //project functions
  function updateOptions() {
    const projects=JSON.parse(localStorage.getItem("projects"));
    cacheDom.projectOptions.innerHTML="";
    for (let project of projects) {
      const option = document.createElement("option");
      option.value = project;
      option.textContent = project;
      cacheDom.projectOptions.appendChild(option);
    }
  }

  function listProjects() {
    const projects=JSON.parse(localStorage.getItem("projects"));
    cacheDom.myProjectContainer.innerHTML = "";
    for (let i = 0; i < projects.length; ++i) {
      if (i < 4) continue;
      const myProj = document.createElement("div");
      myProj.classList.add("myproj");

      const left = document.createElement("div");
      left.classList.add("left");
      const sharp = document.createElement("p");
      sharp.textContent = "#";
      sharp.classList.add("hash");
      const name = document.createElement("p");
      name.textContent = `${projects[i]}`;
      name.classList.add("name");
      left.append(sharp, name);
      myProj.appendChild(left);
      cacheDom.myProjectContainer.appendChild(myProj);
      cacheDom.projectInput.value = "";
      cacheDom.projectContainer.style.display = "none";
    }
  }

  function showPojectInput() {
    cacheDom.projectContainer.style.display = "flex";
  }

  function closeProjectInput() {
    cacheDom.projectInput.value = "";
    cacheDom.projectContainer.style.display = "none";
  }

  function addProject() {
      const projects=JSON.parse(localStorage.getItem("projects"));
       localStorage.removeItem("projects");
    if (!cacheDom.projectInput.value) 
        return;
      let content = cacheDom.projectInput.value.trim();
      content=capitalize(content);
      projects.push(content);
     localStorage.setItem("projects",JSON.stringify(projects));
    listProjects();
    updateOptions();
  }

  function projectClicked(e) {
    let tempProj = e.target.closest(".myproj");
    if (!tempProj)
         return;
    e.preventDefault();
    cacheDom.deleteProjectDialog.showModal();
    const proj = tempProj.querySelector(".name");
    currentProj = proj.textContent;
  }

  function deleteProject() {
    //if it is default project just clears all tasks
    if(
      currentProj=="daily"||
      currentProj=="work"||
      currentProj=="travel"||
      currentProj=="education"
    ){
      clearAllTasks(currentProj);
      listTasks();
      counterFunction();
      const message = cacheDom.deleteProjectDialog.querySelector("h3");
        message.textContent = "";
        message.innerHTML =
          "This Will delete all tasks inside this project<br>Are you sure you want to delete this?";
        currentProj = "";
        cacheDom.deleteProjectDialog.close();
    }
    //else if it is other project it also delete the project
    else{
    const projects = JSON.parse(localStorage.getItem("projects"));
    let index = projects.indexOf(currentProj);
    if (index != -1) 
        {
            projects.splice(index, 1);
        }
     localStorage.removeItem("projects");
     localStorage.setItem("projects",JSON.stringify(projects));
     listProjects();
    updateOptions();
    clearAllTasks(currentProj);
    listTasks();
    counterFunction();
     cacheDom.deleteProjectDialog.close();
      }
  }

  function cancelDelProject() {
    cacheDom.deleteProjectDialog.close();
    const message = cacheDom.deleteProjectDialog.querySelector("h3");
    message.textContent ="";
    message.innerHTML ="This Will delete all tasks inside this project<br>Are you sure you want to delete this?";
    currentProj = "";
  }

  function defProjectClicked(e){
    e.preventDefault();
    let tempProj=e.target.closest(".proj");
    if(!tempProj)
      return;
    const message=cacheDom.deleteProjectDialog.querySelector("h3");
    message.textContent="Do you want to clear all tasks under this category ?";
    cacheDom.deleteProjectDialog.showModal();
   currentProj=tempProj.id;
  }
  //filter function
  function filterList(){
    const now=new Date();
    let totalTask = JSON.parse(localStorage.getItem("totalTask"));
    totalTask = toDateFunction(totalTask);

    //clears previous task for rebuild
    const taskContainer = document.querySelectorAll(".task-container");
    for (let container of taskContainer)
       container.innerHTML = "";

    for (let task of totalTask) {
      //filtering condition
      if(task.project!=filterProj)
        continue;

      //if it is today's task
      if (
        differenceInCalendarDays(task.dueDate, now) == 0 ||
        task.project == "daily"
      ) {
        const taskContainer = cacheDom.todayContainer.querySelector(
          ".today-cont .task-container",
        );
        const taskDiv = document.createElement("div");
        taskDiv.classList.add("task");
        const input = document.createElement("input");
        input.type = "checkbox";
        const title = document.createElement("p");
        title.classList.add("task-name");
        title.id = task.id;
        title.textContent = task.title;

        const timePara = document.createElement("p");
        timePara.classList.add("time-para");

        timePara.textContent = format(task.dueTime, "hh:mm aa");
        taskDiv.append(input, title, timePara);
        taskContainer.appendChild(taskDiv);
      }
      //if it is tomorrow's task
      else if (differenceInCalendarDays(task.dueDate, now) == 1) {
        const taskContainer = cacheDom.tomorrowContainer.querySelector(
          ".tomorrow-cont .task-container",
        );
        const taskDiv = document.createElement("div");
        taskDiv.classList.add("task");
        const input = document.createElement("input");
        input.type = "checkbox";
        const title = document.createElement("p");
        title.classList.add("task-name");
        title.textContent = task.title;
        title.id = task.id;
        const timePara = document.createElement("p");
        timePara.classList.add("time-para");
        timePara.textContent = format(task.dueTime, "hh:mm aa");
        taskDiv.append(input, title, timePara);
        taskContainer.appendChild(taskDiv);
      }
      //if it is any other day's task
      else {
        const taskContainer = cacheDom.allContainer.querySelector(
          ".all-cont .task-container",
        );
        const taskDiv = document.createElement("div");
        taskDiv.classList.add("task");
        const input = document.createElement("input");
        input.type = "checkbox";
        const title = document.createElement("p");
        title.classList.add("task-name");
        title.textContent = task.title;
        title.id = task.id;
        const timePara = document.createElement("p");
        timePara.classList.add("time-para");
        timePara.textContent = format(task.dueDate, "MMM d, yyyy");
        taskDiv.append(input, title, timePara);
        taskContainer.appendChild(taskDiv);
      }
    }
  }
    //task functions

  function listTasks() {
        const now =new Date();
        if (!localStorage.getItem("totalTask"))
             return;
        if(flagProject)
        {
          filterList();
          return;
        }
       let totalTask = JSON.parse(localStorage.getItem("totalTask"));
        totalTask=toDateFunction(totalTask);
      
        //clears previous task for rebuild
        const taskContainer=document.querySelectorAll(".task-container");
        for(let container of taskContainer)
            container.innerHTML="";
      for(let task of totalTask){
     //if it is today's task
      if(
        (differenceInCalendarDays(task.dueDate,now))==0 ||
         task.project=="daily"
    ){
        const taskContainer=(cacheDom.todayContainer).querySelector(".today-cont .task-container");
         const taskDiv=document.createElement("div");
        taskDiv.classList.add("task");
        const input=document.createElement("input");
        input.type="checkbox";
        const title=document.createElement("p");
        title.classList.add("task-name");
        title.id=task.id;
        title.textContent=task.title;

        const timePara = document.createElement("p");
        timePara.classList.add("time-para");
       
        timePara.textContent=format(task.dueTime,"hh:mm aa");
       taskDiv.append(input,title,timePara);
       taskContainer.appendChild(taskDiv);
    }  
   //if it is tomorrow's task
   else if(
        (differenceInCalendarDays(task.dueDate,now))==1 
    ){
        const taskContainer=(cacheDom.tomorrowContainer).querySelector(".tomorrow-cont .task-container");
        const taskDiv=document.createElement("div");
        taskDiv.classList.add("task");
        const input=document.createElement("input");
        input.type="checkbox";
        const title=document.createElement("p");
        title.classList.add("task-name");
        title.textContent=task.title;
         title.id = task.id;
        const timePara = document.createElement("p");
        timePara.classList.add("time-para");
        timePara.textContent=format(task.dueTime,"hh:mm aa")
       taskDiv.append(input,title,timePara);
       taskContainer.appendChild(taskDiv);
    }  
   //if it is any other day's task
   else{
    
    const taskContainer=(cacheDom.allContainer).querySelector(".all-cont .task-container");
    const taskDiv=document.createElement("div");
        taskDiv.classList.add("task");
        if(differenceInCalendarDays(task.dueDate,now)<0 && task.project!="daily")
        {
          taskDiv.classList.add("overdue");
        }
        const input=document.createElement("input");
        input.type="checkbox";
        const title=document.createElement("p");
        title.classList.add("task-name");
        title.textContent=task.title;
         title.id = task.id;
        const timePara = document.createElement("p");
        timePara.classList.add("time-para");
        timePara.textContent=format(task.dueDate,"MMM d, yyyy");
       taskDiv.append(input,title,timePara);
       taskContainer.appendChild(taskDiv);
    }  
    }


    listTodo();
  }

   //filtering functions
   function filterProjectClicked(e){
      const others=document.querySelectorAll(".proj");
      let previousState=e.currentTarget.classList.contains("active");
      for(let otherProj of others){
        otherProj.classList.remove("active");
      } 
      if(previousState){
        e.currentTarget.classList.remove("active");
      }
      else{
         e.currentTarget.classList.add("active");
      }
      //flag condition
      if(document.querySelector(".active"))
        flagProject=true;
      else
        flagProject=false;

      filterProj=e.currentTarget.id;
      listTasks();
   }


  function showTaskDialog() {
    cacheDom.taskDialog.showModal();
  }

  function clearInputs() {
    cacheDom.projectOptions.value = "";
    cacheDom.titleInput.value = "";
    cacheDom.dueDateInput.value = "";
    cacheDom.dueTimeInput.value = "";
  }

  function cancelTaskFrom() {
    clearInputs();
    cacheDom.taskDialog.close();
  }

  function validateInput() {
    let complete = true;
    if (
      cacheDom.projectOptions.value == "" ||
      cacheDom.titleInput.value == "" ||
      cacheDom.dueTimeInput.value == ""
    )
      complete = false;

    return complete;
  }

  function addTask(e) {
      e.preventDefault();
    if (!validateInput()) {
      alert("Enter complete information !");
      return;
    }
    let [hr, mm] = cacheDom.dueTimeInput.value.split(":");
    let date = new Date(cacheDom.dueDateInput.value);
    let time = new Date(1970, 0, 1, Number(hr), Number(mm), 0);
    if (differenceInCalendarDays(date, new Date()) < 0) {
      alert("You can't schedule in the past!");
      return;
    }
    let title= cacheDom.titleInput.value.trim();
    title=capitalize(title);
    const task = new Task(
      cacheDom.projectOptions.value,
       title,
      [],
      false,
      date,
      time,
    );

   let totalTask;
    if(!localStorage.getItem("totalTask"))
        totalTask=[];
    else{
        totalTask=JSON.parse(localStorage.getItem("totalTask"));
        localStorage.removeItem("totalTask")
    }
    totalTask.push(task);
    localStorage.setItem("totalTask",JSON.stringify(totalTask));
    listTasks();
    clearInputs();
    cacheDom.taskDialog.close();
    counterFunction();
  }

  function checkBoxClicked(e){
    if(!(e.target.type=="checkbox"))
      return;
    cacheDom.deleteTaskDialog.showModal();
    const taskContainer=e.target.closest(".task");
    const taskName = taskContainer.querySelector("p.task-name");
    currentTask=taskName.id;
    currentCheckBox=e.target;
  }

  function cancelDelTask(){
    cacheDom.deleteTaskDialog.close();
    currentTask="";
    currentCheckBox.checked=false;
    currentCheckBox="";
  }

  function deleteTask(){
    let totalTask=JSON.parse(localStorage.getItem("totalTask"));
     localStorage.removeItem("totalTask");

      totalTask=totalTask.filter(task=>{
        return task.id!=currentTask;
      });
      localStorage.setItem("totalTask",JSON.stringify(totalTask));
      listTasks();
      cacheDom.deleteTaskDialog.close();
      currentCheckBox="";
      counterFunction();
  }

  function toggleTaskMenu(e){
     e.preventDefault();
 
     const container=e.target.closest(".time-cont");
     container.classList.toggle("hidden");
 
  }
  
  function filterTaskClicked(e){
     if(
      !e.target.closest(".task")||
      e.target.type=="checkbox"
    )
       return;
      const task=e.target.closest(".task");
    const previousState=task.classList.contains("active-task")
    const others=document.querySelectorAll(".task");
    for(const task of others){
      task.classList.remove("active-task");
    }
    if(previousState){
      task.classList.remove("active-task");
      cacheDom.sideRight.classList.add("hidden-right");
      filterTask="";
      flagTask=false;
    }
    else{
      task.classList.add("active-task");
      cacheDom.sideRight.classList.remove("hidden-right");
      filterTask=task.querySelector(".task-name").id;
        flagTask=true;
        listTodo();
    }
  }
  
  function addTodo(){
      let todo=cacheDom.addTodoInput.value.trim();
      todo=capitalize(todo);
      if(!todo){
        alert("Add todo checklist first ");
        return;
      }
      const totalTask=JSON.parse(localStorage.getItem("totalTask"));
      

      for(let task of totalTask){
        if(task.id==filterTask){
           task.checklist.push(todo);
           break;
        }
      }
    
      localStorage.removeItem("totalTask");
      localStorage.setItem("totalTask",JSON.stringify(totalTask));
      listTodo();
      cacheDom.addTodoInput.value="";
  }

  function deleteTodo(e){
    if(!e.target.classList.contains("del-todo"))
      return;

    const li=e.target.closest("li");
    const todo=li.querySelector(".todo-para").textContent;

    let totalTask=JSON.parse(localStorage.getItem("totalTask"));
     for(let task of totalTask){
      if(task.id==filterTask){
          //loop through checklist
           task.checklist=(task.checklist).filter(check=>{
            return check!=todo;
           })
           break;
      }
     }
     localStorage.removeItem("totalTask");
     localStorage.setItem("totalTask",JSON.stringify(totalTask));
     listTodo();
  }

  function bindEvent() {
    cacheDom.addProject.addEventListener("click", showPojectInput);
    cacheDom.noProject.addEventListener("click", closeProjectInput);
    cacheDom.yesProject.addEventListener("click", addProject);
    cacheDom.myProjectContainer.addEventListener("contextmenu", projectClicked);
    cacheDom.deleteYesProj.addEventListener("click", deleteProject);
    cacheDom.deleteNoProj.addEventListener("click", cancelDelProject);
    cacheDom.defProjectContainer.addEventListener("contextmenu",defProjectClicked);

    cacheDom.taskAddLink.addEventListener("click", showTaskDialog);
    cacheDom.cancelTask.addEventListener("click", cancelTaskFrom);
    cacheDom.addTask.addEventListener("click", addTask);

    const allTask=document.querySelectorAll(".time-cont");
    for(const task of allTask){
      task.addEventListener("change",checkBoxClicked);
    }
    const allTaskPara=document.querySelectorAll(".menu-para");
     for (const para of allTaskPara) {
       para.addEventListener("click", toggleTaskMenu);
     }
    cacheDom.deleteNoTask.addEventListener("click",cancelDelTask);
    cacheDom.deleteYesTask.addEventListener("click",deleteTask);

    //fitering project events
    const defaultProjects=document.querySelectorAll(".proj");
    for(const proj of defaultProjects){
      proj.addEventListener("click",filterProjectClicked);
    }
      const allSecond=document.querySelectorAll(".task-container");
     for (const task of allSecond) {
       task.addEventListener("click",filterTaskClicked);
     }
     //todo add event listener
     cacheDom.addTodoBtn.addEventListener("click",addTodo);
     cacheDom.todoContainer.addEventListener("click",deleteTodo);
  }
   
  function addUserName(){
     let username=localStorage.getItem("username");
       if(username)
       cacheDom.usernamePara.textContent=username;
      else{
        cacheDom.usernamePara.textContent="unknown"
      }
  }

  function init() {
     storeDefaultProjects();
      listProjects();
      listTasks();
      updateOptions();
      counterFunction();
      bindEvent();
      addUserName();
  }

  return { init, subscribe };
})();
 
   main.init();
 
 