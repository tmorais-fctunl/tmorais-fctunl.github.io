let tooltip_pie_bar =
{
    custom: function (tooltip)
    {
        tooltip.displayColors = false;
    },
    callbacks:
    {
        label: function (tooltipItem, data)
        {
            var labels = data.labels;
            var values = data.datasets[tooltipItem.datasetIndex].data;
            var index = tooltipItem.index;
            var value = data.datasets[tooltipItem.datasetIndex].data[index];

            let sum = 0;
            for (let i = 0; i < values.length; i++)
                sum += values[i];
            return Math.round((value / sum) * 100) + "% (" + Math.round(value) + " hours) of " + labels[index];
        }
    }
}

let tooltip_area =
{
    custom: function (tooltip)
    {
        tooltip.displayColors = false;
    },
    callbacks:
    {
        label: function (tooltipItem, data)
        {
            var labels = data.labels;
            var values = data.datasets[tooltipItem.datasetIndex].data;
            var index = tooltipItem.index;
            var value = data.datasets[tooltipItem.datasetIndex].data[index];

            if (index == 0)
                return "Beginning, no results.";

            let label = ["From " + labels[index - 1]];
            label.push("To " + labels[index]);

            label.push("");

            for (let i = 0; i < data.datasets.length; i++)
                label.push(data.datasets[i].label + ": " + Math.round(data.datasets[i].data[index]) + " hours");

            return label;
        },
        title: function (tooltipItem, data)
        {
            return "";
        }
    }
};

let area_config =
{
    type: 'line',
    data: {},
    options:
    {
        responsive: true,
        maintainAspectRatio: false,
        legend:
        {
            display: false
        },
        responsiveAnimationDuration: 1500,
        tooltips: tooltip_area
    }
};

let area_large_config =
{
    type: 'line',
    data: {},
    options:
    {
        responsive: true,
        maintainAspectRatio: false,
        responsiveAnimationDuration: 1500,
        tooltips: tooltip_area
    }
};

let bar_config =
{
    type: 'horizontalBar',
    data: {},
    options:
    {
        responsive: true,
        maintainAspectRatio: false,
        legend:
        {
            display: false
        },
        responsiveAnimationDuration: 1500,
        tooltips: tooltip_pie_bar
    }
};

let bar_large_config = bar_config;

let pie_config =
{
    type: 'pie',
    data: {},
    options:
    {
        responsive: true,
        maintainAspectRatio: false,
        legend:
        {
            display: false
        },
        responsiveAnimationDuration: 1500,
        tooltips: tooltip_pie_bar
    }
}

let pie_large_config =
{
    type: 'pie',
    data: {},
    options:
    {
        responsive: true,
        maintainAspectRatio: false,
        responsiveAnimationDuration: 1500,
        tooltips: tooltip_pie_bar
    },
};
