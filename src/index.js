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
   //if it is sign up
    if (e.target.textContent == "Sign Up") {
      //data validation
      if (
        !userName.value.trim() ||
        !phoneNumber.value.trim() ||
        !password.value.trim()
      ) {
        alert(
          "Please enter complete information (username,phonenumber and password)",
        );
        return;
      }
      //if the user already has account
      if (localStorage.getItem("username")) {
        alert("An account already exists on this device. Please log in.");
        return;
      }
      //store the data
      localStorage.setItem("username", userName.value.trim());
      localStorage.setItem("phonenumber", phoneNumber.value.trim());
      localStorage.setItem("password", password.value.trim());
      //clears the boxes
      userName.value = "";
      phoneNumber.value = "";
      password.value = "";
      //return to default layout
      mainBody.classList.remove("half-body");
      mainContainer.classList.remove("half-cont");
      formContainer.style.display = "none";
      //pass to main page
      window.location.href = "main.html";
    }
    //if it is log in
    else if (e.target.textContent == "Log in") {
      //data validation
      if (!userName.value.trim() || !password.value.trim()) {
        alert("Please enter both username and password");
        return;
      }
      //checks if the useris registered with username
      if (
        !localStorage.getItem("username") ||
        !localStorage.getItem("password")
      ) {
        alert("Please sign up first");
        return;
      }
      //checks if the user enterred correct password
      if (
        localStorage.getItem("username") != userName.value.trim() ||
        localStorage.getItem("password") != password.value.trim()
      ) {
        alert("Incorrect username or password");
        return;
      }
      //clears the boxes
      userName.value = "";
      password.value = "";
      //return to default layout
      mainBody.classList.remove("half-body");
      mainContainer.classList.remove("half-cont");
      formContainer.style.display = "none";

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
  if (username != localStorage.getItem("username")) {
    alert(`Incorrect username`);
    return;
  }
    let phone=prompt("Enter your phone number(09xxxxxxxx)").trim();
       if (!phone) {
         alert("Enter valid phone number");
         return;
       }
    if(phone==localStorage.getItem("phonenumber")){
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
 
 