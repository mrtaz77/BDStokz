var cur_date = new Date();
var minDate = new Date('29 Jan 2023');
var oneMnth = new Date();
var sixMonth = new Date();
//minDate.setDate(cur_date.getDate()-365);
oneMnth.setDate(cur_date.getDate()-30);
sixMonth.setDate(cur_date.getDate()-180);

async function fun(){
    const response = await fetch('http://localhost:3000/stock/dsex'); 
    const dataString = await response.json();
//    let arr = [];
    let arr2 = [];
    //const inputArray = JSON.parse(dataString);
            dataString.forEach(item => {
                arr2.push([item.x,item.y]);
            });
var options = {

    chart: {
        type: 'area',
        height: 302,
        toolbar: {
            show: true,
        },
    },
    dataLabels: {
        enabled: false
    },
    series: [{
        data: arr2

    }, ],
    xaxis: {
        type: 'datetime',
        min: minDate.getTime(),
        tickAmount: 6,
        axisBorder: {
            show: true,
            color: '#bec7e0',
        },
        axisTicks: {
            show: true,
            color: '#bec7e0',
        },
    },
    colors: ['#22b783'],
    stroke: {
        width: [2],
        lineCap: 'round',
    },
    grid: {
        row: {
            colors: ['transparent', 'transparent'], // takes an array which will be repeated on columns
            opacity: 0.2,
        },
        strokeDashArray: 2.5,
    },
    tooltip: {
        x: {
            format: 'dd MMM yyyy'
        }
    },
    fill: {
        type: 'gradient',
        gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.7,
            opacityTo: 0.4,
            stops: [0, 100]
        }
    },
}

var chart = new ApexCharts(
    document.querySelector("#apex_area2"),
    options
);

chart.render();
var resetCssClasses = function(activeEl) {
    var els = document.querySelectorAll("button");
    Array.prototype.forEach.call(els, function(el) {
        el.classList.remove('active');
    });

    activeEl.target.classList.add('active')
}

document.querySelector("#one_month").addEventListener('click', function(e) {
    resetCssClasses(e)
    chart.updateOptions({
        xaxis: {
            min: oneMnth.getTime(),
            max: new Date().getTime(),
        }
    })
})

document.querySelector("#six_months").addEventListener('click', function(e) {
    resetCssClasses(e)
    chart.updateOptions({
        xaxis: {
            min: sixMonth.getTime(),
            max: new Date().getTime(),
        }
    })
})

document.querySelector("#one_year").addEventListener('click', function(e) {
    resetCssClasses(e)
    chart.updateOptions({
        xaxis: {
            min: minDate.getTime(),
            max: new Date().getTime(),
        }
    })
})

document.querySelector("#ytd").addEventListener('click', function(e) {
    resetCssClasses(e)
    chart.updateOptions({
        xaxis: {
            min: new Date('01 Jan 2013').getTime(),
            max: new Date('27 Feb 2013').getTime(),
        }
    })
})

document.querySelector("#all").addEventListener('click', function(e) {
    resetCssClasses(e)
    chart.updateOptions({
        xaxis: {
            min: undefined,
            max: undefined,
        }
    })
})

document.querySelector("#ytd").addEventListener('click', function() {

})
}
fun();