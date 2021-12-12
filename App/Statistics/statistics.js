
let statistics;
let current_statistic = null;
let temp_statistic = null;
let changed_dates = false;

function updateStatistics_SS()
{
    sessionStorage.setItem('statistics', JSON.stringify(statistics));
}

function updateCurrentStatistic_SS()
{
    sessionStorage.setItem('current_statistic', current_statistic);
}

function setDefaultStatistic()
{
    let from_date = document.getElementById("statistics-from-date");
    let to_date = document.getElementById("statistics-to-date");

    var today = new Date();
    var today_date = today.getFullYear() + '-' + ((today.getMonth() + 1) < 10 ? '0' : '') + (today.getMonth() + 1) + '-' + (today.getDate() < 10 ? '0' : '') + today.getDate() + 'T' + (today.getHours() < 10 ? '0' : '') + today.getHours() + ':' + (today.getMinutes() < 10 ? '0' : '') + today.getMinutes();

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    var yesterday_date = yesterday.getFullYear() + '-' + ((yesterday.getMonth() + 1) < 10 ? '0' : '') + (yesterday.getMonth() + 1) + '-' + (yesterday.getDate() < 10 ? '0' : '') + yesterday.getDate() + 'T' + (yesterday.getHours() < 10 ? '0' : '') + yesterday.getHours() + ':' + (yesterday.getMinutes() < 10 ? '0' : '') + yesterday.getMinutes();

    from_date.value = yesterday_date;
    to_date.value = today_date;

    temp_statistic =
    {
        notes:
        {
            pie: [],
            bar: [],
            area: []
        }
    };
    current_statistic = null;

    let dates =
    {
        from: from_date.value,
        to: to_date.value
    }

    return dates;
}

function start_statistics()
{
    statistics = default_statistics;

    let from_date = document.getElementById("statistics-from-date");
    let to_date = document.getElementById("statistics-to-date");

    get_statistics = sessionStorage.getItem('statistics');
    if (get_statistics == null)
    {
        let dates = setDefaultStatistic();
        from_date.value = dates.from;
        to_date.value = dates.to;
    }
    else
    {
        statistics = JSON.parse(get_statistics);

        current_statistic = sessionStorage.getItem('current_statistic');
        if (current_statistic != null && current_statistic != 'null')
        {
            current_statistic = parseInt(current_statistic);
            from_date.value = statistics[current_statistic].from_date;
            to_date.value = statistics[current_statistic].to_date;
            setStatisticNotes();
        }
        else
        {
            let dates = setDefaultStatistic();
            from_date.value = dates.from;
            to_date.value = dates.to;
        }
    }

    for (let i = 0; i < statistics.length; i++)
        addStatisticToDivList(statistics[i].from_date, statistics[i].to_date, statistics[i].id);

    reloadGraphs(from_date.value, to_date.value);
    updateStatistics_SS();
    updateCurrentStatistic_SS();
}

function saveNote(graph)
{
    let list;
    let text;

    if (graph == "pie")
    {
        text = document.getElementById("pie-new-note").value;
        list = document.getElementById("pie-notes-list");
    }
    if (graph == "bar")
    {
        text = document.getElementById("bar-new-note").value;
        list = document.getElementById("bar-notes-list");
    }
    if (graph == "area")
    {
        text = document.getElementById("area-new-note").value;
        list = document.getElementById("area-notes-list");
    }

    let elems = list.getElementsByTagName("li");
    let suf = 0;
    for (let i = 0; i < elems.length; i++)
    {
        let num = parseInt(elems[i].id.split(list.id + '-')[1]);
        if (num >= suf)
            suf = num + 1;
    }

    let note =
    {
        text: text,
        id: suf
    };

    if (graph == "pie")
    {
        if (current_statistic != null)
            statistics[current_statistic].notes.pie.push(note);
        else
            temp_statistic.notes.pie.push(note);
    }
    if (graph == "bar")
    {
        if (current_statistic != null)
            statistics[current_statistic].notes.bar.push(note);
        else
            temp_statistic.notes.bar.push(note);
    }
    if (graph == "area")
    {
        if (current_statistic != null)
            statistics[current_statistic].notes.area.push(note);
        else
            temp_statistic.notes.area.push(note);
    }

    document.getElementById("pie-new-note").value = "";
    document.getElementById("bar-new-note").value = "";
    document.getElementById("area-new-note").value = "";

    addNote_ToDiv(list, suf, text);
    updateStatistics_SS();
}

function addNote_ToDiv(list, note_id, text)
{
    var id = `${list.id}-${note_id}`;
    var node = document.createElement("LI");
    node.setAttribute("id", id);
    node.classList.add("list-item");

    child = `<div class="div-block-21">
            <div class="text-block-6">${text}</div>
          </div><a onclick="deleteFromNotesList('${id}')" href="#" class="button-15 w-button">X</a>`;

    node.innerHTML = child;
    list.appendChild(node);
}

function deleteFromNotesList(id)
{
    deleteFromList(id);
    if (current_statistic != null)
    {
        elem = id.split('-')[3];
        list = id.split('-')[0];
        if (list == "pie")
        {
            for (let i = 0; i < statistics[current_statistic].notes.pie.length; i++)
            {
                if (statistics[current_statistic].notes.pie[i].id == elem)
                {
                    statistics[current_statistic].notes.pie.splice(i, 1);
                    break;
                }
            }
        }
        if (list == "bar")
        {
            for (let i = 0; i < statistics[current_statistic].notes.bar.length; i++)
            {
                if (statistics[current_statistic].notes.bar[i].id == elem)
                {
                    statistics[current_statistic].notes.bar.splice(i, 1);
                    break;
                }
            }
        }
        if (list == "area")
        {
            for (let i = 0; i < statistics[current_statistic].notes.area.length; i++)
            {
                if (statistics[current_statistic].notes.area[i].id == elem)
                {
                    statistics[current_statistic].notes.area.splice(i, 1);
                    break;
                }
            }
        }
        updateStatistics_SS();
    }
}

function deleteFromList(id)
{
    var item = document.getElementById(id);
    while (item.firstChild)
        item.firstChild.remove()

        item.parentNode.removeChild(item);
}

function clearNotes()
{
    console.log("clear")
    document.getElementById("pie-new-note").value = "";
    document.getElementById("bar-new-note").value = "";
    document.getElementById("area-new-note").value = "";

    var list = document.getElementById("pie-notes-list");
    elems = list.getElementsByTagName("li");
    while (elems.length > 0)
    {
        elems = list.getElementsByTagName("li");

        for (let i = 0; i < elems.length; i++)
            deleteFromList(elems[i].id);
    }

    list = document.getElementById("bar-notes-list");
    elems = list.getElementsByTagName("li");
    while (elems.length > 0)
    {
        elems = list.getElementsByTagName("li");

        for (let i = 0; i < elems.length; i++)
            deleteFromList(elems[i].id);
    }

    list = document.getElementById("area-notes-list");
    elems = list.getElementsByTagName("li");
    while (elems.length > 0)
    {
        elems = list.getElementsByTagName("li");

        for (let i = 0; i < elems.length; i++)
            deleteFromList(elems[i].id);
    }
}

function setStatisticNotes()
{
    for (let i = 0; i < statistics[current_statistic].notes.pie.length; i++)
    {
        let note = statistics[current_statistic].notes.pie[i];
        addNote_ToDiv(document.getElementById("pie-notes-list"), note.id, note.text);
    }

    for (let i = 0; i < statistics[current_statistic].notes.bar.length; i++)
    {
        let note = statistics[current_statistic].notes.bar[i];
        addNote_ToDiv(document.getElementById("bar-notes-list"), note.id, note.text);
    }

    for (let i = 0; i < statistics[current_statistic].notes.area.length; i++)
    {
        let note = statistics[current_statistic].notes.area[i];
        addNote_ToDiv(document.getElementById("area-notes-list"), note.id, note.text);
    }
}

function loadStatistic(id)
{
    document.getElementById("saved-statistics-side-menu").style.display = "none";
    document.getElementById("statistics-something-went-wrong-div").style.display = "none";
    document.getElementById("already-exists-statistic-message-div").style.display = "none";
    document.getElementById("statistics-wrong-start-end-div").style.display = "none";

    clearNotes();

    temp_statistic = null;
    changed_dates = false;

    let statistic_from = document.getElementById(`statistics-from-date-${id}`).value;
    let statistic_to = document.getElementById(`statistics-to-date-${id}`).value;

    let from_date = document.getElementById("statistics-from-date");
    let to_date = document.getElementById("statistics-to-date");

    from_date.value = statistic_from;
    to_date.value = statistic_to;

    for (let i = 0; i < statistics.length; i++)
    {
        if (statistics[i].id == id)
        {
            current_statistic = i;
            break;
        }
    }

    reloadGraphs(from_date.value, to_date.value);
    setStatisticNotes();
    updateCurrentStatistic_SS();
}

function deleteFromStatisticsList(id)
{
    deleteFromList(`saved-statistics-list-${id}`);
    var list = document.getElementById("saved-statistics-list");
    var elems = list.getElementsByTagName("li");

    if (elems.length == 0)
        document.getElementById("saved-statistics-side-menu").style.display = "none";

    for (let i = 0; i < statistics.length; i++)
    {
        if (statistics[i].id == parseInt(id))
        {
            if (i == current_statistic)
            {
                clearNotes();
                setDefaultStatistic();
            }
            if (i < current_statistic)
                current_statistic -= 1;

            statistics.splice(i, 1);
            break;
        }
    }

    updateStatistics_SS();
    updateCurrentStatistic_SS();
}

function loadMoreStatistics()
{
    var list = document.getElementById("saved-statistics-list");
    var elems = list.getElementsByTagName("li");

    if (elems.length == 0)
        document.getElementById("no-more-results-div").style.display = "block";
    else
        document.getElementById("no-more-results-div").style.display = "none";

}

function saveStatistic()
{
    document.getElementById("statistics-something-went-wrong-div").style.display = "none";
    document.getElementById("already-exists-statistic-message-div").style.display = "none";
    document.getElementById("statistics-wrong-start-end-div").style.display = "none";

    let from_date = document.getElementById("statistics-from-date").value;
    let to_date = document.getElementById("statistics-to-date").value;

    if (!checkValidDates())
        return;

    for (var i = 0; i < statistics.length; i++)
    {
        if (statistics[i].from_date == from_date && statistics[i].to_date == to_date)
        {
            document.getElementById("already-exists-statistic-message-div").style.display = "block";
            return;
        }
    }

    let id = 0;
    for (let i = 0; i < statistics.length; i++)
    {
        if (statistics[i].id >= id)
            id = statistics[i].id + 1;
    }

    addStatisticToDivList(from_date, to_date, id);

    let notes =
    {
        pie: [],
        bar: [],
        area: []
    };

    if (temp_statistic != null)
        notes = temp_statistic.notes;

    let new_statistic =
    {
        from_date: from_date,
        to_date: to_date,
        id: id,
        notes: notes
    };

    statistics.push(new_statistic);
    current_statistic = statistics.length - 1;
    updateStatistics_SS();
    updateCurrentStatistic_SS();

    temp_statistic = null;
    changed_dates = false;
}

function addStatisticToDivList(from_date, to_date, id)
{
    var list = document.getElementById("saved-statistics-list");
    var statistic_id = `${list.id}-${id}`;
    var node = document.createElement("LI");
    node.setAttribute("id", statistic_id);
    node.classList.add("list-item-2");

    var child = `<div class="liststatisticdiv">
              <div class="text-block-7">
                From:
              </div>
              <div id="from-statistic-div" class="statisticssettingsdiv">
                <input id="statistics-from-date-${id}" type="datetime-local" disabled="disabled" value='${from_date}' style="width: 100%"/>
              </div>
              <div class="text-block-8">
                To:
              </div>
              <div id="to-statistic-div" class="statisticssettingsdiv">
                <input id="statistics-to-date-${id}" type="datetime-local" disabled="disabled" value='${to_date}' style="width: 100%"/>
              </div>
              <div class="div-block-27">
                <a id="delete-statistic-button" onclick="deleteFromStatisticsList('${id}')" href="#" class="button-16-delete w-button">Delete</a>
                <a onclick="loadStatistic('${id}')" id="load-statistic-button" data-w-id="86468e3f-a20e-4ffd-6875-9f1f8d6cdad7" href="#" class="button-16 w-button">Load</a>
              </div>
            </div>`;

    node.innerHTML = child;
    list.appendChild(node);
}

function checkValidDates()
{
    let from_date = document.getElementById("statistics-from-date").value;
    let to_date = document.getElementById("statistics-to-date").value;

    let start_date = new Date(from_date);
    let end_date = new Date(to_date);

    if (from_date == "" || to_date == "")
    {
        document.getElementById("statistics-something-went-wrong-div").style.display = "block";
        return false;
    }
    if (start_date >= end_date)
    {
        document.getElementById("statistics-wrong-start-end-div").style.display = "block";
        return false;
    }
    return true;
}

function apply()
{
    document.getElementById("statistics-something-went-wrong-div").style.display = "none";
    document.getElementById("already-exists-statistic-message-div").style.display = "none";
    document.getElementById("statistics-wrong-start-end-div").style.display = "none";

    let from_date = document.getElementById("statistics-from-date").value;
    let to_date = document.getElementById("statistics-to-date").value;

    if (!checkValidDates())
        return;

    reloadGraphs(from_date, to_date);

    clearNotes();   

    if (changed_dates)
    {
        temp_statistic =
        {
            notes:
            {
                pie: [],
                bar: [],
                area: []
            }
        };
        current_statistic = null;
    }

    if (current_statistic != null)
        setStatisticNotes();

    updateCurrentStatistic_SS();
}

let changedStatistic = function ()
{
    changed_dates = true;

    if (checkValidDates())
        clearNotes();

    current_statistic = null;
};

$(document).ready(function ()
{

    $("#statistics-to-date").change(changedStatistic);

}
);

$(document).ready(function ()
{

    $("#statistics-from-date").change(changedStatistic);

}
);