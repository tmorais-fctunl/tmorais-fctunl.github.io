
function statistics()
{
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
            title:
            {
                display: true,
                text: 'World population per region (in millions)'
            },
            responsiveAnimationDuration: 1500

        }
    };

    const areaChart = new Chart(area_ctx, areaConfig)
        const areaChartFull = new Chart(area_ctx_full, areaConfig)

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
            title:
            {
                display: true,
                text: 'Predicted world population (millions) in 2050'
            },
            responsiveAnimationDuration: 1500
        }
    };
    const barChart = new Chart(bar_ctx, bar_data)
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
            'Red',
            'Blue',
            'Yellow'
        ],
        datasets: [
            {
                label: 'My First Dataset',
                data: [300, 50, 100],
                backgroundColor: [
                    'rgb(255, 99, 132)',
                    'rgb(54, 162, 235)',
                    'rgb(255, 205, 86)'
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
            plugins:
            {
                legend:
                {
                    position: 'top',
                },
                title:
                {
                    display: true,
                    text: 'Chart.js Pie Chart'
                }
            },
            responsiveAnimationDuration: 1500
        },
    };
    const pieChart = new Chart(pie_ctx, pieConfig);
    const pieChartFull = new Chart(pie_ctx_full, pieConfig);
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

function apply()  {}

function saveStatistic()
{
    var list = document.getElementById("saved-statistics-list");
    var id = `${list.id}-${list.getElementsByTagName("li").length}`;
    var node = document.createElement("LI");
    node.setAttribute("id", id);
    node.classList.add("list-item-2");

    var child = `<div class="liststatisticdiv">
              <div class="text-block-7">
                From:
              </div>
              <div id="from-statistic-div" class="statisticssettingsdiv">
                <input type="date" disabled="disabled" /><input type="time" disabled="disabled" />
              </div>
              <div class="text-block-8">
                To:
              </div>
              <div id="to-statistic-div" class="statisticssettingsdiv">
                <input type="date" disabled="disabled" /><input type="time" disabled="disabled" />
              </div>
              <div class="div-block-27">
                <a id="delete-statistic-button" onclick="deleteFromList('${id}')" href="#" class="button-16-delete w-button">Delete</a><a id="load-statistic-button" data-w-id="86468e3f-a20e-4ffd-6875-9f1f8d6cdad7" href="#" class="button-16 w-button">Load</a>
              </div>
            </div>`;

    node.innerHTML = child;
    list.appendChild(node);
}

