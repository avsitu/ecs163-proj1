	var m = [50, 40, 50, 40],
	  w = 1300 - m[1] - m[3],
	  h = 600 - m[0] - m[2];
	var line = d3.line();
	var dragging = {};
	var x2 = d3.scaleBand().range([0, w]);
	var y2 = {};
	d3.csv("data/graph3.csv", type3, function(data) { 


		var axis = d3.axisLeft();
		var background;
		var foreground;

		var svg = d3.select('.pc')
		  .attr("width", w + m[1] + m[3])
		  .attr("height", h + m[0] + m[2])
		  .append("svg:g")
		  .attr("transform", "translate(" + m[3] + "," + m[0] + ")");
	// Extract the list of dimensions and create a scale for each.
	x2.domain(dimensions = d3.keys(data[0]).filter(function(d) {
		if(d == 'left' || d =='department' || d == 'promotion_last_5years' || d == 'Work_accident') {return false;}
		if(d == 'salary') {
			y2[d] = d3.scalePoint().domain(data.map(function(p) {
	      return p[d];
	    })).range([h, 0]);}
		else {
	  y2[d] = d3.scaleLinear().domain([0,d3.max(data, function(p) { return p[d]; })])
	  	.range([h, 0]); } 
	  return true;
	}));
	d3.select('.pc').append('text').text('Human Resources Employees').attr('x',10).attr('y',15);
		legend = svg.append('g').attr('class', 'legend')
		.attr('transform', 'translate(35,'+(h-40)+')')
		.attr('width', 50).attr('height', 50);

		legend.append('rect').attr('fill', 'orange');
		legend.append('rect').attr('fill', 'steelblue').attr('y',20);
		legend.append('text').text('left').attr('x', 20).attr('y',10);
		legend.append('text').text('stayed').attr('x', 20).attr('y',30);

	// Add grey background lines for context.
	background = svg.append("svg:g")
	  .attr("class", "background")
	  .selectAll("path")
	  .data(data)
	  .enter().append("svg:path")
	  .attr("d", path);

	// Add blue foreground lines for focus.
	foreground = svg.append("svg:g")
	  .attr("class", "foreground")
	  .selectAll("path")
	  .data(data)
	  .enter().append("svg:path")
	  .attr("d", path).attr('stroke', function(d) {return d.left == 1? 'orange':'steelblue'});

	// Add a group element for each dimension.
	var g = svg.selectAll(".dimension")
	  .data(dimensions)
	  .enter().append("svg:g")
	  .attr("class", "dimension")
	  .attr("transform", function(d) {
	    return "translate(" + x2(d) + ")";
	  });

	// Add an axis and title.
	g.append("svg:g")
	  .attr("class", "axis")
	  .each(function(d) {
	  	if(d == 'number_project' ) { d3.select(this).call(d3.axisRight(y2[d]).tickValues([0,1,2,3,4,5,6,7]).tickFormat(d3.format("d")));}
	  	else if(d == 'average_monthly_hours' || d == 'time_spend_company') 
	    {d3.select(this).call(d3.axisRight(y2[d]).tickFormat(d3.format("d")));}
	  	else {d3.select(this).call(d3.axisRight(y2[d]));}
	  })
	  .append("svg:text")
	  .attr("text-anchor", "middle")
	  .attr("y", -9)
	  .text(String);
	});
	function position(d) {
	  var v = dragging[d];
	  return v == null ? x2(d) : v;
	}

	function transition(g) {
	  return g.transition().duration(500);
	}

	// Returns the path for a given data point.
	function path(d) {
	  return line(dimensions.map(function(p) {
	    return [position(p), y2[p](d[p])];
	  }));
	}	

	function type3(d) {
		d.satisfaction_level = +d.satisfaction_level;
		d.last_evaluation = +d.last_evaluation;
		d.number_project = +d.number_project;
		d.average_monthly_hours = +d.average_monthly_hours;
		d.time_spend_company = +d.time_spend_company;
		d.Work_accident = +d.Work_accident;
		d.left = +d.left;
		d.promotion_last_5years = +d.promotion_last_5years;
		return d;
	}
