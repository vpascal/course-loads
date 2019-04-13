let button_value = 'C&HE';
document.getElementById("Undergraduate").checked = true;
let radio_value = d3.select('input[name="level"]:checked').node().value


//test - to create nested structure.

var brands = [{
  "courseid": 'EDCE 2010',
  'termid':'Fall 13-14',
  "size": 100
}, {
  "courseid": 'EDCE 2010',
  "termid": "Spr 13-14",
  "size": 90
}];

// tracking active button

d3.selectAll(".btn").on("click", function () {
  //check if node is already selected
  var text = d3.select(this).classed('active');
  d3.selectAll(".btn").classed('active', false);
  if (text) {
    //remove active class
    d3.select(this).classed('active', false);
  } else {
    d3.select(this).classed('active', true);
    button_value = this.name;
    draw('dataset.csv');
  }
}
);

d3.selectAll('input').on('click', function () {
  radio_value = this.value;
  draw('dataset.csv');
});


draw('dataset.csv');

// set the dimensions and margins of the graph
const margin = { top: 40, right: 90, bottom: 50, left: 90 },
  width = 800 - margin.left - margin.right,
  height = 950 - margin.top - margin.bottom;

// append the svg object to the body of the page
let svg = d3.select("#dataviz")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform",
    "translate(" + margin.left + "," + margin.top + ")");

// wrap x axis
function wrap(text, width) {
  text.each(function () {
    var text = d3.select(this),
      words = text.text().split(/\s+/).reverse(),
      word,
      line = [],
      lineNumber = 0,
      lineHeight = 1.1, // ems
      y = text.attr("y"),
      dy = parseFloat(text.attr("dy")),
      tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      }
    }
  });
}

// Build X scales and axis, they're static:
const x = d3.scaleBand()
  .range([0, width])
  .padding(0.1)
  .domain(['Fall 13-14', 'Spr 13-14', 'Sum 13-14', 'Fall 14-15', 'Spr 14-15', 'Sum 14-15',
    'Fall 15-16', 'Spr 15-16', 'Sum 15-16',
    'Fall 16-17', 'Spr 16-17', 'Sum 16-17',
    'Fall 17-18', 'Spr 17-18', 'Sum 17-18']);


svg.append("g")
  .style("font-size", 12)
  .style('font-family', 'monospace')
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x).tickSize(0))
  .attr('id', 'xtext')
  .select(".domain").remove()

svg.append("g")
  .style("font-size", 12)
  .style('font-family', 'monospace')
  .attr("transform", "translate(0,-30)")
  .call(d3.axisTop(x).tickSize(0))
  .attr('id', 'xtext')
  .select(".domain").remove()

svg.selectAll('#xtext text').call(wrap, 10);

// Build color scale
let myColor = d3.scaleSequential()
  .interpolator(d3.interpolateOranges)
  .domain([1, 100])

// create a tooltip
let tooltip = d3.select("#dataviz")
  .append("div")
  .style("opacity", 0)
  .attr("class", "tooltip")
  .style("font-family", "'Roboto', sans-serif")
  .style("font-size", '14px')
  .style('color', 'white')
  .style("background-color", "#0282f9")
  .style('box-shadow', '0 1px 8px rgba(0,0,0,0.5)')
  .style("border-radius", "5px")
  .style("padding", "5px")


// Three function that change the tooltip when user hover / move / leave a cell
let mouseover = function (d) {

  tooltip
    .style("opacity", 1)

  d3.select(this)
    .style("stroke", "red")
    .style("opacity", 1)


}
let mousemove = function (d) {
  tooltip
    .html("Percent: " + d.percent
      + "<br>Term: " + d.Term
      + "<br>Max Size: " + d.size
      + "<br>Course ID: " + d.course
      + "<br>Course: " + d.class)
    .style("left", (d3.mouse(this)[0] + 10) + "px")
    .style("top", (d3.mouse(this)[1] + 100) + "px")
}
let mouseleave = function (d) {
  tooltip
    .style("opacity", 0)
  d3.select(this)
    .style("stroke", "none")
    .style("opacity", 0.8)
}

svg.append('defs')
  .append('pattern')
  .attr('id', 'diagonalHatch')
  .attr('patternUnits', 'userSpaceOnUse')
  .attr('width', 4)
  .attr('height', 4)
  .append('path')
  .attr('d', 'M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2')
  .attr('stroke', '#919191')
  .attr('stroke-width', 1);


//Drawing function to create a viz

function draw(dataset) {
  d3.csv(dataset, function (data) {

    // filter data

    data = data.filter(function (d) { return (d.Department == button_value) && (d.level === radio_value); })

  // join test object with data on course and term;

    data.forEach(function(article) {
      var result = brands.filter(function(brand) {
          return (brand.courseid === article.course &&
          brand.termid === article.Term);
      });

      article.size = (result[0] !== undefined) ? result[0].size : null;
  });
    console.log(data);

    // Labels of row and columns -> unique identifier of the column called 'Term' and 'variable'
    // const myGroups = d3.map(data, function (d) { return d.Term; }).keys()

    const myVars = d3.map(data, function (d) { return d.course; }).keys()
     myVars.sort().reverse();


    // Build Y scales and axis:
    const y = d3.scaleBand()
      .range([height, 0])
      .domain(myVars)
      .padding(0.1);

  var yaxis = svg.selectAll('.y')
      .data(['dummy']);  

      yaxis.enter()
      .append("g")
      .merge(yaxis)
      .attr("class",'y')
      .style("font-size", 12)
      .style('font-family', 'monospace')
      .call(d3.axisLeft(y).tickSize(0))
      .select(".domain").remove();

 // add the squares
var rects = svg.selectAll('rect')
   .data(data);

    // add the squares
   var rects = svg.selectAll('rect')
      .data(data);

  rects.exit().remove();

   let viz = rects.enter()
      .append("rect")
      .merge(rects);

      viz
      .transition().duration(550)
      .attr("x", function (d) { return x(d.Term) })
      .attr("y", function (d) { return y(d.course) })
      .attr("rx", 4)
      .attr("ry", 4)
      .style("fill", function (d) {
        if (d.percent !== '') {
          return myColor(d.percent);
        } else { return "url(#diagonalHatch)"; }
      })
      .attr("width", x.bandwidth())
      .attr("height", y.bandwidth())
      .style("stroke-width", 4)
      .style("stroke", "none")
      .style("opacity", 0.8);

      viz
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave);

      


  })

}

