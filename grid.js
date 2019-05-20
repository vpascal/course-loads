
var margin_g = { top: 40, right: 20, bottom: 30, left: 20 },
    width_g = 250 - margin_g.left - margin_g.right,
    height_g = 250 - margin_g.top - margin_g.bottom;

var div = d3.select("body").append("div")
    .attr("class", "linetooltip")
    .style("opacity", 0);

//Read the data
d3.csv("fillrate.csv", function (data) {

    var ugrad = data.filter(function (d) { return (d.level == 'Undergraduate'); })
    var grad = data.filter(function (d) { return (d.level == 'Graduate'); })

    ugrad = d3.nest()
        .key(function (d) { return d.Department; })
        .entries(ugrad);

    grad = d3.nest()
        .key(function (d) { return d.Department; })
        .entries(grad);


    allKeys = ugrad.map(function (d) { return d.key })

    var svg_g = d3.select("#grid")
        .selectAll("uniqueChart")
        .data(ugrad)
        .enter()
        .append("svg")
        .attr('class', 'grid')
        .attr("width", width_g + margin_g.left + margin_g.right)
        .attr("height", height_g + margin_g.top + margin_g.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin_g.left + "," + margin_g.top + ")");

    var x_g = d3.scaleBand()
        .domain(['13-14', '14-15', '15-16', '16-17', '17-18'])
        .range([0, width_g]);

    svg_g
        .append("g")
        .attr("transform", "translate(0," + height_g + ")")
        .call(d3.axisBottom(x_g))
        .attr("class", "axis");

    //Add Y axis
    var y_g = d3.scaleLinear()
        .domain([0, 100])
        .range([height_g, 0]);
  

    svg_g.append("g")
        .call(d3.axisLeft(y_g).ticks(10))//.tickSize(-width_g)//
        .call(g => g.select(".domain").remove())
        .attr("class", "axis");
      //  .style("stroke-dasharray",("1,1"));

    // Draw the line for undergrads
    svg_g
        .append("path")
        .attr("fill", "none")
        .attr("stroke", '#03a9f4')
        .attr('id', 'ugrad')
        .attr("stroke-width", 1.9)
        .attr("d", function (d) {
            return d3.line()
                .x(function (d) { return x_g(d.year)+21; })
                .y(function (d) { return y_g(+d.percent); })
                .curve(d3.curveMonotoneX)
                (d.values);
        });

    // undergrad  circles            
    svg_g
        .selectAll('.grid')
        .data(function (d) { return d.values })
        .enter()
        .append("circle")
        .attr("cx", function (d) { return x_g(d.year)+21 })
        .attr("cy", function (d) { return y_g(+d.percent) })
        .attr("r", 4)
        .attr('fill', '#03a9f4')
        .attr("stroke", "white")
        .on("mouseover", function (d) {
            div.transition()
                .duration(200)
                .style("opacity", .9);
            div.html(d.percent + '%')
                .style("left", (d3.event.pageX)-25 + "px")
                .style("top", (d3.event.pageY - 30) + "px");
        })
        .on("mouseout", function (d) {
            div.transition()
                .duration(500)
                .style("opacity", 0);
        });

// label
    svg_g
        .selectAll('.grid')
        .data(function (d) { return d.values })
        .enter()
        .append("text")
            .datum('Undergraduate')
            .attr("transform", 'translate(17,10)')
            .text('Undergraduate')
            .style("fill",'#03a9f4' )
            .style("font-size", 11)
            .style('font-family', 'monospace');




    // graduate line
    svg_g
        .data(grad)
        .append("path")
        .attr("fill", "none")
        .attr("stroke", '#8bc34a')
        .attr("stroke-width", 1.9)
        .attr("d", function (d) {
            return d3.line()
                .x(function (d) { return x_g(d.year)+21; })
                .y(function (d) { return y_g(+d.percent); })
                .curve(d3.curveMonotoneX)
                (d.values)
        });

    // grad  circles            
    svg_g
        .selectAll('.grid')
        .data(function (d) { return d.values })
        .enter()
        .append("circle")
        .attr("cx", function (d) { return x_g(d.year)+21 })
        .attr("cy", function (d) { return y_g(+d.percent) })
        .attr("r", 4)
        .attr('fill', '#8bc34a')
        .attr("stroke", "white")
        .on("mouseover", function (d) {
            div.transition()
                .duration(200)
                .style("opacity", .9);
            div.html(d.percent + "%")
                .style("left", (d3.event.pageX)-25 + "px")
                .style("top", (d3.event.pageY - 30) + "px");
        })
        .on("mouseout", function (d) {
            div.transition()
                .duration(500)
                .style("opacity", 0);
        });

     svg_g
        .selectAll('.grid')
        .data(function (d) { return d.values })
        .enter()
        .append("text")
            .datum('Grad')
            .attr("transform", 'translate(17,22)')
            .text('Graduate')
            .style("fill",'#8bc34a' )
            .style("font-size", 11)
            .style('font-family', 'monospace');

    // Add titles
    svg_g
        .append("text")
        .attr("text-anchor", "start")
        .attr("y", -7)
        .attr("x", 0)
        .text(function (d) { return (d.key) })
        .style("fill", '#676767')
        .style("font-size", 16)
        .style('font-family', 'monospace')


});
