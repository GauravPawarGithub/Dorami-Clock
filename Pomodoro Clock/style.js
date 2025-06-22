const timer = document.querySelector('.timer')
const title = document.querySelector('.title')
const startbtn = document.querySelector('.startbtn')
const pausebtn = document.querySelector('.pausebtn')
const resumebtn = document.querySelector('.resumebtn')
const resetbtn = document.querySelector('.resetbtn')
const pomoCountsDisplay = document.querySelector(".pomoCountsDisplay");

const WORK_TIME = 25*60;
const BREAK_TIME = 5*60;
let timerID = null;
let oneRoundCompleted = false;//one round = work time + break time
let totalCount = 0;
let paused = false; //for checking pausebtn whethe it is clicked

//5.function to update title
function updateTitle(msg){
    title.textContent = msg;
}

//6.funciton to save pomodoro count in local storage
function saveLocalCount(){
    let counts = JSON.parse(localStorage.getItem("pomoCounts")) || 0; //string->json 
    counts++;
    localStorage.setItem("pomoCounts", JSON.stringify(counts))//json to string : local storage stores in string
}

//3.function to countdown
const countDown = (time)=>{
    return()=>{
        let min = Math.floor(time/60).toString().padStart(2,'0'); //sec->min 
        let sec = Math.floor(time%60).toString().padStart(2,'0'); //sec->min
        timer.textContent = `${min} : ${sec}`; // used to get or set the text content of a node
        time--;
        if(time < 0){
            stopTimer()
            if(!oneRoundCompleted){ //oneround === false
                timerID = startTimer(BREAK_TIME)
                oneRoundCompleted = true;
                updateTitle("It's Break Time")
            }else{
                updateTitle("Completed 1 Round of Pomodoro technique!!");
                setTimeout(()=>updateTitle("Start Timer Again"),2000)
                totalCount++; //no of pomodoro sessions
                oneRoundCompleted = false;
                saveLocalCount();
                showPomoCounts();
            }
        }
    }
}

//2.function to start timer
const startTimer = (startTime)=>{
    if(timerID !== null){
        stopTimer()
    }
    return setInterval(countDown(startTime), 1000);
} 
//4.function to stop timer
const stopTimer = ()=>{
    clearInterval(timerID)
    timerID = null;
}

//functoin to get time in seconds
const getTimeInSeconds = (timeString) =>{
    //array destructuring
    const[minutes, seconds] = timeString.split(":")
    return parseInt(minutes*60) + parseInt(seconds);
}

//1.adding eventListner to start button
startbtn.addEventListener('click', ()=>{
    timerID = startTimer(WORK_TIME);
    updateTitle("It's Work Time");
});

//adding eventListner to reset button
resetbtn.addEventListener('click',  ()=>{
    stopTimer();
    timer.textContent = "25:00";
})

//adding eventListner to pause button
pausebtn.addEventListener('click', ()=>{
    stopTimer();
    paused = true;
    updateTitle('Timer paused')
})

//adding eventListner to resumebtn button
resumebtn.addEventListener("click", () => {
  if(paused){ //if pause clicked or true
    const currentTime = getTimeInSeconds(timer.textContent);//ye time minutes ara
    timerID = startTimer(currentTime);
    paused = false; //no pause
    (!oneRoundCompleted) ? updateTitle('Its work time') : updateTitle('its break time')
  }
});

//function to show completed pomodoros to screen from local storage
function showPomoCounts(){
    const counts = JSON.parse(localStorage.getItem("pomoCounts"))
    if(counts > 0){
        pomoCountsDisplay.style.display = 'flex'; //none->flex     
    }
    pomoCountsDisplay.firstElementChild.textContent = counts;//span tag value will change
} 
showPomoCounts();
