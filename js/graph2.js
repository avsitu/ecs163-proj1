		d3.csv("data/graph2.csv", type2, function(data) {	
			var margin = {top: 20, right: 30, bottom: 30, left: 40},
			    width = 960 - margin.left - margin.right,
			    height = 500 - margin.top - margin.bottom;			
			var x = d3.scaleBand()
			    .range([0, width]).padding(0.1);		    

			var y = d3.scaleLinear()
			    .range([height, 0]);

			var chart2 = d3.select(".chart2")
			    .attr("width", width + margin.left + margin.right)
			    .attr("height", height + margin.top + margin.bottom).append("g")
	    		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
			x.domain(data.map(function(d) { return d.AMH; }));

  			y.domain([0, d3.max(data, function(d) { return d.Count_stayed+d.Count_left; })]);

  			legend = chart2.append('rect')
  			.attr('transform', 'translate(20,20)')
  			.attr('width', 30).attr('height', 20).attr('fill','orange');


  			chart2.append("g")
  			    .attr("class", "axis")
      			.attr("transform", "translate(0," + height + ")")
    			.call(d3.axisBottom(x));

			chart2.append("g")
			  .attr("class", "axis")
			  .call(d3.axisLeft(y).ticks(10));    			

			var bar = chart2.selectAll(".bar")
				.attr("class", "bar")
				.data(data)
				.enter();

			bar.append("rect")
				.attr("class", "bar")
				.attr("x", function(d) { return x(d.AMH); })
				.attr("y", function(d) { return y(d.Count_left); })
				.attr("height", function(d) { return height - y(d.Count_left); })
				.attr("width", x.bandwidth()).attr("fill", "orange");

			bar.append("text")
				.attr("x", function(d) { return x(d.AMH) + 5; })
				.attr("y", function(d) { return y(d.Count_left) + 5; })
				.attr("dy", "0.75em")
				.text(function(d) { return d.Count_left > 50 ? d.Count_left : null; }).attr("fill", "white");

			bar.append("rect")
				.attr("class", "bar")
				.attr("x", function(d) { return x(d.AMH); })
				.attr("y", function(d) { return y(d.Count_stayed)-(height-y(d.Count_left)); })
				.attr("height", function(d) { return height - y(d.Count_stayed); })
				.attr("width", x.bandwidth()).attr("fill", "steelblue");

			bar.append("text")
				.attr("x", function(d) { return x(d.AMH) + 5; })
				.attr("y", function(d) { return y(d.Count_stayed)-(height-y(d.Count_left)) + 5; })
				.attr("dy", "0.75em")
				.text(function(d) { return d.Count_stayed > 50? d.Count_stayed: null; }).attr("fill", "white");	
				
		});	
		function type2(d) {
			d.AMH = +d.AMH; // coerce to number
			d.Count_stayed = +d.Count_stayed;
			d.Count_left = +d.Count_left;
			return d;
		};