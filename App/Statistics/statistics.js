
function statistics()
{
    const bar_ctx = document.getElementById('myChart').getContext('2d');
    const myChart = new Chart(bar_ctx,
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
                legend:
                {
                    display: false
                },
                title:
                {
                    display: true,
                    text: 'Predicted world population (millions) in 2050'
                }
            }
        }
        );

    const pie_ctx = document.getElementById('pieChart').getContext('2d');
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
            }
        },
    };
    const pieChart = new Chart(pie_ctx, pieConfig)

        const area_ctx = document.getElementById('areaChart').getContext('2d');

    const areaConfig =
    {
  type: 'line',
  data: {
    labels: [1500,1600,1700,1750,1800,1850,1900,1950,1999,2050],
    datasets: [{ 
        data: [86,114,106,106,107,111,133,221,783,2478],
        label: "Africa",
        borderColor: "#3e95cd",
        fill: false
      }, { 
        data: [282,350,411,502,635,809,947,1402,3700,5267],
        label: "Asia",
        borderColor: "#8e5ea2",
        fill: false
      }, { 
        data: [168,170,178,190,203,276,408,547,675,734],
        label: "Europe",
        borderColor: "#3cba9f",
        fill: false
      }, { 
        data: [40,20,10,16,24,38,74,167,508,784],
        label: "Latin America",
        borderColor: "#e8c3b9",
        fill: false
      }, { 
        data: [6,3,2,2,7,26,82,172,312,433],
        label: "North America",
        borderColor: "#c45850",
        fill: false
      }
    ]
  },
  options: {
    maintainAspectRatio: false,
    title: {
      display: true,
      text: 'World population per region (in millions)'
    }
  }
};
    const areaChart = new Chart(area_ctx, areaConfig)
}
