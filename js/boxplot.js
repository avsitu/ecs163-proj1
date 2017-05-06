var min = Infinity,
	    max = -Infinity;
d3.csv("data/graph4.csv", function(error, csv) {
	// boxplot
	var margin = {top: 50, right: 30, bottom: 50, left: 30},
	    width = 90 - margin.left - margin.right,
	    height = 650 - margin.top - margin.bottom;

	var chart = d3.box()
	    .whiskers(iqr(1.5))
	    .width(width)
	    .height(height);

  if (error) throw error;
  var data = {'left':[], 'stayed':[]};

  csv.forEach(function(d) {
  	data['stayed'].push([d['dept'],'red',d['min'],d['25th'], d['50th'], d['75th'], d['max']]);
  	data['left'].push([d['dept'],'orange',d['min_left'],d['25th_left'], d['50th_left'], d['75th_left'], d['max_left']]);
    // var e = Math.floor(x.Expt - 1),
    //     r = Math.floor(x.Run - 1),
    //     s = Math.floor(x.Speed),
    //     d = data[e];
    // if (!d)  d = data[e] = [e+1,s];
    // else d.push(s);
    // if (d['max'] > max) max = d['max'];
    if (d['min'] < min) min = d['min'];
    if (d['max_left'] > max) max = d['max_left'];
    // if (d['min_left'] < min) min = d['min_left'];    
  });

  chart.domain([min, max]);
  scale1 = d3.scaleBand().domain(data['left'].map(function(d) {return d[0]})).range([0,1000])

  var svg = d3.select(".box1").attr('width', 1000).attr('height', height + margin.top + margin.bottom).attr('background-color', 'red');
  var current = 'stayed';

	svg.append("g")
	.attr("class", "axis")
	.attr('width',600)
	.attr("transform", "translate(0," + (height+60) + ")")
	.call(d3.axisBottom(scale1));
      
  g = svg.selectAll('.mybox').data(data['stayed'])
    .enter().append("svg")
      .attr("class", "box")
      .attr('x', function(d) { return scale1(d[0])+5;})
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.bottom + margin.top)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .call(chart);

  setInterval(function() {
			if(current == 'left') { 
				current = 'stayed'; 
				changeStroke('steelblue'); 
			}
			else if(current == 'stayed') { 
				current = 'left'; 
				changeStroke('orange');
			}
    g.datum(trans).call(chart.duration(1000)).call(chart.color('red'));
  }, 2000);

	function trans(d) {
			new_d = data[current].filter(function(x) {if(x[0] == d[0]) return true;});
	  	return new_d[0];
	}

	function changeStroke(color) {
		elts = document.getElementsByClassName('iqbox');
		for(i = 0; i < elts.length; i++) {
			elts[i].style.stroke = color;
		}		
		elts = document.getElementsByClassName('median');
		for(i = 0; i < elts.length; i++) {
			elts[i].style.stroke = color;
		}
		elts = document.getElementsByClassName('whisker');
		for(i = 0; i < elts.length; i++) {
			elts[i].style.stroke = color;
		}
		elts = document.getElementsByClassName('center');
		for(i = 0; i < elts.length; i++) {
			elts[i].style.stroke = color;
		}
	}
});

// Returns a function to compute the interquartile range.
function iqr(k) {
  return function(d, i) {
    var q1 = d.quartiles[0],
        q3 = d.quartiles[2],
        iqr = (q3 - q1) * k,
        i = -1,
        j = d.length;
    while (d[++i] < q1 - iqr);
    while (d[--j] > q3 + iqr);
    return [i, j];
  };
}