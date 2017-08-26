
// var miner = 'f4f38a7045142bd64180a35f5b7b4a2871d16b58'
var miner = '41f1d11a760cb512fb974bb49f3ea9711609367a'
//var miner = '8aec081e391d275dc0fb8e4697fc252359d353f8';
document.onreadystatechange = function () {
	Highcharts.setOptions({
	global: {
		useUTC: false
	}
});
  $.ajax({
    method: 'GET',
    url: 'https://api-etc.ethermine.org/miner/' + miner + '/payouts'
  }).then(resp => {
    var end = resp.data[0];
    var data = [];
    for (var i = 1; i < resp.data.length; i++) {
      var begin = resp.data[i];
      var time = ((end.paidOn - begin.paidOn) / 3600);
      // console.log(time + ' - ' + new Date(end.paidOn * 1000));
      data.unshift([end.paidOn * 1000, time]);
      end = begin;
    }
    draw(data, 'Paid');
    new Vue({
      el: '#app',
      data: {
        total: data.length
      }
    });
  })
  
}

function draw(data, label) {
  Highcharts.chart('container', {
    chart: {
      type: 'spline'
    },
    title: {
      text: 'Timing'
    },
    subtitle: {
      text: ''
    },
    xAxis: {
      type: 'datetime',
      dateTimeLabelFormats: { // don't display the dummy year
        month: '%e. %b',
        year: '%b'
      },
      title: {
        text: 'Date'
      }
    },
    yAxis: {
      title: {
        text: 'Time (hours)'
      },
      min: 0
    },
    tooltip: {
      headerFormat: '<b>{series.name}</b><br>',
      pointFormat: '{point.x:%e. %b}: {point.y:.2f} h'
    },

    plotOptions: {
      spline: {
        marker: {
          enabled: true
        }
      }
    },

    series: [{
      name: label,
      data: data
    }]
  });
}