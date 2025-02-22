const form = document.getElementById("activityForm")

const defaultUserId = 1;

form.addEventListener("submit", (e) => {
    e.preventDefault()

    var data = new FormData(form)
    renderChart(data.get("range"), data.get("metric"), data.get("activity"))
})

const rangeConversion = {
    'day': 1,
    'week': 7,
    'month': 31,
    'year': 365
}

const unitConversion = {
    'day': 'hour',
    'week': 'day',
    'month': 'day',
    'year': 'month'
}

const range_conversion_relative = {
    'day' : 24,
    'week' : 7,
    'month': 31,
    'year' : 12
}

renderChart('day', 'accuracy', 'notes')

function renderChart(range, metric, exercise) {
    console.log(range, metric, exercise)
    if (exercise = "notes") {
        fetch(`http://3.13.118.113:3000/noteidentifyingindepth?id=${defaultUserId}&range=${range}`).then(res => {
            
            if (!res.ok) {
                throw new Error('Network response was not ok');
            }
            return res.json();
        }).then(data => {
            var newData = []


            var startingDate = new Date();
            var endDate = new Date();
            endDate.setDate(endDate.getDate() + 0.1)
            endDate = endDate.toISOString()
            startingDate.setDate(startingDate.getDate() - rangeConversion[range])
            startingDate = startingDate.toISOString()
            
            if (metric == "accuracy") {
                for (let i = 0; i < data.length; i++) {
                    console.log(metric)
                    var yEntry = Math.round(data[i].correct_guesses/(data[i].wrong_guesses + data[i].correct_guesses) * 100)
    
                    var entry = {
                        x: data[i].end_time,
                        y: yEntry
                    }
    
                    newData.push(entry)

                    
                }
                
                

                newData = newData.sort((a, b) => new Date(a.x) - new Date(b.x));
                
                newData.unshift({
                    x: startingDate,
                    y: newData[0].y
                })

                // myChart.type = "line"
                myChart.options.scales.y.min = 0
                myChart.options.scales.y.max = 100
                myChart.data.labels = null

                myChart.options.scales.y.title.text = "Accuracy (%)"
            }
            if (metric == "time") {

                
                myChart.options.scales.y.title.text = "Time Practiced (min)"

                // myChart.type = "bar"
                var labels = []

                newData = new Array(range_conversion_relative[range]).fill(0)

                const shiftedStart = new Date(startingDate)
                const shiftedEnd = new Date(endDate)
                const interval = (shiftedEnd - shiftedStart) / (range_conversion_relative[range] - 1)

                for (let i = 0; i < range_conversion_relative[range]; i++) {
                    const newDate = new Date(shiftedStart.getTime() + interval * i)
                    console.log(i, newDate)

                    // if (range == 'day'){
                    //     newDate.setHours(newDate.getHours() - 1)
                    // }
                    // else {
                    //     newDate.setDate(newDate.getDate() - 1)
                    // }
                    labels.push(newDate.toISOString())
                }

                console.log(labels)
                myChart.data.labels = labels

                for (let i = 0; i < data.length; i++) {
                    var dif = -1
                    var winner = 0
                    for (let j = 0; j < labels.length; j++) {
                        const current = new Date(labels[j])
                        const currentdata = new Date(data[i].end_time)
                        if (Math.abs(current - currentdata) < dif || dif == -1) {
                            winner = j
                        }
                    }
                    newData[winner] += Math.round(data[i].duration_seconds/60)
                }

                console.log(newData)
                const highest = Math.max(...newData)
                myChart.options.scales.y.max = highest + highest * 0.2
                console.log()
            }

            
            

            console.log(data, newData)

            myChart.data.datasets[0].data = newData
            myChart.options.scales.x.min = startingDate
            myChart.options.scales.x.max = endDate
            myChart.options.scales.x.time.unit = unitConversion[range]
            myChart.update()
        })
    }
    
}

console.log(form)

const data = {
//   labels: labels,
  datasets: [{
    data: [
        { x: '2025-01-15T00:00:00', y: 10 },
        { x: '2025-02-15T00:00:00', y: 10 }, 
                { x: '2025-02-16T03:00:00', y: 20 }, 
                { x: '2025-02-17T00:00:00', y: 15 }, 
                { x: '2025-02-19T00:00:00', y: 25 }  
    ],
    fill: false,
    borderColor: 'rgb(0, 140, 255)',
    tension: 0.1
  }]
};

const ctx = document.getElementById('chart');

  var myChart = new Chart(ctx, {
    type: 'line',
    data: data,
    options: {
        plugins: {
            legend: {
                display: false 
            }
        },
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'day'
                },
            },
            y: {
                title: {
                    display: true
                },
                min: 0,
                max: 100
            }
        }
    }
  });

  