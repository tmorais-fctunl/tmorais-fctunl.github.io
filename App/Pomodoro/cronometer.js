// Credit: Mateusz Rybczonec for the circle around the timer, and the basics of the timer
// https://css-tricks.com/how-to-create-an-animated-countdown-timer-with-html-css-and-javascript/

const FULL_DASH_ARRAY = 283;

const COLOR_CODES = {
  work1: "yellow",
  work2: "red",
  work3: "blue",
  work4: "green",
  pause: "black"
};
  

let selectedTimer1 = {
    work : "00:00:05", pause : "00:00:03", cycles: 3, name: "jigubigule", description: "tchucaxuxufcbtybbtvvvbnbg", category: "Gaming" 
};
let selectedTimer2 = {
    work : "01:00:00", pause : "00:10:00", cycles: 2, name: "deez nuts", description: "as minhas nozes", category: "Sleeping" 
};
let selectedTimerIndex = -1;
let newSelectedTimerIndex = -1;
let getSelectedTimerIndex = sessionStorage.getItem('pomodoro_selectedTimerIndex');
let timers = null;
let newTimers = [selectedTimer1, selectedTimer2, selectedTimer1, selectedTimer2, selectedTimer1, selectedTimer2, selectedTimer1];
let getTimers = sessionStorage.getItem('pomodoro_timers');
if(getTimers == null) {
  console.log("first");
  sessionStorage.setItem('pomodoro_selectedTimerIndex', newSelectedTimerIndex);
  selectedTimerIndex = newSelectedTimerIndex;
  sessionStorage.setItem('pomodoro_timers', JSON.stringify(newTimers));
  timers = newTimers;
}
else {
  console.log("other");
  selectedTimerIndex = JSON.parse(getSelectedTimerIndex);
  timers = JSON.parse(getTimers);
}

let workTime = 0;
let breakTime = 0;
let repeat = 0;
let repeatLeft = repeat;
let TIME_LIMIT = workTime;
let work = true;
let timePassed = 0;
let timeLeft = TIME_LIMIT;
let timerInterval = null;
let choosenWorkColor = COLOR_CODES.pause;
let pomodoro_live = false;
let pomodoro_sleeping = false;
let startDate = null;



document.getElementById("app").innerHTML = `
<div class="base-timer">
  <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <g class="base-timer__circle">
      <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
      <path
        id="base-timer-path-remaining"
        stroke-dasharray="283"
        class="base-timer__path-remaining ${choosenWorkColor}"
        d="
          M 50, 50
          m -45, 0
          a 45,45 0 1,0 90,0
          a 45,45 0 1,0 -90,0
        "
      ></path>
    </g>
  </svg>
  <span id="base-timer-label" class="base-timer__label">
    ${formatTime(timeLeft)}
  </span> 
</div>
`;
document.getElementById("Category").selectedIndex = -1;
if(selectedTimerIndex != -1) {
  loadTimer(selectedTimerIndex);
}

putTimers();

function putTimers() {
let str= "";
  for(let i = 0; i < timers.length; i++) {

    let small_des = timers[i].description.slice(0, 20);
    if(small_des.length < timers[i].description.length)
      small_des+="...";
    let small_name = timers[i].name.slice(0, 30);
    if(small_name.length < timers[i].name.length)
      small_name+="...";

    str+=`<div class="div-block-10" style="margin-bottom:5px;background-color:#efe8d6">
      <div class="div-block-18">
        <div>${small_name}</div>
      </div>
      <div class="div-block-17">
        <div class="text-block">Work: ${timers[i].work}</div>
        <div class="text-block-2">Pause: ${timers[i].pause}</div>
        <div class="text-block-3">Cycles: ${timers[i].cycles}</div>
      </div>
      <div class="div-block-19">
        <div class="text-block-4">Description: ${small_des} </div>
      </div>
      <div class="div-block-20">
        <div>Category: ${timers[i].category}</div>
      </div>
      <div class="div-block-15" style="display: flex;justify-content:center; align-items: center;flex-direction: row">
        <a href="#" class="button-5 w-button" style="border-radius: 20px;background-color: #8bc63e" onClick="loadTimer(${i})">LOAD</a>
        <a href="#" class="button-5 w-button" style="margin-left:10px;background-color: #ff3d3d;border-radius: 20px" onClick="deleteTimer(${i})">DELETE</a>
      </div>
    </div>`
  }
  document.getElementById("timers").innerHTML = str;
}

function loadCronometer() {
  let selectedTimer = timers[selectedTimerIndex];
  const parsed_work = selectedTimer.work.split(":");
  let sec_work = +parsed_work[0]*3600 + +parsed_work[1]*60 + +parsed_work[2];
  const parsed_pause = selectedTimer.pause.split(":");
  let sec_pause = +parsed_pause[0]*3600 + +parsed_pause[1]*60 + +parsed_pause[2];
  workTime = sec_work;
  breakTime = sec_pause;
  repeat = selectedTimer.cycles;
  repeatLeft = repeat;
  TIME_LIMIT = workTime;
  timeLeft = TIME_LIMIT;
  document.getElementById("base-timer-label").innerHTML = formatTime(timeLeft);
}

function uncompletedPomodoro() {
  resetPomodoro();
  document.getElementById("base-timer-path-remaining").classList.remove(COLOR_CODES.pause);
  document.getElementById("base-timer-path-remaining").classList.add(choosenWorkColor);
}

function resetPomodoro() {
  pomodoro_live = false;
  timePassed = -1;
  clearInterval(timerInterval);
  loadCronometer();
  work = true;
}

function startTimer2() {
  pomodoro_live = true;
  timerInterval = setInterval(() => {
    timePassed += 1;
    timeLeft = TIME_LIMIT - timePassed;
    if(timeLeft < 0)
      document.getElementById("base-timer-label").innerHTML = formatTime(0);
    else 
      document.getElementById("base-timer-label").innerHTML = formatTime(timeLeft);
    setCircleDasharray();

    if (timeLeft === -1) {
      if(work){
        repeatLeft-=1;
        if(repeatLeft > 0) {
          if(confirm("Work is done, time to for your pause.")) {
            work = !work;
            timePassed = -1;
            TIME_LIMIT = breakTime;
            document.getElementById("base-timer-path-remaining").classList.remove(choosenWorkColor);
            document.getElementById("base-timer-path-remaining").classList.add(COLOR_CODES.pause);
          }
          else {
            uncompletedPomodoro();
            
          } 
        }
        else {
          alert("Congratulations, you succeded!");
          let endDate = new Date();
          let startMonth = startDate.getMonth() + 1;
          let startDay = startDate.getDate();
          let startHour = startDate.getHours();
          let startMinute = startDate.getMinutes();
          if(startMonth < 10)
            startMonth = `0${startMonth}`;
          if(startDay < 10)
            startDay = `0${startDay}`;
          if(startHour < 10)
            startHour = `0${startHour}`;
          if(startMinute < 10)
            startMinute = `0${startMinute}`;

          let startString = `${startDate.getFullYear()}-${startMonth}-${startDay}T${startHour}:${startMinute}`;
          console.log(startString);

          let endMonth = endDate.getMonth() + 1;
          let endDay = endDate.getDate();
          let endHour = endDate.getHours();
          let endMinute = endDate.getMinutes();
          if(endMonth < 10)
            endMonth = `0${endMonth}`;
          if(endDay < 10)
            endDay = `0${endDay}`;
          if(endHour < 10)
            endHour = `0${endHour}`;
          if(endMinute < 10)
            endMinute = `0${endMinute}`;

          let endString = `${endDate.getFullYear()}-${endMonth}-${endDay}T${endHour}:${endMinute}`;
          console.log(endString);

          let duration = Math.round((endDate - startDate)/1000);
          let completedPomodoro = {category : timers[selectedTimerIndex].category, start_date_time: startString, end_date_time: endString };
          console.log(completedPomodoro);
          let getEvents = sessionStorage.getItem('events');
          if(getEvents == null) {
            let newEvents = [completedPomodoro];
            sessionStorage.setItem('events', JSON.stringify(newEvents));
          }
          else {
            let events = JSON.parse(getEvents);
            events.push(completedPomodoro);
            sessionStorage.setItem('events', JSON.stringify(events));
          }
          
          resetPomodoro();
        }
      }
      else {
        if(confirm("Break is over, time to get back to work!")) {
          TIME_LIMIT = workTime;
          work = !work;
          timePassed = -1;
          document.getElementById("base-timer-path-remaining").classList.remove(COLOR_CODES.pause);
          document.getElementById("base-timer-path-remaining").classList.add(choosenWorkColor);
        }
        else {
          uncompletedPomodoro();
        }
      }
    }
  }, 1000);
}
function startTimer() {
  if(selectedTimerIndex < 0) {
    alert("Select a timer first!");
    return;
  }
  if(pomodoro_live){
    alert("Can´t perform this action with a pomodoro running!");
    return;
  }
  startDate = new Date();
  startTimer2();
}

function loadTimer(i) {
  if(pomodoro_live){
    alert("Can´t perform this action with a pomodoro running!");
    return;
  }
  selectedTimerIndex = i;
  sessionStorage.setItem('pomodoro_selectedTimerIndex', selectedTimerIndex);
  let selectedTimer = timers[i];
  document.getElementById("time-to-work").value = selectedTimer.work;
  document.getElementById("Time-To-Break").value = selectedTimer.pause;
  document.getElementById("Number-of-cycles").value = selectedTimer.cycles;
  document.getElementById("name").value = selectedTimer.name;
  document.getElementById("field").value = selectedTimer.description;
  document.getElementById("Category").value = selectedTimer.category;
  document.getElementById("base-timer-path-remaining").classList.remove(choosenWorkColor);
  switch(selectedTimer.category) {
    case "Studying": 
      choosenWorkColor = COLOR_CODES.work2;
      break;
    case "Gaming": 
      choosenWorkColor = COLOR_CODES.work3;
      break;
    case "Sleeping":
      choosenWorkColor = COLOR_CODES.work1;
      break;
    case "Exercising": 
      choosenWorkColor = COLOR_CODES.work4;
      break;
  }
  document.getElementById("base-timer-path-remaining").classList.add(choosenWorkColor);
  loadCronometer();
}

function deleteTimer(i) {
  if(pomodoro_live){
    alert("Can´t perform this action with a pomodoro running!");
    return;
  }
  timers.splice(i,1);
  sessionStorage.setItem('pomodoro_timers', JSON.stringify(timers));
  if(selectedTimerIndex == i){
    createTimer();
  }
  else {
    if(i < selectedTimerIndex) {
      selectedTimerIndex--;
      sessionStorage.setItem('pomodoro_selectedTimerIndex', selectedTimerIndex);
    }
  }

  putTimers();
}

function saveTimer() {
  if(pomodoro_live){
    alert("Can´t perform this action with a pomodoro running!");
    return;
  }
  document.getElementById("base-timer-path-remaining").classList.remove(choosenWorkColor);
  switch(document.getElementById("Category").value) {
    case "Studying": 
      choosenWorkColor = COLOR_CODES.work2;
      break;
    case "Gaming": 
      choosenWorkColor = COLOR_CODES.work3;
      break;
    case "Sleeping":
      choosenWorkColor = COLOR_CODES.work1;
      break;
    case "Exercising": 
      choosenWorkColor = COLOR_CODES.work4;
      break;
  }
  document.getElementById("base-timer-path-remaining").classList.add(choosenWorkColor);

  let newTimer = {
    work : document.getElementById("time-to-work").value,
    pause : document.getElementById("Time-To-Break").value,
    cycles: document.getElementById("Number-of-cycles").value,
    name: document.getElementById("name").value,
    description: document.getElementById("field").value,
    category: document.getElementById("Category").value
  };
  if(selectedTimerIndex >= 0) {
    timers[selectedTimerIndex] = newTimer
  }else{
    timers.push(newTimer);
    selectedTimerIndex = timers.length-1;
    sessionStorage.setItem('pomodoro_selectedTimerIndex', selectedTimerIndex);
  }
  sessionStorage.setItem('pomodoro_timers', JSON.stringify(timers));
  loadCronometer();
  putTimers();

}

function createTimer() {
  if(pomodoro_live){
    alert("Can´t perform this action with a pomodoro running!");
    return;
  }
  selectedTimerIndex =  -1;
  sessionStorage.setItem('pomodoro_selectedTimerIndex', selectedTimerIndex);
  document.getElementById("time-to-work").value = null;
  document.getElementById("Time-To-Break").value = null;
  document.getElementById("Number-of-cycles").value = null;
  document.getElementById("name").value = "";
  document.getElementById("field").value = "";
  document.getElementById("Category").selectedIndex = -1;
  document.getElementById("base-timer-path-remaining").classList.remove(choosenWorkColor);
  TIME_LIMIT = 0;
  timeLeft = 0;
  choosenWorkColor = COLOR_CODES.pause;
  document.getElementById("base-timer-label").innerHTML = formatTime(timeLeft);
  document.getElementById("base-timer-path-remaining").classList.add(choosenWorkColor);
  setCircleDasharray();
}

function stopTimer() {
  if(pomodoro_live) {
    pomodoro_sleeping = true;
    clearInterval(timerInterval);
  }
}

function continueTimer() {
  if(pomodoro_sleeping) {
    pomodoro_sleeping = false;
    startTimer2();
  }
}

function abandon() {
  if(pomodoro_live) {
    if(confirm("Doing this will result in throwing away your progress! \n If you don't want this consider stopping")) {
      pomodoro_sleeping = false;
      uncompletedPomodoro();
      document.getElementById("base-timer-label").innerHTML = formatTime(timeLeft);
      setCircleDasharray();
    }
  }
}

function formatTime(time) {
  const hours = Math.floor(time/3600)
  let aux = time - hours*3600;
  let minutes = Math.floor(aux / 60);
  let seconds = time % 60;

  if (seconds < 10) {
    seconds = `0${seconds}`;
  }
  if((minutes > 0 && minutes < 10) || (hours > 0 && minutes <10)) {
    minutes = `0${minutes}`;
  }
  if(hours > 0)
    return `${hours}:${minutes}:${seconds}`;
  else 
    return `${minutes}:${seconds}`
}

function calculateTimeFraction() {
  const rawTimeFraction = timeLeft / TIME_LIMIT;
  return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
}

function setCircleDasharray() {
  const circleDasharray = `${(
    calculateTimeFraction() * FULL_DASH_ARRAY
  ).toFixed(0)} 283`;
  document
    .getElementById("base-timer-path-remaining")
    .setAttribute("stroke-dasharray", circleDasharray);
}