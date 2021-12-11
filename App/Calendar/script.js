var canTrigger = true;
var task_counter = 0;
let notifications = ["Never","5min","10min","30min","1h","1day"];
let frequencies = ["None","Every day"];
let hour_positions = [4.16,8.32,12.48,16.64,20.80,24.96,29.12,33.28,37.44,41.60,45.76,49.92,54.08,58.24,62.40,66.56,70.72,74.88,79.04,83.20,87.36,91.52,95.68]
let tasks = [];
let uniqueTasks = [];

function DateTimeListenerFunction() {
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
}

window.onload = function() {
  document.getElementById("form_Start_date").addEventListener('input', function (evt) {
      DateTimeListenerFunction()
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
}

function taskLeftPos(start_day, top_pos, duration){
  let width = 0;
  console.log(tasks);
  for (let n=0; n<tasks.length; n++){
    console.log("POS: "+top_pos+" TASK "+n+" POS: "+tasks[n].pos+" POS+DURATION "+parseInt(parseInt(tasks[n].pos)+parseInt(tasks[n].duration)))
    if (tasks[n].day == start_day) {
      console.log("a");
      if((top_pos <= tasks[n].pos <= top_pos+duration) || (top_pos <= tasks[n].pos+tasks[n].duration <= top_pos+duration)
        || (tasks[n].pos <= top_pos <= tasks[n].pos+tasks[n].duration) || (tasks[n].pos <= top_pos+duration <= tasks[n].pos+tasks[n].duration)) {
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
}

function pushTask(id,start_day,i,pos,height,width,subtaskclass,color,name) {
  console.log(color);
  console.log("Push Task day:"+start_day+" with height: "+height);
  let task = '<div name="task_'+id+'" id="task_'+id+'_'+i+'" style="position:absolute; top:'+pos+'%; left:'+width+'%; height:'+height+'%; border-left-color:'+color+'" class="task '+subtaskclass+'">'+name+'</div>';
  $("#day-"+(start_day)).append(task);
  tasks.push({day:start_day, pos:pos, duration:height, width:$('#task_'+id+'_'+i).width()});
  declareTaskTriggerHandlers(id,i);
}

function addActivity() {
  let name = $("#form_Name").val();
  let start_day = new Date($("#form_Start_date").val()).getDate();
  let end_day = new Date($("#form_End_date").val()).getDate();
  let start_time = $("#form_Start_time").val().split(':');
  let end_time = $("#form_End_time").val().split(':');
  let freq = $("#form_Frequency");
  let notif = $("#form_Notification");
  let color = $("#form_Color").val();

  start_hour = parseInt(start_time[0]);
  start_min = parseInt(start_time[1]);
  end_hour = parseInt(end_time[0]);
  end_min = parseInt(end_time[1]);
  var duration = [];
  let day_dur = parseInt(end_day)-parseInt(start_day);

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
  let id = task_counter;
  let fst_height = 4.18*duration[0];
  let lst_height = 4.18*duration[day_dur];

  if (day_dur == 0) {
    let width = 0;
    width = taskLeftPos(start_day, top_pos, fst_height);
    if (fst_height==0)
      fst_height = 1;
    /*task = '<div name="task_'+id+'" id="task_'+id+'_'+'0'+'" style="position:absolute; top:'+top_pos+'%; left:'+width+'%; height:'+fst_height+'%" class="task">'+"teste  "+'</div>';
    $("#day-"+(start_day)).append(task);
    tasks.push({day:start_day, pos:top_pos, duration:fst_height, width:$('#task_'+id+'_'+'0').width()});*/
    pushTask(id,start_day,0,top_pos,fst_height,width,"",color,name);

  }
  else {
    for (let i=0; i<day_dur+1; i++) {
      console.log("Now adding day:"+ (start_day + i));
      let width = 0;
      if (i==0) {
        width = taskLeftPos(start_day+i, top_pos, fst_height);
        pushTask(id,start_day+i,i,top_pos,fst_height-2,width,"task-fst",color,name);
      }
      else if (i!=day_dur) {
        width = taskLeftPos(start_day+i, 0, 98.0);
        pushTask(id,start_day+i,i,0,98.0,width,"task-mid",color,name);
      }
      else {
        width = taskLeftPos(start_day+i, 0, lst_height);
        pushTask(id,start_day+i,i,0,lst_height,width,"task-end",color,name);
      }
    }
  }

  //TODO {
    /*let task_object = {
      id:id,
      /...

      }

    uniqueTasks.push(task_object);*/
  //}
  task_counter++;

  alert("Task successfully added!");
  clearForm();
  closeForm();
}

function openForm() {
  document.getElementById("activityFormContainer").style.display = "block";
}

function closeForm() {
  clearForm();
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
  $("#form_Color").val("#000000");
}
