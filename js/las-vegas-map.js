function initMap(){


//Map dimensions (in pixels)
var radius_size = 0.3;
var width = 1500,
    height = 850;


    var length = 5
    var color = d3.scaleLinear().domain([1,length])
      .interpolate(d3.interpolateHcl)
      .range([d3.rgb("#FF0000"), d3.rgb('#00FF00')]);


      var hexbin = d3.hexbin()
      .extent([[0, 0], [width, height]])
      .radius(0.8);

  radius = d3.scaleSqrt()
      .domain([0, 12])
      .range([0, radius_size]);
//Map projection
var projection = d3.geoMercator()
    .scale(10946.507892720545)
    .center([-115.3090075,36.015697781182126]) //projection center
    .translate([width/2,height/2]) //translate to center the map in view

var path = d3.geoPath().projection(projection);

//Create an SVG
var svg = d3.select("#las-vegas-map").append("svg")
    .attr("width", "100%")
    .attr("height", height);

//Group for the map features
var features = svg.append("g")
    .attr("class","features");
var businesses = svg.append("g")
    .attr("class","businesses");

var initialTransform = d3.zoomIdentity
        .translate(-5600,-2800)
        .scale(8);
//Create zoom/pan listener
//Change [1,Infinity] to adjust the min/max zoom scale
var zoom = d3.zoom()
    .scaleExtent([5, 25])
    .on("zoom", zoomed);

var hexagon_sizes = [0,0,0,0,0];
var tooltip = d3.select('#map').append('div')
            .attr('id','hexagon-tooltip')
            .attr('class', 'tooltip');

svg.call(zoom)
   .call(zoom.transform, initialTransform);
business_data = [];
d3.json("nevada.geojson",function(error,geodata) {
d3.json("business_ratings.json",function(error1,business){

  business_data = typeBusiness(business);
  if (error) return console.log(error); //unknown error, check the console
  //Create a path for each map feature in the data
  console.log(geodata)
  features.selectAll("path")
    .data(geodata.features)
    .enter()
    .append("path")
    .attr("d",path)
    .attr("stroke","rgb(50,50,50)")
    .on("mousemove",clearTooltip)

    /*features.selectAll("text")
    .data(geodata.features)
    .enter()
    .append("svg:text")
    .text(function(d){
        return d.properties.GEOID10;
    })
    .attr("x", function(d){
        return path.centroid(d)[0];
    })
    .attr("y", function(d){
        return  path.centroid(d)[1];
    })
    .attr("text-anchor","middle")
    .attr('font-size','1pt'); */


    businesses.selectAll("path")
    .data(hexbin(business_data).sort(function(a, b) { return b.length - a.length; }))
    .enter().append("path")
    .attr("class","hexagon")
    .attr("d", function(d) {
           return "M" + d.x + "," + d.y + hexbin.hexagon(radius(d.length)); })
    .attr("fill",  function(d) {
        var median = d3.median(d, function(d) { return +d.stars; })
        hexagon_sizes[Math.floor(median)-1]++;
        return color(median); })
    .attr("stroke","black")
    .on("mouseover",hoverOver)
    .on('mousemove', toolTipControl)
    .on("click",hexagonClicked);

    var legend_hex = "m0,-12l10.392304845413264,5.999999999999998l0,12l-10.392304845413257,6.000000000000003l-10.392304845413268,-5.999999999999995l-7.105427357601002e-15,-11.999999999999996l10.392304845413253,-6.000000000000008z";
    var colorLegend = d3.legendColor()
       .labelFormat(d3.format(".0f"))
       .scale(color)
       .shape("path",legend_hex)
       .shapePadding(5)
       .shapeWidth(50)
       .shapeHeight(20)
       .labelOffset(15)
       .titleWidth(200)
       .title("Click a hexagon to filter")
       .on("cellclick", function(d) {
                             var bin = d;
                             d3.selectAll(".hexagon")
                             .remove()

                             businesses.selectAll("path")
                             .data(hexbin(business_data).sort(function(a, b) {

                                 return b.length - a.length;
                              }))
                             .enter().append("path")
                             .attr("class","hexagon")
                             .attr("d", function(d) {
                                    return "M" + d.x + "," + d.y + hexbin.hexagon(radius(d.length)); })
                             .attr("fill",  function(d) {
                                  var median = d3.median(d, function(d) { return +d.stars; })

                                  if(median >= bin && median < bin+1){
                                       return color(median);
                                  } else{
                                      d3.select(this).remove();
                                  }
                              })
                             .attr("stroke",function(d){
                                 var median = d3.median(d, function(d) { return +d.stars; })
                                 if(median >= bin && median < bin+1){
                                      return "black";
                                 } else{
                                     return "transparent"
                                 }
                             })
                             .on("click",hexagonClicked)
                             .on("mouseover", hoverOver)
                             .on('mousemove', toolTipControl)
        });

     var legend_x = 50;
     var legend_y = 60;

     svg.append("rect")
        .attr("class","legend")
        .attr("transform", "translate(20, 20)")
        .attr("width", 250)
        .attr("height", 250)
        .attr("rx",15)
        .attr("ry",15)
        .attr("fill","rgb(255,255,255)");


      // reset button - http://bl.ocks.org/feyderm/9b3e95af24f8b8078aae255bba5796fd
      // Michael Feyder
      var b_buttonColor = "#3399ff";
      var b_width = 95 / 2,
          b_height = 45 / 2,
          b_fontSize = 1.38 * b_height / 3,
          b_x0 = 150,
          b_y0 = 225,
          b_x0Text = b_x0 + b_width / 2,
          b_y0Text = b_y0 + 0.66 * b_height,
          b_text = "Reset";
      var reset = svg.append("g")
                     .attr("id", "reset");
      reset.append("rect")
           .attr("id","buttonBackground")
           .attr("width", b_width + "px")
           .attr("height", b_height + "px")
           .style("fill", b_buttonColor)
           .attr("x", b_x0)
           .attr("y", b_y0)
           .attr("ry", b_height/10)
           .attr("r", 30)
           .on("click", function() {
               //Remove all hexagons
               radius_size = 0.3;
               radius = d3.scaleSqrt()
                   .domain([0, 12])
                   .range([0, radius_size]);
               d3.selectAll(".hexagon")
               .remove()
               //Redraw them
               businesses.selectAll("path")
               .data(hexbin(business_data).sort(function(a, b) { return b.length - a.length; }))
               .enter().append("path")
               .attr("class","hexagon")
               .attr("d", function(d) {
                      return "M" + d.x + "," + d.y + hexbin.hexagon(radius(d.length)); })
               .attr("fill",  function(d) { return color(d3.median(d, function(d) { return +d.stars; })); })
               .attr("stroke","black")
               .on("mouseover",hoverOver)
               .on('mousemove', toolTipControl)
               .on("click",hexagonClicked);
           });

      reset.append("text")
           .attr("id","buttonText")
           .attr("x", b_x0Text)
           .attr("y", b_y0Text)
           .style("text-anchor", "middle")
           .style("fill", "#ffffff")
           .style("stroke", "none")
           .style("font-family", "Arial, sans-serif")
           .style("font-size", b_fontSize + "px")
           .style("pointer-events", "none")
           .text(b_text);


           // Decrease - http://bl.ocks.org/feyderm/9b3e95af24f8b8078aae255bba5796fd
           // Michael Feyder
           var b_buttonColor = "#ff3333";
           var b_text = "Decrease", b_x0 = 100,b_x0Text = b_x0 + b_width / 2;
           var reset = svg.append("g")
                          .attr("id", "reset");
           reset.append("rect")
                .attr("id","buttonBackground")
                .attr("width", b_width + "px")
                .attr("height", b_height + "px")
                .style("fill", b_buttonColor)
                .attr("x", b_x0)
                .attr("y", b_y0)
                .attr("ry", b_height/10)
                .attr("r", 30)
                .on("click", function() {
                    //Remove all hexagons
                    radius_size -= 0.2;
                    if(radius_size < 0.1){
                        radius_size = 0.1;
                    }
                    radius = d3.scaleSqrt()
                        .domain([0, 12])
                        .range([0, radius_size]);
                    console.log("clicked");
                    //Redraw them
                    businesses.selectAll(".hexagon")
                    .attr("d", function(d) {
                           return "M" + d.x + "," + d.y + hexbin.hexagon(radius(d.length)); })
                });

           reset.append("text")
                .attr("id","buttonText")
                .attr("x", b_x0Text)
                .attr("y", b_y0Text)
                .style("text-anchor", "middle")
                .style("fill", "#ffffff")
                .style("stroke", "none")
                .style("font-family", "Arial, sans-serif")
                .style("font-size", b_fontSize + "px")
                .style("pointer-events", "none")
                .text(b_text);


                           // Increase - http://bl.ocks.org/feyderm/9b3e95af24f8b8078aae255bba5796fd
                           // Michael Feyder
                           var b_buttonColor = "#3399ff";
                           var b_text = "Increase", b_x0 = 50,b_x0Text = b_x0 + b_width / 2;
                           var reset = svg.append("g")
                                          .attr("id", "reset");
                           reset.append("rect")
                                .attr("id","buttonBackground")
                                .attr("width", b_width + "px")
                                .attr("height", b_height + "px")
                                .style("fill", b_buttonColor)
                                .attr("x", b_x0)
                                .attr("y", b_y0)
                                .attr("ry", b_height/10)
                                .attr("r", 30)
                                .on("click", function() {
                                    //Remove all hexagons
                                    radius_size += 0.2;
                                    if (radius_size > 1.4){
                                        radius_size = 1.4;
                                    }
                                    radius = d3.scaleSqrt()
                                        .domain([0, 12])
                                        .range([0, radius_size]);
                                    console.log("clicked");
                                    //Redraw them
                                    businesses.selectAll(".hexagon")
                                    .attr("d", function(d) {
                                           return "M" + d.x + "," + d.y + hexbin.hexagon(radius(d.length)); })
                                });

                           reset.append("text")
                                .attr("id","buttonText")
                                .attr("x", b_x0Text)
                                .attr("y", b_y0Text)
                                .style("text-anchor", "middle")
                                .style("fill", "#ffffff")
                                .style("stroke", "none")
                                .style("font-family", "Arial, sans-serif")
                                .style("font-size", b_fontSize + "px")
                                .style("pointer-events", "none")
                                .text(b_text);

           //Append the legend to the SVG
           svg.append("g")
             .attr("transform", "translate(50, 50)")
             .call(colorLegend);
            });





});

// onClick events for features here
// d.properties contains the attributes (e.g. d.properties.name, d.properties.population)
function clicked(d,i) {
 console.log(d.properties);
}
function hexagonClicked(d,i) {
 console.log(d.length)
 console.log(d3.median(d, function(d) { return +d.stars}));
}
function hoverOver(d,i){
    if(d3.select(this).style("fill").toString() != "rgba(0, 0, 0, 0)"){
            var saved_fill = d3.select(this).style("fill");
            d3.select(this)
                .style("fill", "tomato")

                d3.select(this).on("mouseout", function() {
                    d3.select(this)
                    .style("fill", saved_fill);
                });
   }
};
function zoomed() {
  features.style("stroke-width", 1.5 / d3.event.transform.k + "px");
  // g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")"); // not in d3 v4
  features.attr("transform", d3.event.transform); // updated for d3 v4

  businesses.style("stroke-width", 1.5 / d3.event.transform.k + "px");
  // g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")"); // not in d3 v4
  businesses.attr("transform", d3.event.transform); // updated for d3 v4
}
//Convert business features to work with Hexbins
function typeBusiness(d) {
  console.log(d)
  var businesses = []
  for(var i = 0; i < d.points.length; i++){
      coord = projection([d.points[i][1],d.points[i][0]]);
      businesses.push({
          0: coord[0],
          1: coord[1],
          "stars": d.stars[i]
      });
  }
  return businesses;
}
function toolTipControl(d){
    if(d3.select(this).style("fill").toString() != "rgba(0, 0, 0, 0)"){
        var mouse = d3.mouse(svg.node()).map(function(d) {
            return parseInt(d);
        });
        tooltip.classed('hidden', false)
               .attr('style', 'left:' + (mouse[0] + 15) +
                              'px; top:' + (mouse[1] + width/5) + 'px')
               .html(buildTooltip(d));
   } else{
       tooltip.classed('hidden', true)
   }



}
function clearTooltip(){
    tooltip.classed('hidden', true)
}
function buildTooltip(d){
    var median = d3.median(d, function(d) { return +d.stars; })
    var html = `
    <div>
        Number of businesses: ${d.length}
        <br>
        Median Rating: ${median}
    </div>
    `
     return html;
}
}
initMap();
