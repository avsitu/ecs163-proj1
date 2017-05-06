		d3.csv("data/graph1.csv", type1, function(data) {
			var margin = {top: 20, right: 30, bottom: 30, left: 40},
			    width = 700 - margin.left - margin.right,
			    height = 500 - margin.top - margin.bottom;
			var x = d3.scaleBand()
			    .range([0, width]).padding(0.1);		    

			var y = d3.scaleLinear()
			    .range([height, 0]);

			var chart = d3.select(".chart")
			    .attr("width", width + margin.left + margin.right)
			    .attr("height", height + margin.top + margin.bottom).append("g")
	    		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			x.domain(data.map(function(d) { return d.Department; }));

  			y.domain([0, d3.max(data, function(d) { return d.Leave_rate; })]);

  			chart.append("g")
  			    .attr("class", "axis")
      			.attr("transform", "translate(0," + height + ")")
    			.call(d3.axisBottom(x));

			chart.append("g")
			  .attr("class", "axis")
			  .call(d3.axisLeft(y).ticks(10,'%'));    			

			var bar = chart.selectAll(".bar")
				.attr("class", "bar")
				.data(data)
				.enter();

			bar.append("rect")
				.attr("class", "bar")
				.attr("x", function(d) { return x(d.Department); })
				.attr("y", function(d) { return y(d.Leave_rate); })
				.attr("height", function(d) { return height - y(d.Leave_rate); })
				.attr("width", x.bandwidth());

			bar.append("text")
				.attr("x", function(d) { return x(d.Department) + 5; })
				.attr("y", function(d) { return y(d.Leave_rate) + 5; })
				.attr("dy", "0.75em")
				.text(function(d) { return d.Leave_rate.toFixed(3); }).attr("fill", "white");			  		
		});    
		function type1(d) {
			d.Leave_rate = +d.Leave_rate; // coerce to number
			return d;
		};