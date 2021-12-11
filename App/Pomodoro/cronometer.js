// Credit: Mateusz Rybczonec

const FULL_DASH_ARRAY = 283;

const COLOR_CODES = {
  working: {
    color: "green"
  },
  pause: {
    color: "orange"
  }
};


let workTime = 101;
let breakTime = 3;
let repeat = 2;
let repeatLeft = repeat;
let TIME_LIMIT = workTime;
let work = true;
let timePassed = 0;
let timeLeft = TIME_LIMIT -1;
let timerInterval = null;
let remainingPathColor = COLOR_CODES.working.color;
let selectedTimerIndex = -1;
let selectedTimer = null;
let selectedTimer1 = {
    work : "00:10", pause : "00:05", cycles: 3, name: "jigubigule", description: "tchucaxuxufcbtybbtvvvbnbg", category: "Gaming", color: "red" 
  };
let selectedTimer2 = {
    work : "00:10", pause : "00:35", cycles: 8, name: "deez nuts", description: "as minhas nozes", category: "Sleeping", color: "green" 
  };
let timers = [selectedTimer1, selectedTimer2, selectedTimer1, selectedTimer2, selectedTimer1, selectedTimer2, selectedTimer1];


document.getElementById("app").innerHTML = `
<div class="base-timer">
  <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <g class="base-timer__circle">
      <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
      <path
        id="base-timer-path-remaining"
        stroke-dasharray="283"
        class="base-timer__path-remaining ${remainingPathColor}"
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
putTimers();

function putTimers() {
let str= "";
  for(let i = 0; i < timers.length; i++) {

    let small_des = timers[i].description.slice(0, 20);
    if(small_des.length < timers[i].description.length)
      small_des+="...";

    str+=`<div class="div-block-10" style="margin-bottom:5px">
      <div class="div-block-18">
        <div>${timers[i].name}</div>
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
        <div>Color: ${timers[i].color}</div>
      </div>
      <div class="div-block-15" onClick="loadTimer(${i})"><a href="#" class="button-5 w-button">LOAD</a></div>
    </div>`
  }
  document.getElementById("timers").innerHTML = str;
}

function startTimer() {
  const {working, pause} = COLOR_CODES
  timerInterval = setInterval(() => {
    timePassed += 1;
    timeLeft = TIME_LIMIT - timePassed;
    if(timeLeft < 0)
      document.getElementById("base-timer-label").innerHTML = formatTime(0);
    else 
      document.getElementById("base-timer-label").innerHTML = formatTime(timeLeft);
    setCircleDasharray();

    if (timeLeft === -1) {
      timeLeft = 0;
      if(confirm("time's up!")) {
        if(work) {
          console.log(work);
          repeatLeft-=1;
          if(repeatLeft > 0) {
            work = !work;
            timePassed = -1;
            TIME_LIMIT = breakTime;
            document.getElementById("base-timer-path-remaining").classList.remove(working.color);
            document.getElementById("base-timer-path-remaining").classList.add(pause.color);
          }
          else {
            clearInterval(timerInterval);
          }
        }
        else {
          console.log(work);
          TIME_LIMIT = workTime;
          work = !work;
          timePassed = -1;
          document.getElementById("base-timer-path-remaining").classList.remove(pause.color);
          document.getElementById("base-timer-path-remaining").classList.add(working.color);
        }
      }
      else {
        clearInterval(timerInterval);
      }
    }
  }, 1000);
}

function stopTimer() {
  timePassed = 0;
  document.getElementById("base-timer-label").innerHTML = formatTime(timeLeft);
  
}

function loadTimer(i) {
  //get index of clicked
  selectedTimerIndex = i;
  selectedTimer = timers[i];
  document.getElementById("time-to-work").value = selectedTimer.work;
  document.getElementById("Time-To-Break").value = selectedTimer.pause;
  document.getElementById("Number-of-cycles").value = selectedTimer.cycles;
  document.getElementById("name").value = selectedTimer.name;
  document.getElementById("field").value = selectedTimer.description;
  document.getElementById("Category").value = selectedTimer.category;
  switch(selectedTimer.color) {
    case "yellow": 
      document.getElementById("Colors-1").checked = true;
      break;
    case "orange": 
      document.getElementById("Colors-2").checked = true;
      break;
    case "red": 
      document.getElementById("Colors-3").checked = true;
      break;
    case "pink": 
      document.getElementById("Colors-4").checked = true;
      break;
    case "blue": 
      document.getElementById("Colors-5").checked = true;
      break;
    case "green": 
      document.getElementById("Colors-6").checked = true;
      break;
  }
}

function saveTimer() {
  console.log("yo");
  let newColor = "";
  if(document.getElementById("Colors-1").checked)
    newColor = "yellow";
  if(document.getElementById("Colors-2").checked)
    newColor = "orange";
  if(document.getElementById("Colors-3").checked)
    newColor = "red";
  if(document.getElementById("Colors-4").checked)
    newColor = "pink";
  if(document.getElementById("Colors-5").checked)
    newColor = "blue";
  if(document.getElementById("Colors-6").checked)
    newColor = "green";

  let newTimer = {
    work : document.getElementById("time-to-work").value,
    pause : document.getElementById("Time-To-Break").value,
    cycles: document.getElementById("Number-of-cycles").value,
    name: document.getElementById("name").value,
    description: document.getElementById("field").value,
    category: document.getElementById("Category").value,
    color: newColor 
  };
  if(selectedTimerIndex >= 0) {
    timers[selectedTimerIndex] = newTimer
  }else{
    timers.push(newTimer);
    selectedTimerIndex = timers.length-1; 
  }
  console.log(selectedTimerIndex); 
  putTimers();

}

function createTimer() {
  selectedTimerIndex =  -1;
  console.log(selectedTimerIndex);
  document.getElementById("time-to-work").value = null;
  document.getElementById("Time-To-Break").value = null;
  document.getElementById("Number-of-cycles").value = null;
  document.getElementById("name").value = "";
  document.getElementById("field").value = "";
  document.getElementById("Category").selectedIndex = -1;
  document.getElementById("Colors-1").checked = false;
  document.getElementById("Colors-2").checked = false; 
  document.getElementById("Colors-3").checked = false; 
  document.getElementById("Colors-4").checked = false;
  document.getElementById("Colors-5").checked = false; 
  document.getElementById("Colors-6").checked = false;
}




function formatTime(time) {
  const hours = Math.floor(time/3600)
  let aux = time - hours*3600;
  const minutes = Math.floor(aux / 60);
  let seconds = time % 60;

  if (seconds < 10) {
    seconds = `0${seconds}`;
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
