function initStarDistribution(){
var svg = d3.select("#star-distribution-svg"),
margin = {top: 10, right: 30, bottom: 30, left: 40},
width = +svg.attr("width") - margin.left - margin.right,
height = +svg.attr("height") - margin.top - margin.bottom,
g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var data = [512, 670, 1457, 2289, 3630, 4570, 5097, 4020, 5028];
var tooltip = d3.select('#star-distribution').append('div')
            .attr('id','bar-tooltip')
            .attr('class', 'tooltip');


var x = d3.scaleLinear()
          .range([width,0]);

var y = d3.scaleLinear()
          .range([0,height]);
    x.domain([5.5,0.5]);
    y.domain([5500,0])

console.log(d3.axisBottom(x));
console.log(width);
g.append("g")
     .attr("class", "axis axis--x")
     .attr("transform", "translate(0," + height + ")")
     .call(d3.axisBottom(x));

 g.append("g")
     .attr("class", "axis axis--y")
     .call(d3.axisLeft(y).ticks(10))
   .append("text")
     .attr("transform", "rotate(-90)")
     .attr("y", 6)
     .attr("dy", "0.71em")
     .attr("text-anchor", "end")
     .text("Frequency");
function fireTransition(){
    g.selectAll(".bar")
      .data(data)
      .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) {
            console.log((data.indexOf(d)+2)/2);
            return x((data.indexOf(d)+2)/2-0.25)})
        .attr("y", function(d) { return y(0); })
        .on("mouseover",showTooltip)
        .on("mouseout",removeTooltip)
        .transition().delay(200).duration(1500)
        .attr("y", function(d) { return y(d); })
        .attr("width", x(1.5)-x(1) - 0.2)
        .attr("height", function(d) { return height - y(d); });

}

function showTooltip(d){
        var mouse = d3.mouse(svg.node()).map(function(d) {
            return parseInt(d);
        });
        tooltip.classed('hidden', false)
               .attr('style', 'left:' + (mouse[0] + 15) +
                              'px; top:' + -10 + 'px')
               .html("Count: " + d);
   }
function removeTooltip(d){
    tooltip.classed('hidden', true)
}

     var waypoint = new Waypoint({
       element: document.getElementById('insight'),
       handler: function(direction) {
         console.log("Triggered: " + direction)
         fireTransition();
     },
      offset: '600'
     })

}




/*


attributes means


*/











function initAttributesMeans(){
var svg = d3.select("#attributes-means-svg"),
margin = {top: 10, right: 30, bottom: 200, left: 40},
width = +svg.attr("width") - margin.left - margin.right,
height = +svg.attr("height") - margin.top - margin.bottom,
g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var tooltip = d3.select('#attributes-means').append('div')
            .attr('id','bar-tooltip')
            .attr('class', 'tooltip');

d3.json("attributes_plot.json",function(error1,attributes){
console.log(attributes)
var x = d3.scaleBand()
        .range([0, width])
        .padding(0.1);

var y = d3.scaleLinear()
          .range([height,0]);

x.domain(attributes.map(function(d) {
    return d.attribute; }));
y.domain([0, d3.max(attributes, function (d) { return d.value; })]);


console.log(d3.axisBottom(x));
console.log(width);
g.append("g")
     .attr("class", "axis axis--x")
     .attr("transform", "translate(0," + height + ")")
     .call(d3.axisBottom(x))
     .selectAll("text")
    .attr("y", 0)
    .attr("x", 12)
    .attr("dy", "-0.1em")
    .attr("transform", "rotate(90)")
    .style("text-anchor", "start");

 g.append("g")
     .attr("class", "axis axis--y")
     .call(d3.axisLeft(y).ticks(10))
   .append("text")
     .attr("transform", "rotate(-90)")
     .attr("y", 6)
     .attr("dy", "0.71em")
     .attr("text-anchor", "end")
     .text("Frequency");


function fireTransition(){

    g.selectAll(".bar")
      .data(attributes)
      .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function (d) { return x(d.attribute) + x.bandwidth() / 2; })
        .attr("y", function (d) { return y(0) })
        .on("mousemove",showTooltip)
        .on("mouseout",removeTooltip)
        .transition().delay(200).duration(1500)
        .attr("y", function(d) { return y(d.value); })
        .attr("width",x.bandwidth())
        .attr("height", function(d) { return height - y(d.value); })





}

     var waypoint = new Waypoint({
       element: document.getElementById('attributes-means'),
       handler: function(direction) {
         console.log("Triggered: " + direction)
         fireTransition();
     },
      offset: '600'
     })
     });
function showTooltip(d){
        var mouse = d3.mouse(svg.node()).map(function(d) {
            return parseInt(d);
        });
        tooltip.classed('hidden', false)
               .attr('style', 'left:' + (mouse[0] + 15) +
                              'px; top:' + -10 + 'px')
               .html("Attribute: " + d.attribute + " <br> Mean Stars: " + d.value);
   }

   function removeTooltip(d){
       tooltip.classed('hidden', true)
   }

}

initStarDistribution();
initAttributesMeans();
