var canTrigger = true;
var task_counter = sessionStorage.getItem('task_counter');
let notifications = ["Never","5min","10min","30min","1h","1day"];
let frequencies = ["None","Every day"];
let categories = ["Studying","Gaming","Sleeping","Exercising"];
let colors = ["rgb(255, 99, 132)","rgb(54, 162, 235)","rgb(255, 205, 86)","#3cba9f"];
let hour_positions = [4.16,8.32,12.48,16.64,20.80,24.96,29.12,33.28,37.44,41.60,45.76,49.92,54.08,58.24,62.40,66.56,70.72,74.88,79.04,83.20,87.36,91.52,95.68]
let tasks = [];
let uniqueTasks = [];

function DateTimeListenerFunction() {

    //FOR ADD FORM

    //Start date
    minTimeCondition = $("#form_Start_time").attr("min");
    minDateCondition = $("#form_Start_date").attr("min");
    currTime = $("#form_Start_time").val();
    currDate = $("#form_Start_date").val();

    //end date
    endMinTimeCondition = currTime;
    endMinDateCondition = currDate;
    endCurrTime = $("#form_End_time").val();
    endCurrDate = $("#form_End_date").val();
    console.log(currDate),
    //update end-date if the start-date interferes
    $('#form_End_date').prop('min', endMinDateCondition);
    $('#form_End_time').prop('min', endMinTimeCondition);

    if (endCurrDate < endMinDateCondition || (endMinDateCondition == endCurrDate && endCurrTime < endMinTimeCondition)) {
        console.log("Updated the end-date because the start-date surpassed it");
        $('#form_End_date').prop('value', currDate);
        console.log($("#form_End_date").val());
        $('#form_End_time').prop('value', currTime);
    }

    if (new Date($("#form_End_date").val()).getDate() != new Date($("#form_Start_date").val()).getDate()) {
      console.log("ha");
      $("#form_Frequency").prop("disabled",true);
    }
    else {
      console.log("oh");
      $("#form_Frequency").prop("disabled",false);
    }

    //FOR UPDATE FORM

    //Start date
    minTimeCondition = $("#updateform_Start_time").attr("min");
    minDateCondition = $("#updateform_Start_date").attr("min");
    currTime = $("#updateform_Start_time").val();
    currDate = $("#updateform_Start_date").val();

    //end date
    endMinTimeCondition = currTime;
    endMinDateCondition = currDate;
    endCurrTime = $("#updateform_End_time").val();
    endCurrDate = $("#updateform_End_date").val();
    console.log(currDate),
    //update end-date if the start-date interferes
    $('#updateform_End_date').prop('min', endMinDateCondition);
    $('#updateform_End_time').prop('min', endMinTimeCondition);

    if (endCurrDate < endMinDateCondition || (endMinDateCondition == endCurrDate && endCurrTime < endMinTimeCondition)) {
        console.log("Updated the end-date because the start-date surpassed it");
        $('#updateform_End_date').prop('value', currDate);
        console.log($("#updateform_End_date").val());
        $('#updateform_End_time').prop('value', currTime);
    }

    if (new Date($("#updateform_End_date").val()).getDate() != new Date($("#updateform_Start_date").val()).getDate()) {
      console.log("ha");
      $("#updateform_Frequency").prop("disabled",true);
    }
    else {
      console.log("oh");
      $("#updateform_Frequency").prop("disabled",false);
    }

}

window.onload = function() {
  document.getElementById("form_Start_date").addEventListener('input', function (evt) {
      DateTimeListenerFunction()
  });
  document.getElementById("form_Start_date").addEventListener('change', function (evt) {
      $("#form_end_date_div").addClass("blink_me");
  });
  document.getElementById("form_Start_time").addEventListener('input', function (evt) {
      DateTimeListenerFunction()
  });
  document.getElementById("form_End_date").addEventListener('input', function (evt) {
      DateTimeListenerFunction()
  });
  document.getElementById("form_End_time").addEventListener('input', function (evt) {
      DateTimeListenerFunction()
  });

  document.getElementById("updateform_Start_date").addEventListener('input', function (evt) {
      DateTimeListenerFunction()
  });
  document.getElementById("updateform_Start_date").addEventListener('change', function (evt) {
      console.log("AHAH");
      $("#updateform_end_date_div").addClass("blink_me");
  });
  document.getElementById("updateform_Start_time").addEventListener('input', function (evt) {
      DateTimeListenerFunction()
  });
  document.getElementById("updateform_End_date").addEventListener('input', function (evt) {
      DateTimeListenerFunction()
  });
  document.getElementById("updateform_End_time").addEventListener('input', function (evt) {
      DateTimeListenerFunction()
  });

  loadTasks();

}

function taskLeftPos(start_day, top_pos, duration){
  let width = 0;
  console.log(tasks);
  for (let n=0; n<tasks.length; n++){
    console.log("POS: "+top_pos+" TASK "+n+" POS: "+tasks[n].pos+" POS+DURATION "+parseInt(parseInt(tasks[n].pos)+parseInt(tasks[n].duration)))
    if (tasks[n].day == start_day) {
      console.log("a");
      if((top_pos <= tasks[n].pos && tasks[n].pos <= top_pos+duration) || (top_pos <= tasks[n].pos+tasks[n].duration && tasks[n].pos+tasks[n].duration <= top_pos+duration)
        || (tasks[n].pos <= top_pos && top_pos <= tasks[n].pos+tasks[n].duration) || (tasks[n].pos <= top_pos+duration && top_pos+duration <= tasks[n].pos+tasks[n].duration)) {
          console.log("b");
          width += tasks[n].width;
      }
    }
  }
  return width;
}


function declareTaskTriggerHandlers(id,i) {
  $("#task_"+id+"_"+i).on('mouseenter mouseleave', {id:id, i:i}, function (evt) {
    if (canTrigger) {
      canTrigger = false;
      $('[name="task_'+evt.data.id+'"][id!="task_'+evt.data.id+'_'+evt.data.i+'"]').each(function (i, obj) {
        //alert(evt.type);
        if (evt.type=="mouseenter")
          $(this).addClass("hovered_task");
        else
          $(this).removeClass("hovered_task");
      });
      canTrigger = true;
    }
  });

  $("#task_"+id+"_"+i).on('click', {id:id, i:i}, function (evt) {
    if (canTrigger) {
      canTrigger = false;
      updateForm(id);
      canTrigger = true;
    }
  });
}

function pushTask(id,start_day,i,pos,height,width,subtaskclass,color,name,description) {
  console.log("Push Task day:"+start_day+" with height: "+height);
  //let task = '<div name="task_'+id+'" id="task_'+id+'_'+i+'" style="position:absolute; top:'+pos+'%; left:'+width+'%; height:'+height+'%; border-left-color:'+color+'; color:black" class="task '+subtaskclass+'">'+name+'<p style="margin-top:10px; color:darkgray">'+description+'</p></div>';
  let task = '<div name="task_'+id+'" id="task_'+id+'_'+i+'" style="position:absolute; top:'+pos+'%; left:'+width+'%; height:'+height+'%; border-left-color:'+color+'; color:black" class="task '+subtaskclass+'">'+name+'</div>';
  $("#day-"+(start_day)).append(task);
  tasks.push({id:id, day:start_day, pos:pos, duration:height, width:$('#task_'+id+'_'+i).width()});
  declareTaskTriggerHandlers(id,i);
}

function addActivity() {
  let name = $("#form_Name").val();
  let start_day = new Date($("#form_Start_date").val()).getDate();
  let end_day = new Date($("#form_End_date").val()).getDate();
  let start_time = $("#form_Start_time").val().split(':');
  let end_time = $("#form_End_time").val().split(':');
  let freq = frequencies[$("#form_Frequency").val()];
  let notif = notifications[$("#form_Notification").val()];
  //let color = $("#form_Color").val();
  let category = $("#form_Category").val();
  let color = colors[category];
  category = categories[category];
  let description =$("#form_Description").val();

  start_hour = parseInt(start_time[0]);
  start_min = parseInt(start_time[1]);
  end_hour = parseInt(end_time[0]);
  end_min = parseInt(end_time[1]);

  var duration = [];
  let day_dur = parseInt(end_day)-parseInt(start_day);
  if (day_dur != 0)
    freq = "None";

  if (day_dur==0)
    duration[0] = Math.abs((end_hour+(end_min/60)) - (start_hour+(start_min/60)));
  else {
    start_duration = 24-(start_hour+(start_min/60));
    duration[0] = start_duration;
    for (i=0; i<day_dur-1; i++) {
      duration[i+1] = 24;
    }
    duration[day_dur] = end_hour+(end_min/60)
  }

  let top_pos = 4.18*(parseInt(start_hour)+(parseInt(start_min)/60));
  let fst_height = 4.18*duration[0];
  let lst_height = 4.18*duration[day_dur];
  task_counter = sessionStorage.getItem("task_counter");
  let id = task_counter;

  //If the activity spreads over one day
  if (day_dur == 0) {
    let width = 0;
    width = taskLeftPos(start_day, top_pos, fst_height);
    if (fst_height==0)
      fst_height = 1;
    pushTask(id,start_day,0,top_pos,fst_height,width,"",color,name,description);
  }
  //if it spreads over multiple days
  else {
    for (let i=0; i<day_dur+1; i++) {
      console.log("Now adding day:"+ (start_day + i));
      let width = 0;
      if (i==0) {
        width = taskLeftPos(start_day+i, top_pos, fst_height);
        pushTask(id,start_day+i,i,top_pos,fst_height-2,width,"task-fst",color,name, description);
      }
      else if (i!=day_dur) {
        width = taskLeftPos(start_day+i, 0, 98.0);
        pushTask(id,start_day+i,i,0,98.0,width,"task-mid",color,name, description);
      }
      else {
        width = taskLeftPos(start_day+i, 0, lst_height);
        pushTask(id,start_day+i,i,0,lst_height,width,"task-end",color,name, description);
      }
    }
  }


  let task_object = {
    id:id,
    name:name,
    category:categories[category],
    frequency:frequencies[freq],
    notification:notifications[notif],
    color:color,
    description:description,
    start_date:start_day,
    end_date:end_day,
    start_time:start_time,
    end_time:end_time,
    start_date_time:"2021-12-0"+start_day+"T"+start_time,
    end_date_time:"2021-12-0"+end_day+"T"+end_time
    }

  uniqueTasks.push(task_object);
  task_counter++;

  if (freq == "Every day"){
    for (let i=start_day+1; i<8; i++) {
      let width = 0;
      width = taskLeftPos(start_day, top_pos, fst_height);
      if (fst_height==0)
        fst_height = 1;
      pushTask(id,i,0,top_pos,fst_height,width,"",color,name,description);
      let task_object = {
        id:task_counter++,
        name:name,
        category:categories[category],
        frequency:frequencies[freq],
        notification:notifications[notif],
        color:color,
        description:description,
        start_date:i,
        end_date:i,
        start_time:start_time,
        end_time:end_time,
        start_date_time:"2021-12-0"+i+"T"+start_time,
        end_date_time:"2021-12-0"+i+"T"+end_time
        }
        uniqueTasks.push(task_object);

    }
  }

  sessionStorage.setItem("events",JSON.stringify(uniqueTasks));
  sessionStorage.setItem("task_counter",task_counter);


  alert("Task successfully added!");
  $("#form_end_date_div").removeClass("blink_me");
  clearForm();
  closeForm();

}

//Script for generating pre-built tasks
function generateTasks() {

  let gen_tasks = [
    {
      id:task_counter++,
      name:"Estudar AM1",
      category:categories[0],
      frequency:frequencies[0],
      notification:notifications[0],
      color:colors[0],
      description:"Tou tramado",
      start_date:1,
      end_date:2,
      start_time:[09,15],
      end_time:[09,15],
      start_date_time:"2021-12-01T09:15",
      end_date_time:"2021-12-02T09:15"
    },
    {
      id:task_counter++,
      name:"Estudar AM2",
      category:categories[0],
      frequency:frequencies[0],
      notification:notifications[0],
      color:colors[0],
      description:"Tou tramado 2",
      start_date:2,
      end_date:3,
      start_time:[19,15],
      end_time:[19,15],
      start_date_time:"2021-12-02T19:15",
      end_date_time:"2021-12-03T19:15"
    },
    {
      id:task_counter++,
      name:"Estudar IIO",
      category:categories[0],
      frequency:frequencies[0],
      notification:notifications[0],
      color:colors[0],
      description:"Tas fixinho",
      start_date:4,
      end_date:4,
      start_time:[09,15],
      end_time:[09,45],
      start_date_time:"2021-12-04T09:15",
      end_date_time:"2021-12-04T09:45"
    },
    {
      id:task_counter++,
      name:"Cuidar do Jose",
      category:categories[3],
      frequency:frequencies[0],
      notification:notifications[0],
      color:colors[3],
      description:"Que bebe chato, so me interessa o dinheiro",
      start_date:5,
      end_date:5,
      start_time:[17,00],
      end_time:[19,00],
      start_date_time:"2021-12-05T17:00",
      end_date_time:"2021-12-05T19:00"
    },
    {
      id:task_counter++,
      name:"Dormir",
      category:categories[2],
      frequency:frequencies[0],
      notification:notifications[0],
      color:colors[2],
      description:"As vezes sonho com a Maria",
      start_date:5,
      end_date:7,
      start_time:[20,00],
      end_time:[20,00],
      start_date_time:"2021-12-05T20:00",
      end_date_time:"2021-12-07T20:00"
    },
    {
      id:task_counter++,
      name:"Chegar a Gold no LOL",
      category:categories[1],
      frequency:frequencies[0],
      notification:notifications[0],
      color:colors[1],
      description:"SO FEEDERS PA PORRA O MEU JUNGLER NEM GANKA FF15",
      start_date:7,
      end_date:7,
      start_time:[20,05],
      end_time:[23,55],
      start_date_time:"2021-12-07T20:05",
      end_date_time:"2021-12-07T23:55"
    }
  ];
  console.log(uniqueTasks);
  for (let i=0; i<gen_tasks.length; i++) {
    uniqueTasks.push(gen_tasks[i]);
    loadTask(uniqueTasks.indexOf(gen_tasks[i]));
  }
  sessionStorage.setItem("events",JSON.stringify(uniqueTasks));
  sessionStorage.setItem("task_counter",task_counter);
}

//Script for loading saved tasks in local-storage
function loadTasks() {
  let bot_date_lim = new Date("2021-12-01T00:00").getTime();
  let top_date_lim = new Date("2021-12-07T23:59").getTime();
  task_counter = sessionStorage.getItem("task_counter");
  uniqueTasks = JSON.parse(sessionStorage.getItem("events"));
  //Run through local-storage tasks
  if (uniqueTasks!=null) {
    for (let i=0; i<uniqueTasks.length; i++) {
      task_counter++;
      let startdate = new Date(uniqueTasks[i].start_date_time).getTime();
      let enddate = new Date(uniqueTasks[i].end_date_time).getTime();
      if (startdate>=bot_date_lim && startdate <= top_date_lim && enddate>=bot_date_lim && enddate <= top_date_lim)
        loadTask(i);
    }
  }
  else {
    sessionStorage.setItem("task_counter",0);
    task_counter = 0;
    alert("Looks like you have no tasks. Don't worry, i'll fill in a few for you. You can update or delete them as you want. If you end up with no tasks at all my programming forces me to fill in some again.")
    sessionStorage.setItem("events",JSON.stringify(default_events));
    loadTasks();
    return;
    //generateTasks();
  }
  sessionStorage.setItem("task_counter",task_counter);
}

function loadTask(i) {
  let task_object = uniqueTasks[i];
  let start_hour = parseInt(task_object.start_time[0]);
  let start_min = parseInt(task_object.start_time[1]);
  let end_hour = parseInt(task_object.end_time[0]);
  let end_min = parseInt(task_object.end_time[1]);

  var duration = [];
  let day_dur = parseInt(task_object.end_date)-parseInt(task_object.start_date);

  if (day_dur==0)
    duration[0] = Math.abs((end_hour+(end_min/60)) - (start_hour+(start_min/60)));
  else {
    start_duration = 24-(start_hour+(start_min/60));
    duration[0] = start_duration;
    for (i=0; i<day_dur-1; i++) {
      duration[i+1] = 24;
    }
    duration[day_dur] = end_hour+(end_min/60)
  }

  let top_pos = 4.18*(parseInt(start_hour)+(parseInt(start_min)/60));
  let fst_height = 4.18*duration[0];
  let lst_height = 4.18*duration[day_dur];
  let id = task_object.id;

  //If the activity spreads over one day
  if (day_dur == 0) {
    let width = 0;
    width = taskLeftPos(task_object.start_date, top_pos, fst_height);
    if (fst_height==0)
      fst_height = 1;
    pushTask(id,task_object.start_date,0,top_pos,fst_height,width,"",task_object.color,task_object.name, task_object.description);
  }
  //if it spreads over multiple days
  else {
    for (let i=0; i<day_dur+1; i++) {
      console.log("Now adding day:"+ (task_object.start_date + i));
      let width = 0;
      if (i==0) {
        width = taskLeftPos(task_object.start_date+i, top_pos, fst_height);
        pushTask(id,task_object.start_date+i,i,top_pos,fst_height-2,width,"task-fst",task_object.color,task_object.name, task_object.description);
      }
      else if (i!=day_dur) {
        width = taskLeftPos(task_object.start_date+i, 0, 98.0);
        pushTask(id,task_object.start_date+i,i,0,98.0,width,"task-mid",task_object.color,task_object.name, task_object.description);
      }
      else {
        width = taskLeftPos(task_object.start_date+i, 0, lst_height);
        pushTask(id,task_object.start_date+i,i,0,lst_height,width,"task-end",task_object.color,task_object.name, task_object.description);
      }
    }
  }
}

function deleteTask(index) {
  let task = uniqueTasks[index];
  $('[name="task_'+task.id+'"]').each(function (i, obj) {
    $(this).remove();
  });
  let is = [];
  for (let i=0; i<tasks.length; i++) {
    if (tasks[i].id == task.id) {
      is.push(i);
    }
  }
  for (let i=is.length-1; i>=0; i--) {
    tasks.splice(is[i],1);
  }
  console.log(index);
  console.log(uniqueTasks);
  uniqueTasks.splice(index,1);
  console.log(uniqueTasks);
  sessionStorage.setItem("events",JSON.stringify(uniqueTasks));
  closeUpdateForm();
  clearUpdateForm();

}

function updateTask(index) {

  let task = uniqueTasks[index];
  $('[name="task_'+task.id+'"]').each(function (i, obj) {
    $(this).remove();
  });
  let is = [];
  for (let i=0; i<tasks.length; i++) {
    if (tasks[i].id == task.id) {
      is.push(i);
    }
  }
  for (let i=is.length-1; i>=0; i--) {
    tasks.splice(is[i],1);
  }


  let name = $("#updateform_Name").val();
  let start_date = new Date($("#updateform_Start_date").val()).getDate();
  let end_date = new Date($("#updateform_End_date").val()).getDate();
  let start_time = $("#updateform_Start_time").val().split(":");
  let end_time = $("#updateform_End_time").val().split(":");
  let freq = $("#updateform_Frequency").val();
  let category = $("#updateform_Category").val();
  let notif = $("#updateform_Notification").val();
  //let color = $("#updateform_Color").val();
  let color = colors[category];
  let description = $("#updateform_Description").val();

  start_hour = parseInt(start_time[0]);
  start_min = parseInt(start_time[1]);
  end_hour = parseInt(end_time[0]);
  end_min = parseInt(end_time[1]);

  var duration = [];
  let day_dur = parseInt(end_date)-parseInt(start_date);

  if (day_dur==0)
    duration[0] = Math.abs((end_hour+(end_min/60)) - (start_hour+(start_min/60)));
  else {
    start_duration = 24-(start_hour+(start_min/60));
    duration[0] = start_duration;
    for (i=0; i<day_dur-1; i++) {
      duration[i+1] = 24;
    }
    duration[day_dur] = end_hour+(end_min/60)
  }

  let top_pos = 4.18*(parseInt(start_hour)+(parseInt(start_min)/60));
  let fst_height = 4.18*duration[0];
  let lst_height = 4.18*duration[day_dur];
  let id = task.id;

  //If the activity spreads over one day
  if (day_dur == 0) {
    let width = 0;
    width = taskLeftPos(start_date, top_pos, fst_height);
    if (fst_height==0)
      fst_height = 1;
    pushTask(id,start_date,0,top_pos,fst_height,width,"",color,name, description);
  }
  //if it spreads over multiple days
  else {
    for (let i=0; i<day_dur+1; i++) {
      console.log("Now adding day:"+ (start_date + i));
      let width = 0;
      if (i==0) {
        width = taskLeftPos(start_date+i, top_pos, fst_height);
        pushTask(id,start_date+i,i,top_pos,fst_height-2,width,"task-fst",color,name,description);
      }
      else if (i!=day_dur) {
        width = taskLeftPos(start_date+i, 0, 98.0);
        pushTask(id,start_date+i,i,0,98.0,width,"task-mid",color,name,description);
      }
      else {
        width = taskLeftPos(start_date+i, 0, lst_height);
        pushTask(id,start_date+i,i,0,lst_height,width,"task-end",color,name,description);
      }
    }
  }

  let task_object = {
    id:id,
    name:name,
    category:categories[category],
    frequency:frequencies[freq],
    notification:notifications[notif],
    color:color,
    description:description,
    start_date:start_date,
    end_date:end_date,
    start_time:start_time,
    end_time:end_time,
    start_date_time:"0"+start_date+"-12-2021T"+start_time,
    end_date_time:"0"+end_date+"-12-2021T"+end_time
    }

  uniqueTasks[index]=task_object;
  sessionStorage.setItem("Calendar_tasks",JSON.stringify(uniqueTasks));
  $("#updateform_end_date_div").removeClass("blink_me");
  closeUpdateForm();
  clearUpdateForm();

}

function updateForm(id) {
  document.getElementById("ActivityUpdateFormContainer").style.display = "block";
  let task = uniqueTasks.find(element => element.id==id);
  let task_index = uniqueTasks.indexOf(task);
  $("#updateform_Name").val(task.name);
  $("#updateform_Start_date").val("2021-12-0"+task.start_date);
  $("#updateform_End_date").val("2021-12-0"+task.end_date);
  $("#updateform_Start_time").val(task.start_date_time.split("T")[1]);
  $("#updateform_End_time").val(task.end_date_time.split("T")[1]);
  $("#updateform_Frequency").val(frequencies.indexOf(task.frequency));
  $("#updateform_Category").val(categories.indexOf(task.category));
  $("#updateform_Notification").val(notifications.indexOf(task.notification));
  //$("#updateform_Color").val(task.color);
  $("#updateform_Description").val(task.description);
  $("#ActivityUpdateFormContainer form").attr("onsubmit","updateTask("+task_index+"); return false");
  $("#updateform_delete_btn").attr("onclick","deleteTask("+task_index+"); return false;")
  console.log($("#ActivityUpdateFormContainer form").attr("onsubmit"));
}

function closeUpdateForm() {
  clearUpdateForm();
  $("#updateform_end_date_div").removeClass("blink_me");
  document.getElementById("ActivityUpdateFormContainer").style.display = "none";
}

function clearUpdateForm() {
  $("#updateform_Name").val("");
  $("#updateform_Start_date").val("");
  $("#updateform_End_date").val("");
  $("#updateform_Start_time").val("");
  $("#updateform_End_time").val("");
  $("#updateform_Frequency").val("");
  $("#updateform_Category").val("");
  $("#updateform_Notification").val("");
  //$("#updateform_Color").val("#000000");
  $("#updateform_Description").val("");
}

function openForm() {
  document.getElementById("activityFormContainer").style.display = "block";
}

function closeForm() {
  clearForm();
  $("#form_end_date_div").removeClass("blink_me");
  document.getElementById("activityFormContainer").style.display = "none";
}

function clearForm() {
  $("#form_Name").val("");
  $("#form_Start_date").val("");
  $("#form_End_date").val("");
  $("#form_Start_time").val("");
  $("#form_End_time").val("");
  $("#form_Frequency").val("");
  $("#form_Category").val("");
  $("#form_Notification").val("");
  //$("#form_Color").val("#000000");
  $("#form_Description").val("");
}
