function setDatasets(){

}

function reloadLargeGraphs(){
    const bar_large_ctx = document.getElementById('barChartFull').getContext('2d');
    const barChartLarge = new Chart(bar_large_ctx, bar_large_config);

    const area_large_ctx = document.getElementById('areaChartFull').getContext('2d');
    const areaChartLarge = new Chart(area_large_ctx, area_large_config);

    const pie_large_ctx = document.getElementById('pieChartFull').getContext('2d');
    const pieChartLarge = new Chart(pie_large_ctx, pie_large_config);
}

function reloadGraphs(from_date, to_date)
{
    const area_ctx = document.getElementById('areaChart').getContext('2d');
    const area_ctx_full = document.getElementById('areaChartFull').getContext('2d');
    const area_data =
    {
        labels: [1500, 1600, 1700, 1750, 1800, 1850, 1900, 1950, 1999, 2050],
        datasets: [
            {
                data: [86, 114, 106, 106, 107, 111, 133, 221, 783, 2478],
                label: "Studying",
                borderColor: "rgb(255, 99, 132)",
                fill: false
            },
            {
                data: [282, 350, 411, 502, 635, 809, 947, 1402, 3700, 5267],
                label: "Gaming",
                borderColor: "rgb(54, 162, 235)",
                fill: false
            },
            {
                data: [168, 170, 178, 190, 203, 276, 408, 547, 675, 734],
                label: "Sleeping",
                borderColor: "rgb(255, 205, 86)",
                fill: false
            },
            {
                data: [40, 20, 10, 16, 24, 38, 74, 167, 508, 784],
                label: "Exercising",
                borderColor: "#3cba9f",
                fill: false
            }
        ]
    };
    area_config.data = area_data;
    area_large_config.data = area_data;
    const areaChart = new Chart(area_ctx, area_config);
    const areaChartFull = new Chart(area_ctx_full, area_large_config);

    const bar_ctx = document.getElementById('barChart').getContext('2d');
    const bar_ctx_full = document.getElementById('barChartFull').getContext('2d');
    const bar_data =
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
    bar_config.data = bar_data;
    bar_large_config.data = bar_data;
    const barChart = new Chart(bar_ctx, bar_config);
    const barChartFull = new Chart(bar_ctx_full, bar_large_config);

    const pie_ctx = document.getElementById('pieChart').getContext('2d');
    const pie_ctx_full = document.getElementById('pieChartFull').getContext('2d');
    pie_data = bar_data;
    pie_config.data = pie_data;
    pie_large_config.data = pie_data;
    const pieChart = new Chart(pie_ctx, pie_config);
    const pieChartFull = new Chart(pie_ctx_full, pie_large_config);
}