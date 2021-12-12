let barChart = null;
let barChartLarge = null;
let bar_ctx = null;
let bar_large_ctx = null;

let areaChart = null;
let areaChartLarge = null;
let area_ctx = null;
let area_large_ctx = null;

let pieChart = null;
let pieChartLarge = null;
let pie_ctx = null;
let pie_large_ctx = null;

function destroyLargeGraphs()
{
    if (barChartLarge != null)
        barChartLarge.destroy();

    if (areaChartLarge != null)
        areaChartLarge.destroy();

    if (pieChartLarge != null)
        pieChartLarge.destroy();
}

function destroySmallGraphs()
{
    if (barChart != null)
        barChart.destroy();

    if (areaChart != null)
        areaChart.destroy();

    if (pieChart != null)
        pieChart.destroy();
}

function reloadLargeGraphs()
{
    destroyLargeGraphs();
    barChartLarge = new Chart(bar_large_ctx, bar_large_config);
    areaChartLarge = new Chart(area_large_ctx, area_large_config);
    pieChartLarge = new Chart(pie_large_ctx, pie_large_config);
}

function decimalHoursToString(hours_dec)
{
    let a = Math.floor(hours_dec);
    let b = hours_dec - a;
    let c = Math.floor(b * 60);

    let hours = a.toFixed(0);
    let minutes = c.toFixed(0);

    return (hours > 0 ? hours + "h" : "") + (minutes > 0 ? minutes + "min" : "");
}

function splitDateIntoEqualIntervals(start_date, end_date, numberOfIntervals)
{

    let diff = end_date.getTime() - start_date.getTime();
    let intervalLength = diff / numberOfIntervals;
    let intervals = [start_date];
    for (let i = 1; i <= numberOfIntervals; i++)
        intervals.push(new Date(start_date.getTime() + i * intervalLength));

    return intervals;
}

function areaDataset(events, start_date, end_date)
{

    let num__of_intervals = 10;

    let labels = [];
    let data = [[], [], [], []];
    let intervals = splitDateIntoEqualIntervals(start_date, end_date, num__of_intervals);

    for (let i = 0; i < num__of_intervals + 1; i++)
    {
        labels.push(intervals[i].toDateString());
        data[0].push(0);
        data[1].push(0);
        data[2].push(0);
        data[3].push(0);
    }

    for (let j = 0; j < intervals.length - 1; j++)
    {
        let interval_start = intervals[j];
        let interval_end = intervals[j + 1];

        for (let i = 0; i < events.length; i++)
        {
            let event_start = new Date(events[i].start_date_time);
            let event_end = new Date(events[i].end_date_time);

            if (!eventIntersects(event_start, event_end, interval_start, interval_end))
                continue;

            let int_start = maxDate(event_start, interval_start);
            let int_end = minDate(event_end, interval_end);

            let date = new Date(Date.UTC(1970, 0, 1, 0, 0, 0, int_end - int_start));

            let time = (date.getDate() - 1) * 24 + date.getHours() + date.getMinutes() / 60.0;
            switch (events[i].category)
            {
            case "Studying":
                data[0][j + 1] += time;
                break;
            case "Gaming":
                data[1][j + 1] += time;
                break;
            case "Sleeping":
                data[2][j + 1] += time;
                break;
            case "Exercising":
                data[3][j + 1] += time;
                break;
            default:
                console.log("Invalid Category: areaDataset()");
            }
        }
    }

    area_data =
    {
        labels: labels,
        datasets: [
            {
                data: data[0],
                label: "Studying",
                borderColor: "rgb(255, 99, 132)",
                fill: false
            },
            {
                data: data[1],
                label: "Gaming",
                borderColor: "rgb(54, 162, 235)",
                fill: false
            },
            {
                data: data[2],
                label: "Sleeping",
                borderColor: "rgb(255, 205, 86)",
                fill: false
            },
            {
                data: data[3],
                label: "Exercising",
                borderColor: "#3cba9f",
                fill: false
            }
        ]
    };
}

function maxDate(a, b)
{
    return a > b ? a : b;
}

function minDate(a, b)
{
    return a < b ? a : b;
}

function eventIntersects(event_start, event_end, start_date, end_date)
{
    return !(start_date > event_end || event_start > end_date);
}

function pieBarDataset(events, start_date, end_date)
{
    let data = [0, 0, 0, 0];

    for (let i = 0; i < events.length; i++)
    {
        let event_start = new Date(events[i].start_date_time);
        let event_end = new Date(events[i].end_date_time);

        if (!eventIntersects(event_start, event_end, start_date, end_date))
            continue;

        let int_start = maxDate(event_start, start_date);
        let int_end = minDate(event_end, end_date);

        let date = new Date(Date.UTC(1970, 0, 1, 0, 0, 0, int_end - int_start));

        let time = (date.getDate() - 1) * 24 + date.getHours() + date.getMinutes() / 60.0 + date.getTimezoneOffset() / 60;

        console.log(events[i].category);
        console.log(event_start);
        console.log(event_end);
        console.log(date); 
        console.log(time);
        switch (events[i].category)
        {
        case "Studying":
            data[0] += time;
            break;
        case "Gaming":
            data[1] += time;
            break;
        case "Sleeping":
            data[2] += time;
            break;
        case "Exercising":
            data[3] += time;
            break;
        default:
            console.log("Invalid Category: pieBarDataset()");
        }
    }

    pie_bar_data =
    {
        labels: [
            'Studying',
            'Gaming',
            'Sleeping',
            'Exercising'
        ],
        datasets: [
            {
                data: data,
                backgroundColor: [
                    'rgb(255, 99, 132)',
                    'rgb(54, 162, 235)',
                    'rgb(255, 205, 86)',
                    '#3cba9f'
                ],
                hoverOffset: 4,
                fill: true,
            }
        ]
    };
}

function setDatasets(from_date, to_date)
{
    events = default_events;

    let get_events = sessionStorage.getItem('events');

    if (get_events != null)
        events = JSON.parse(get_events);

    sessionStorage.setItem('events', JSON.strigify(events));

    let start_date = new Date(from_date);
    let end_date = new Date(to_date);

    areaDataset(events, start_date, end_date);
    pieBarDataset(events, start_date, end_date);
}

function reloadGraphs(from_date, to_date)
{
    destroyLargeGraphs();
    destroySmallGraphs();

    setDatasets(from_date, to_date);

    area_ctx = document.getElementById('areaChart').getContext('2d');
    area_large_ctx = document.getElementById('areaChartLarge').getContext('2d');

    area_config.data = area_data;
    area_large_config.data = area_data;
    areaChart = new Chart(area_ctx, area_config);
    areaChartLarge = new Chart(area_large_ctx, area_large_config);

    bar_ctx = document.getElementById('barChart').getContext('2d');
    bar_large_ctx = document.getElementById('barChartLarge').getContext('2d');

    bar_config.data = pie_bar_data;
    bar_large_config.data = pie_bar_data;
    barChart = new Chart(bar_ctx, bar_config);
    barChartLarge = new Chart(bar_large_ctx, bar_large_config);

    pie_ctx = document.getElementById('pieChart').getContext('2d');
    pie_large_ctx = document.getElementById('pieChartLarge').getContext('2d');
    pie_data = pie_bar_data;
    pie_config.data = pie_data;
    pie_large_config.data = pie_data;
    pieChart = new Chart(pie_ctx, pie_config);
    pieChartLarge = new Chart(pie_large_ctx, pie_large_config);
}
