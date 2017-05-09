//Wrap in function so scope is maintained between visualizations
function initRandomForest(){
var svg = d3.select("#random-forest-svg"),
    margin = {top: 20, right: 30, bottom: 100, left: 40},
    width = svg.attr("width") - margin.left - margin.right,
    height = svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var y_pred = svg.append("g")
        .attr("class","y_pred");

var rf_pred = svg.append("g")
        .attr("class","rf_pred");

var x = d3.scaleLinear()
          .range([width,0]);

var y = d3.scaleLinear()
          .range([0,height]);
          // create a line function that can convert data[] into x and y points
var line = d3.line()
      			// assign the X function to plot our line as we wish
      			.x(function(d,i) {
      				// verbose logging to show what's actually being done
      				//console.log('Plotting X value for data point: ' + i + ' to be at: ' + x(i) + ' using our xScale.');
      				// return the X coordinate where we want to plot this datapoint
      				return x(i);
      			})
      			.y(function(d,i) {
      				// verbose logging to show what's actually being done
      				//console.log('Plotting Y value for data point: ' + d + ' to be at: ' + y(d) + " using our yScale.");
      				// return the Y coordinate where we want to plot this datapoint
      				return y(d);
      			})


d3.json("rf_preds_optimal.json",function(error,prediction){
    if (error) throw error;
  prediction = typePrediction(prediction);

  x.domain([prediction.y_true.length,0]);
  y.domain([6,1])

    g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    g.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(y).ticks(5, ""))
      .append("text")
        .attr("x", 4)
        .attr("y", 0.5)
        .attr("dy", "0.32em")
        .style("text-anchor", "start")
        .style("fill", "#000")
        .style("font-weight", "bold")
        .text("Stars rating");

        g.append("g")
        .attr("class", "true")
        .append("path")
        .attr("d", line(prediction.y_true));

        g.append("g")
        .attr("class", "predicted")
        .append("path")
        .attr("d", line(prediction.y_rf))
        .attr("stroke","blue")
        .attr("stroke-width");
        /*
        g.append("g")
        .attr("class", "cities")
        .selectAll("path")
        .data(prediction)
        .enter().append("circle")
        .attr("r", 3.5)
        .attr("cx", function(d) {
            return x(d.y_rf[0]) })
        .attr("cy", function(d) { return y(d.y_rf[1]); });
        */

 /*
  var focus = g.append("g")
      .attr("transform", "translate(-100,-100)")
      .attr("class", "focus");

  focus.append("circle")
      .attr("r", 3.5);

  focus.append("text")
      .attr("y", -10);

  var voronoiGroup = g.append("g")
      .attr("class", "voronoi");

  voronoiGroup.selectAll("path")
    .data(voronoi.polygons(d3.merge(data.map(function(d) { return d.values; }))))
    .enter().append("path")
      .attr("d", function(d) { return d ? "M" + d.join("L") + "Z" : null; })
      .on("mouseover", mouseover)
      .on("mouseout", mouseout);

  d3.select("#show-voronoi")
      .property("disabled", false)
      .on("change", function() { voronoiGroup.classed("voronoi--show", this.checked); });

*/
});

function mouseover(d) {
  d3.select(d.data.city.line).classed("city--hover", true);
  d.data.city.line.parentNode.appendChild(d.data.city.line);
  focus.attr("transform", "translate(" + x(d.data.date) + "," + y(d.data.value) + ")");
  focus.select("text").text(d.data.city.name);
}

function mouseout(d) {
  d3.select(d.data.city.line).classed("city--hover", false);
  focus.attr("transform", "translate(-100,-100)");
}
function typePrediction(d){

    var predictions = {
        "y_true": [],
        "y_rf": []
    }
    var y_true = [];
    var y_rf = [];
    var temps = [];
    var mod = 5
    for(var i = 0; i < d.points.length; i++){

        var coord = [d.points[i][0],d.points[i][1]];
        y_true.push(coord[0])
        temps.push(coord[1])
        if(i % mod == mod-1){

            var mean = 0
            var sum = 0
            for(var j = 0; j < temps.length; j++){
                sum+= temps[j];
            }
           mean = sum/mod;
           for(var j = 0; j < temps.length; j++){
               y_rf.push(mean)
           }
           temps = [];
        }


    }
    predictions.y_true = y_true
    predictions.y_rf = y_rf

    return predictions;
}
}
function initNeuralNetwork(){
var svg = d3.select("#neural-network-svg"),
    margin = {top: 20, right: 30, bottom: 100, left: 40},
    width = svg.attr("width") - margin.left - margin.right,
    height = svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var y_pred = svg.append("g")
        .attr("class","y_pred");

var rf_pred = svg.append("g")
        .attr("class","rf_pred");

var x = d3.scaleLinear()
          .range([width,0]);

var y = d3.scaleLinear()
          .range([0,height]);
          // create a line function that can convert data[] into x and y points
var line = d3.line()
      			// assign the X function to plot our line as we wish
      			.x(function(d,i) {
      				// verbose logging to show what's actually being done
      				//console.log('Plotting X value for data point: ' + i + ' to be at: ' + x(i) + ' using our xScale.');
      				// return the X coordinate where we want to plot this datapoint
      				return x(i);
      			})
      			.y(function(d,i) {
      				// verbose logging to show what's actually being done
      				//console.log('Plotting Y value for data point: ' + d + ' to be at: ' + y(d) + " using our yScale.");
      				// return the Y coordinate where we want to plot this datapoint
      				return y(d);
      			})


d3.json("nn_preds_optimal.json",function(error,prediction){
    if (error) throw error;
  prediction = typePrediction(prediction);

  x.domain([prediction.y_true.length,0]);
  y.domain([5,1])

    g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    g.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(y).ticks(5, ""))
      .append("text")
        .attr("x", 4)
        .attr("y", 0.5)
        .attr("dy", "0.32em")
        .style("text-anchor", "start")
        .style("fill", "#000")
        .style("font-weight", "bold")
        .text("Stars rating");

        g.append("g")
        .attr("class", "true")
        .append("path")
        .attr("d", line(prediction.y_true));


        g.append("g")
        .attr("class", "predicted")
        .append("path")
        .attr("d", line(prediction.y_rf))
        .attr("stroke","blue");

});

function mouseover(d) {
  d3.select(d.data.city.line).classed("city--hover", true);
  d.data.city.line.parentNode.appendChild(d.data.city.line);
  focus.attr("transform", "translate(" + x(d.data.date) + "," + y(d.data.value) + ")");
  focus.select("text").text(d.data.city.name);
}

function mouseout(d) {
  d3.select(d.data.city.line).classed("city--hover", false);
  focus.attr("transform", "translate(-100,-100)");
}
function typePrediction(d){


        var predictions = {
            "y_true": [],
            "y_rf": []
        }
        var y_true = [];
        var y_rf = [];
        var temps = [];
        var mod = 5
        for(var i = 0; i < d.points.length; i++){

            var coord = [d.points[i][0],d.points[i][1]];
            y_true.push(coord[0])
            temps.push(coord[1])
            if(i % mod == mod-1){

                var mean = 0
                var sum = 0
                for(var j = 0; j < temps.length; j++){
                    sum+= temps[j];
                }
               mean = sum/mod;
               for(var j = 0; j < temps.length; j++){
                   y_rf.push(mean)
               }
               temps = [];
            }


        }
        predictions.y_true = y_true
        predictions.y_rf = y_rf

        return predictions;
}
}
/*
    MULTIPLE REGRESSION
*/
function initMultipleRegression(){
var svg = d3.select("#multiple-regression-svg"),
    margin = {top: 20, right: 30, bottom: 100, left: 40},
    width = svg.attr("width") - margin.left - margin.right,
    height = svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var y_pred = svg.append("g")
        .attr("class","y_pred");

var rf_pred = svg.append("g")
        .attr("class","rf_pred");

var x = d3.scaleLinear()
          .range([width,0]);

var y = d3.scaleLinear()
          .range([0,height]);
          // create a line function that can convert data[] into x and y points
var line = d3.line()
      			// assign the X function to plot our line as we wish
      			.x(function(d,i) {
      				// verbose logging to show what's actually being done
      				//console.log('Plotting X value for data point: ' + i + ' to be at: ' + x(i) + ' using our xScale.');
      				// return the X coordinate where we want to plot this datapoint
      				return x(i);
      			})
      			.y(function(d,i) {
      				// verbose logging to show what's actually being done
      			//	console.log('Plotting Y value for data point: ' + d + ' to be at: ' + y(d) + " using our yScale.");
      				// return the Y coordinate where we want to plot this datapoint
      				return y(d);
      			})


d3.json("mr_preds_optimal.json",function(error,prediction){
    if (error) throw error;
  prediction = typePrediction(prediction);

  x.domain([prediction.y_true.length,0]);
  y.domain([5,1])

    g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    g.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(y).ticks(5, ""))
      .append("text")
        .attr("x", 4)
        .attr("y", 0.5)
        .attr("dy", "0.32em")
        .style("text-anchor", "start")
        .style("fill", "#000")
        .style("font-weight", "bold")
        .text("Stars rating");

        g.append("g")
        .attr("class", "true")
        .append("path")
        .attr("d", line(prediction.y_true))
        .attr("stroke","black");

        g.append("g")
        .attr("class",  "predicted")
        .append("path")
        .attr("d", line(prediction.y_rf))
        .attr("stroke","blue");
        /*
        g.append("g")
        .attr("class", "cities")
        .selectAll("path")
        .data(prediction)
        .enter().append("circle")
        .attr("r", 3.5)
        .attr("cx", function(d) {
            return x(d.y_rf[0]) })
        .attr("cy", function(d) { return y(d.y_rf[1]); });
        */

 /*
  var focus = g.append("g")
      .attr("transform", "translate(-100,-100)")
      .attr("class", "focus");

  focus.append("circle")
      .attr("r", 3.5);

  focus.append("text")
      .attr("y", -10);

  var voronoiGroup = g.append("g")
      .attr("class", "voronoi");

  voronoiGroup.selectAll("path")
    .data(voronoi.polygons(d3.merge(data.map(function(d) { return d.values; }))))
    .enter().append("path")
      .attr("d", function(d) { return d ? "M" + d.join("L") + "Z" : null; })
      .on("mouseover", mouseover)
      .on("mouseout", mouseout);

  d3.select("#show-voronoi")
      .property("disabled", false)
      .on("change", function() { voronoiGroup.classed("voronoi--show", this.checked); });

*/
});

function mouseover(d) {
  d3.select(d.data.city.line).classed("city--hover", true);
  d.data.city.line.parentNode.appendChild(d.data.city.line);
  focus.attr("transform", "translate(" + x(d.data.date) + "," + y(d.data.value) + ")");
  focus.select("text").text(d.data.city.name);
}

function mouseout(d) {
  d3.select(d.data.city.line).classed("city--hover", false);
  focus.attr("transform", "translate(-100,-100)");
}
function typePrediction(d){




        var predictions = {
            "y_true": [],
            "y_rf": []
        }
        var y_true = [];
        var y_rf = [];
        var temps = [];
        var mod = 5
        for(var i = 0; i < d.points.length; i++){

            var coord = [d.points[i][0],d.points[i][1]];
            y_true.push(coord[0])
            if(coord[1] > 10){

                temps.push(5)
            } else if(coord[1] < 1){

                temps.push(1)
            } else{
                temps.push(coord[1])
            }
            if(i % mod == mod-1){

                var mean = 0
                var sum = 0
                for(var j = 0; j < temps.length; j++){
                    sum+= temps[j];
                }
               mean = sum/mod;
               for(var j = 0; j < temps.length; j++){
                   y_rf.push(mean)
               }
               temps = [];
            }


        }
        predictions.y_true = y_true
        predictions.y_rf = y_rf

        return predictions;
}
}
initMultipleRegression();
initNeuralNetwork();
initRandomForest();
