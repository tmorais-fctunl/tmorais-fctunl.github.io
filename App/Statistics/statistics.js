
function statistics()
{
    var today = new Date();
    var today_date = today.getFullYear() + '-' + ((today.getMonth() + 1) < 10 ? '0' : '') + (today.getMonth() + 1) + '-' + (today.getDate() < 10 ? '0' : '') + today.getDate() + 'T' + (today.getHours() < 10 ? '0' : '') + today.getHours() + ':' + (today.getMinutes() < 10 ? '0' : '') + today.getMinutes();

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    var yesterday_date = yesterday.getFullYear() + '-' + ((yesterday.getMonth() + 1) < 10 ? '0' : '') + (yesterday.getMonth() + 1) + '-' + (yesterday.getDate() < 10 ? '0' : '') + yesterday.getDate() + 'T' + (yesterday.getHours() < 10 ? '0' : '') + yesterday.getHours() + ':' + (yesterday.getMinutes() < 10 ? '0' : '') + yesterday.getMinutes();

    from_date = document.getElementById("statistics-from-date");
    to_date = document.getElementById("statistics-to-date");

    from_date.value = yesterday_date;
    to_date.value = today_date;

    reloadGraphs();
}

function saveNote(graph)
{
    let text;
    let list;
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
    if (text != "")
    {
        var id = `${list.id}-${list.getElementsByTagName("li").length}`;
        var node = document.createElement("LI");
        node.setAttribute("id", id);
        node.classList.add("list-item");

        child = `<div class="div-block-21">
                <div class="text-block-6">${text}</div>
              </div><a onclick="deleteFromList('${id}')" href="#" class="button-15 w-button">X</a>`;

        node.innerHTML = child;
        list.appendChild(node);
    }
}

function deleteFromList(id)
{
    var item = document.getElementById(id);
    item.parentNode.removeChild(item);
}

function reloadGraphs()
{
    from_date = document.getElementById("statistics-from-date").value;
    to_date = document.getElementById("statistics-to-date").value;

    const area_ctx = document.getElementById('areaChart').getContext('2d');
    const area_ctx_full = document.getElementById('areaChartFull').getContext('2d');

    const areaConfig =
    {
        type: 'line',
        data:
        {
            labels: [1500, 1600, 1700, 1750, 1800, 1850, 1900, 1950, 1999, 2050],
            datasets: [
                {
                    data: [86, 114, 106, 106, 107, 111, 133, 221, 783, 2478],
                    label: "Africa",
                    borderColor: "#3e95cd",
                    fill: false
                },
                {
                    data: [282, 350, 411, 502, 635, 809, 947, 1402, 3700, 5267],
                    label: "Asia",
                    borderColor: "#8e5ea2",
                    fill: false
                },
                {
                    data: [168, 170, 178, 190, 203, 276, 408, 547, 675, 734],
                    label: "Europe",
                    borderColor: "#3cba9f",
                    fill: false
                },
                {
                    data: [40, 20, 10, 16, 24, 38, 74, 167, 508, 784],
                    label: "Latin America",
                    borderColor: "#e8c3b9",
                    fill: false
                },
                {
                    data: [6, 3, 2, 2, 7, 26, 82, 172, 312, 433],
                    label: "North America",
                    borderColor: "#c45850",
                    fill: false
                }
            ]
        },
        options:
        {
            responsive: true,
            maintainAspectRatio: false,
            legend:
            {
                display: false
            },
            title:
            {
                display: true,
                text: 'World population per region (in millions)'
            },
            responsiveAnimationDuration: 1500

        }
    };

    const areaChart = new Chart(area_ctx, areaConfig);
    const areaChartFull = new Chart(area_ctx_full, areaConfig);

    const bar_ctx = document.getElementById('barChart').getContext('2d');
    const bar_ctx_full = document.getElementById('barChartFull').getContext('2d');
    const bar_data =
    {
        type: 'horizontalBar',
        data:
        {
            labels: ["Africa", "Asia", "Europe", "Latin America", "North America"],
            datasets: [
                {
                    label: "Population (millions)",
                    backgroundColor: ["#3e95cd", "#8e5ea2", "#3cba9f", "#e8c3b9", "#c45850"],
                    data: [2478, 5267, 734, 784, 433]
                }
            ]
        },
        options:
        {
            responsive: true,
            maintainAspectRatio: false,
            legend:
            {
                display: false
            },
            responsiveAnimationDuration: 1500
        }
    };
    const barChart = new Chart(bar_ctx, bar_data);
    const barChartFull = new Chart(bar_ctx_full, bar_data)

        const pie_ctx = document.getElementById('pieChart').getContext('2d');
    const pie_ctx_full = document.getElementById('pieChartFull').getContext('2d');

    const DATA_COUNT = 5;
    const NUMBER_CFG =
    {
        count: DATA_COUNT,
        min: 0,
        max: 100
    };

    const pie_data =
    {
        labels: [
            'Studying',
            'Gaming',
            'Sleeping',
            'Exercising'
        ],
        datasets: [
            {
                data: [300, 50, 100, 20],
                backgroundColor: [
                    'rgb(255, 99, 132)',
                    'rgb(54, 162, 235)',
                    'rgb(255, 205, 86)',
                    '#3cba9f'
                ],
                hoverOffset: 4
            }
        ]
    };
    const pieConfig =
    {
        type: 'pie',
        data: pie_data,
        options:
        {
            responsive: true,
            maintainAspectRatio: false,
            legend:
            {
                display: false
            },
            responsiveAnimationDuration: 1500
        },
    };
    const pieChart = new Chart(pie_ctx, pieConfig);
    const pieChartFull = new Chart(pie_ctx_full, pieConfig);
}

function apply()
{
    document.getElementById("statistics-something-went-wrong-div").style.display = "none";

    from_date = document.getElementById("statistics-from-date").value;
    to_date = document.getElementById("statistics-to-date").value;

    if (from_date == "" || to_date == "")
    {
        document.getElementById("statistics-something-went-wrong-div").style.display = "block";
        return;
    }

    reloadGraphs();
}

function loadStatistic(id)
{
    document.getElementById("saved-statistics-side-menu").style.display = "none";
    document.getElementById("statistics-something-went-wrong-div").style.display = "none";
    document.getElementById("already-exists-statistic-message-div").style.display = "none";

    statistic_from = document.getElementById(`statistics-from-date-${id}`).value;
    statistic_to = document.getElementById(`statistics-to-date-${id}`).value;

    from_date = document.getElementById("statistics-from-date");
    to_date = document.getElementById("statistics-to-date");

    from_date.value = statistic_from;
    to_date.value = statistic_to;

    reloadGraphs();
}

function deleteFromStatisticsList(id)
{
    deleteFromList(id);
    var list = document.getElementById("saved-statistics-list");
    var elems = list.getElementsByTagName("li");

    if (elems.length == 0)
        document.getElementById("saved-statistics-side-menu").style.display = "none";
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

    from_date = document.getElementById("statistics-from-date").value;
    to_date = document.getElementById("statistics-to-date").value;

    if (from_date == "" || to_date == "")
    {
        document.getElementById("statistics-something-went-wrong-div").style.display = "block";
        return;
    }

    var list = document.getElementById("saved-statistics-list");

    var elems = list.getElementsByTagName("li");
    for (var i = 0; i < elems.length; i++)
    {
        elem_id = elems[i].id.split("saved-statistics-list-")[1];
        elem_from = document.getElementById(`statistics-from-date-${elem_id}`);
        elem_to = document.getElementById(`statistics-to-date-${elem_id}`);

        if (elem_from.value == from_date && elem_to.value == to_date)
        {
            document.getElementById("already-exists-statistic-message-div").style.display = "block";
            return;
        }
    }

    var id = `${list.id}-${elems.length}`;
    var node = document.createElement("LI");
    node.setAttribute("id", id);
    node.classList.add("list-item-2");

    var child = `<div class="liststatisticdiv">
              <div class="text-block-7">
                From:
              </div>
              <div id="from-statistic-div" class="statisticssettingsdiv">
                <input id="statistics-from-date-${elems.length}" type="datetime-local" disabled="disabled" value='${from_date}' style="width: 100%"/>
              </div>
              <div class="text-block-8">
                To:
              </div>
              <div id="to-statistic-div" class="statisticssettingsdiv">
                <input id="statistics-to-date-${elems.length}" type="datetime-local" disabled="disabled" value='${to_date}' style="width: 100%"/>
              </div>
              <div class="div-block-27">
                <a id="delete-statistic-button" onclick="deleteFromStatisticsList('${id}')" href="#" class="button-16-delete w-button">Delete</a>
                <a onclick="loadStatistic('${elems.length}')" id="load-statistic-button" data-w-id="86468e3f-a20e-4ffd-6875-9f1f8d6cdad7" href="#" class="button-16 w-button">Load</a>
              </div>
            </div>`;

    node.innerHTML = child;
    list.appendChild(node);
}
