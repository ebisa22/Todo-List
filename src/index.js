import "./styles/style.css";

const signLink=document.querySelector("#sign");
const logLink=document.querySelector("#log");
const aboutLink=document.querySelector("#about");
const formContainer=document.querySelector(".form-container");
const mainBody=document.querySelector(".main-body");
const mainContainer=document.querySelector(".title-container");
const aboutDialog=document.querySelector("#aboutDialog");
const closeLink=document.querySelector(".close-link");
const submitBtn=document.querySelector("#submit");

const userName=document.querySelector("#username");
const phoneNumber=document.querySelector("#phonenumber");
const password=document.querySelector("#password");
const forgotLink=document.querySelector("#forgot");
//displays the about dialog at the start
 // Show About dialog only on first visit
if (!localStorage.getItem("firstVisitDone")) {
  aboutDialog.showModal();
  localStorage.setItem("firstVisitDone", "true");
}

signLink.addEventListener("click",(e)=>{
    mainBody.classList.add("half-body");
    mainContainer.classList.add("half-cont");
   formContainer.style.display="flex";
   formContainer.classList.remove("log-mode");
   submitBtn.textContent = "Sign Up";
})

logLink.addEventListener("click",(e)=>{
    mainBody.classList.add("half-body");
    mainContainer.classList.add("half-cont");
    formContainer.style.display = "flex";
    formContainer.classList.add("log-mode");
    submitBtn.textContent="Log in";
})

aboutLink.addEventListener("click",(e)=>{
    aboutDialog.showModal();
})

closeLink.addEventListener("click",(e)=>{
    aboutDialog.close();
})

submitBtn.addEventListener("click",(e) => {
  e.preventDefault();
  if (e.target.textContent == "Sign Up") {
    if (localStorage.getItem(`username`) == userName.value.trim()) {
      alert("This username is registered, Log in please");
      return;
    }
    localStorage.setItem("username", userName.value.trim());
    localStorage.setItem("phone", phoneNumber.value.trim());
    localStorage.setItem("password", password.value.trim());
    //direct to main page
    window.location.href = "main.html";
  } else if (e.target.textContent == "Log in") {
    if (userName.value.trim() != localStorage.getItem("username")) {
      alert("Incorrect username");
      return;
    } else if (password.value.trim() != localStorage.getItem("password")) {
      alert("Incorrect password");
      return;
    }
    //direct to main page
    window.location.href = "main.html";
  }
 
})
 
 forgotLink.addEventListener("click",(e)=>{
    e.preventDefault();
    let username=(prompt("Enter your username")).trim();
    if(!username)
    {
        alert("Enter valid username");
        return;
    }

    let phone=prompt("Enter your phone number(09xxxxxxxx)").trim();
       if (!phone) {
         alert("Enter valid phone number");
         return;
       }
    if(phone==localStorage.getItem("phone")){
            alert(`Your password:"${localStorage.getItem("password")}"`)
    }
    else{
           alert("Incorrect phone number or username");
           return;
    }
 })

aboutDialog.addEventListener("click", (e) => {
  const rect = aboutDialog.getBoundingClientRect();

  const x = e.clientX;
  const y = e.clientY;

  const outside =
    x < rect.left || x > rect.right || y < rect.top || y > rect.bottom;

  if (outside) {
    aboutDialog.close();
  }
});
