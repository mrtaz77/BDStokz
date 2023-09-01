




async function fun(){
    const response = await fetch('http://localhost:3000/stock/dsex'); // Change the URL to your backend API endpoint
    const dataString = await response.json();
//    let arr = [];
    let arr2 = [];
    const inputArray = JSON.parse(dataString);
            inputArray.forEach(item => {
                arr2.push([item.x,item.y]);
            });
//    const parseStringToList = async (inputString) => {
//     //function parseStringToList(inputString) {
//         try {
//             //const stringWithReplacedQuotes = "'" + inputString + "'";
//             console.log(inputString);
//             const inputArray = JSON.parse(inputString);
//             const dataArray = inputArray.forEach(item => {
//                 const [timestamp, value] = item; 
//                 console.log(item);// Destructure the array into timestamp and value
//                 return [timestamp, value]; 
//             });
//             return dataArray;
//         } catch (error) {
//             console.error('Error converting to ApexChart data:', error);
//             return [];
//         }
//     //}
// }

   //console.log(arr2);
var options = {

    chart: {
        type: 'area',
        height: 302,
        toolbar: {
            show: false,
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
        min: new Date('10 May 2023').getTime(),
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
            min: new Date('10 May 2023').getTime(),
            max: new Date('9 Jun 2023').getTime(),
        }
    })
})

document.querySelector("#six_months").addEventListener('click', function(e) {
    resetCssClasses(e)
    chart.updateOptions({
        xaxis: {
            min: new Date('10 May 2023').getTime(),
            max: new Date('10 Jul 2023').getTime(),
        }
    })
})

document.querySelector("#one_year").addEventListener('click', function(e) {
    resetCssClasses(e)
    chart.updateOptions({
        xaxis: {
            min: new Date('27 Feb 2012').getTime(),
            max: new Date('27 Feb 2013').getTime(),
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