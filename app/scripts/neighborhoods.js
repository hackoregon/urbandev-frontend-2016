var neighborhoods = {
  map: null,
  data: null,
  elems : {
    map : $("#map"),
    sidebar : $("#sidebar"),
    neighborhoodDropdown : $("#neighborhood-dropdown"),
    neighborhoodHover : $("#neighborhood-hover"),
    neighborhoodSummary : $("#neighborhood-summary")
  },
  geoJSONPath : "/data/neighborhoods.json",  // geojson shapefiles (from zillow)
  neighborhoodsArray : [],
  neighborhoodsObject : {},
  googleMapParams : {
    zoom: 11,
    panControl: true,
    zoomControl: true,
    center: new google.maps.LatLng(45.52306220000001,-122.67648159999999),
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    styles: [{"featureType":"all","elementType":"all","stylers":[{"lightness":"29"},{"invert_lightness":true},{"hue":"#008fff"},{"saturation":"-73"}]},{"featureType":"all","elementType":"labels","stylers":[{"saturation":"-72"}]},{"featureType":"administrative","elementType":"all","stylers":[{"lightness":"32"},{"weight":"0.42"},{"saturation":"0"}]},{"featureType":"administrative","elementType":"labels","stylers":[{"visibility":"on"},{"lightness":"64"},{"saturation":"-45"},{"weight":"1.02"}]},{"featureType":"landscape","elementType":"all","stylers":[{"lightness":"-95"},{"gamma":"1.13"}]},{"featureType":"landscape","elementType":"geometry.fill","stylers":[{"hue":"#006dff"},{"lightness":"4"},{"gamma":"1.44"},{"saturation":"-67"}]},{"featureType":"landscape","elementType":"geometry.stroke","stylers":[{"lightness":"5"}]},{"featureType":"landscape","elementType":"labels.text.fill","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"labels.text.fill","stylers":[{"weight":"0.84"},{"gamma":"0.5"}]},{"featureType":"poi","elementType":"labels.text.stroke","stylers":[{"visibility":"off"},{"weight":"0.79"},{"gamma":"0.5"}]},{"featureType":"road","elementType":"all","stylers":[{"visibility":"simplified"},{"lightness":"-78"},{"saturation":"-91"},{"color":"#1e1e1e"}]},{"featureType":"road","elementType":"labels.text","stylers":[{"color":"#ffffff"},{"lightness":"-49"}]},{"featureType":"road","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"lightness":"5"},{"color":"#bdb325"}]},{"featureType":"road.highway","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"lightness":"10"},{"gamma":"1"}]},{"featureType":"road.local","elementType":"geometry.fill","stylers":[{"lightness":"10"},{"saturation":"-100"}]},{"featureType":"transit","elementType":"all","stylers":[{"lightness":"-35"}]},{"featureType":"transit","elementType":"labels.text.stroke","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"saturation":"-97"},{"lightness":"-14"},{"color":"#000000"}]}],
    disableDefaultUI: true
  },
  hoverStyle:{   
    strokeColor: "#FFFFFF",  
    fillOpacity: 0.6, 
    strokeWeight: 2,
    zIndex: 4
  },
  disabledStyle : {    
    strokeWeight: 1,
    strokeColor: "#979797",
    fillOpacity: 0.15, 
    fillColor: "#FFFFFF",
    zIndex: 2
  },
  selectedStyle : {    
    strokeWeight: 2,
    strokeColor: "#51A1e3",
    fillOpacity: 0.0, 
    fillColor: "#FFFFFF",
    zIndex: 5
  },
  blockgroupStyle : {    
    strokeWeight: 0.5,
    fillOpacity: 0.9, 
    fillColor: "red",
    zIndex: 1
  } 
};

neighborhoods.createNeighborhoodsDropdown = function () {

  var html = "",
      that = this,
      template = '<option value="{id}">{name}</option>',
      nSelect = this.elems.neighborhoodDropdown,
      nArray = this.neighborhoodsArray.sort(sortByName)

  for( var i=0; i<nArray.length; i++) {
    var item = nArray[i];
    html+=template.replace("{id}",item.ID).replace("{name}",item.Name)
  }

  nSelect.html(html).select2({
    placeholder: "Select a neighborhood",
    theme: "classic"
  });

  nSelect.on("change", function() {
    that.selectRegion( $(this).val() );
  });

  // blank default selection
  nSelect.val(0).trigger('change.select2');
};

neighborhoods.addDataPoint = function(e) {

  if(e.feature.getGeometry().getType()==='Polygon'){
      
      // Create bounds rectangle to place datapoint properly
      var bounds=new google.maps.LatLngBounds();
      e.feature.getGeometry().getArray().forEach(function(path){              
         path.getArray().forEach(function(latLng){bounds.extend(latLng);});
      });
      e.feature.setProperty('bounds',bounds);
      
      // Push data object with feature data to array and object
      var dataObject = {
        "Name":e.feature.H.NAME,
        "ID" : e.feature.H.REGIONID, 
        "Center" : bounds.getCenter(),
        "Feature" : e.feature
      };

      neighborhoods.neighborhoodsArray.push(dataObject);
      neighborhoods.neighborhoodsObject[e.feature.H.REGIONID] = dataObject;

      var labelText = e.feature.H.NAME;
      var labelDiv = document.createElement("div");
      labelDiv.innerHTML = labelText;
      labelDiv.setAttribute("class", "shape-label");
      labelDiv.setAttribute("id", "shape-" + e.feature.H.REGIONID);
      labelDiv.setAttribute("style", "color:#444;");

      var boxOptions = {
        content: labelDiv,
        id : e.feature.H.REGIONID,
        boxStyle: {
          border: "none",
          textAlign: "center",
          fontSize: "12px",
          width: "50px"
        },
        disableAutoPan: true,
        pixelOffset: new google.maps.Size(-25, 0),
        position: bounds.getCenter(), // method to find center of bounding rectangle
        closeBoxURL: "",
        isHidden: false,
        pane: "mapPane",
        enableEventPropagation: true
      };
      //var ib = new InfoBox(boxOptions);              
      //ib.open(this.map);
    }
};

neighborhoods.resizeMap = function() {
  var w = $(window),
      that = this;
  w.resize(function() {
    that.elems.map.width(w.width()-550);
    that.elems.sidebar.height(w.height()-55);
  });
  w.resize();
};

neighborhoods.createTable = function( obj, elem ) {

  var html = '';

  var keys = Object.keys(obj);

  for (var i = 0; i < keys.length; i++) {
      var tr = '<tr>';
      tr += '<td class="key">' + toTitleCase( keys[i].replace(/_/g,' ') ) + "</td>" + '<td class="value">' + (obj[keys[i]] ? obj[keys[i]] : '') + '</td></tr>';
      html += tr;
  }

  elem.html(html);
}


neighborhoods.createZillowGraphs = function( data ) {
        
    if( !data.Zillow ) {
      data.Zillow = {};
      data.Zillow.MedianValue_sqft = {"Values":null,"Months":null};
      data.Zillow.MedianSold_sqft = {"Values":null,"Months":null};
      data.Zillow.ZRI_sqft = {"Values":null,"Months":null};
    }
    
    if( !data.Zillow.MedianValue_sqft ) {
      data.Zillow.MedianValue_sqft = {"Values":null,"Months":null};
    }

    if( !data.Zillow.MedianSold_sqft ) {
      data.Zillow.MedianSold_sqft = {"Values":null,"Months":null};
    }

    if( !data.Zillow.ZRI_sqft ) {
      data.Zillow.ZRI_sqft = {"Values":null,"Months":null};
    }

    // Pre-process data to remove outliers
    var value = data.Zillow.MedianValue_sqft.Values;
    var sold = data.Zillow.MedianSold_sqft.Values;

    if( value && value.length && sold && sold.length ){
      for( var i=0; i<value.length; i++){
        if( value[i] > 2500 ){
          value[i] = null;
        }
        if( sold[i] > 2500 ) {
          sold[i] = null;
        }
      }
    }
    $('#graph-home-value').highcharts({
        chart: {
            backgroundColor: '#343434',
            type: 'spline'
        },
        legend: {
            itemStyle: {
                color: 'white',                
                fontSize: '16px'
            },
            itemHoverStyle: {
              color: 'white',
              fontWeight: 'bold'
            }            
        }, 
        title: {
            text: '',
            x: -20
        },
        xAxis: {
            categories: data.Zillow.MedianValue_sqft.Months,
            labels: {
                style: {
                    color: '#efefef'
                }
            }
        },
        yAxis: {
            title: {
                enabled: false
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#efefef'
            }],
            labels: {
                style: {
                    color: '#efefef'
                }
            }            
        },
        series: [{
            name: 'Median Home Value per sqft',         
            data: data.Zillow.MedianValue_sqft.Values,
        },
        {
            name: 'Median Home Sold Price per sqft',      
            data: data.Zillow.MedianSold_sqft.Values,
            connectNulls: true
        }],
        colors: [
          '#418CC9',
          '#E8DC3A'
        ],        
        lang: {
            noData: "No Data",
            y: -50
        },
        noData: {
          position: {y: -30},
            style: {
                fontWeight: 'bold',
                fontSize: '15px',
                color: '#fff'
            }
        }        
    });
    
    $('#graph-zri').highcharts({
            chart: {
                backgroundColor: '#343434',
                type: 'spline'
            },
            legend: {
              itemStyle: {
                  color: 'white'
              }
            },            
            title: {
                text: '',
                x: -20
            },
            xAxis: {
                categories: data.Zillow.ZRI_sqft.Months
            },
            yAxis: {
                title: {
                    enabled: false
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            series: [{
                name: 'Zillow Rental Index',         
                data: data.Zillow.ZRI_sqft.Values,
            }
            ],
            lang: {
                noData: "No Data",
                y: -50
            },
            noData: {
              position: {y: -30},
                style: {
                    fontWeight: 'bold',
                    fontSize: '15px',
                    color: '#303030'
                }
            }        
        });
};
// Average Rental Prices Chart
neighborhoods.createRentChart = function(data){
  
  // hardcoded Overall portland rental data, pre-calculated
  var portlandData = [1306.93,1488.47,1695.14,2150.53];

  // Handle null data
  if( !data.Craigslist || !data.Craigslist.Values ) {    
    data.Craigslist = {
      'Values' : {
        'avg_price_studio' : null,
        'avg_price_1_br': null,
        'avg_price_2_br': null,
        'avg_price_3_br': null
      }
    }
    portlandData = [null, null, null, null];
  }

  // Craigslist Rental data
  var neighborhoodData = [roundVal(data.Craigslist.Values.avg_price_studio),
                          roundVal(data.Craigslist.Values.avg_price_1_br),
                          roundVal(data.Craigslist.Values.avg_price_2_br),
                          roundVal(data.Craigslist.Values.avg_price_3_br)];

  $('#graph-average-rent').highcharts({
        chart: {
            backgroundColor: '#343434',
            type: 'column'
        },

        legend: {
              itemStyle: {
                  color: '#efefef'
              }
            },     
        xAxis: {
          labels:{
            style: {
                    color: '#efefef'
                }
            },
            categories: ['Studio','1Br','2Br','3Br+'],
            tickinterval: 0,

        },
       yAxis: {
            title: {
                enabled: false
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#efefef'
            }],
            labels: {
                style: {
                    color: '#efefef'
                }
            }            
        },     
        tooltip: {
          shared: true,
          pointFormat: '<span style="color:{series.color}">{series.name}: <b>${point.y}</b><br/>'
        },           
        plotOptions: {
          series: {
            allowPointSelect: true
          },
          column: {
            pointPadding: 0,
            borderWidth: 0,
            shadow: false
            }
        },
        series: [{
            name: data.RegionName,
            data: neighborhoodData,
            color: '#E8DC3A',
            lineWidth: 3


        },{
            name: 'Portland Average',
            data: portlandData,
            color: '#51A1e3',
            lineWidth: 3
         }]
    });
};

// Create Income Chart
neighborhoods.createIncomeChart = function(data){
  
  // Handle null data
  if( !data.Income || !data.Income.Values ) {    
    data.Income = {
      "Values" : {
        "total": null,
        "income_100000_199999": null,
        "income_75000_99999": null,
        "income_200000_more": null,
        "income_60000_74999": null,
        "income_20000_29999": null,
        "income_less_10000": null,
        "income_40000_49999": null,
        "income_50000_59999": null,
        "income_30000_39999": null,
        "income_10000_19999": null
      }
    };
  }

  // Craigslist Rental data
  var incomeData = [
    roundVal(data.Income.Values[1].income_less_10000),
    roundVal(data.Income.Values[1].income_10000_19999),
    roundVal(data.Income.Values[1].income_20000_29999),
    roundVal(data.Income.Values[1].income_30000_39999),
    roundVal(data.Income.Values[1].income_40000_49999),
    roundVal(data.Income.Values[1].income_50000_59999),
    roundVal(data.Income.Values[1].income_60000_74999),
    roundVal(data.Income.Values[1].income_75000_99999),
    roundVal(data.Income.Values[1].income_100000_199999),
    roundVal(data.Income.Values[1].income_200000_more)
  ];

  $('#graph-income').highcharts({
        chart: {
            backgroundColor: '#343434',
            type: 'column'
        },
        legend: {
            itemStyle: {
                color: '#efefef'
            }
          },
        xAxis: {
          labels:{
            style: {
                    color: '#efefef'
                }
            },
            categories: ['<10k','10k-20k','20k-30k','30k-40k','40k-50k','50k-60k','60k-75k', '75k-100k','100k-199k','>200k'],
            tickinterval: 0,

        },
       yAxis: {
            title: {
                enabled: false
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#efefef'
            }],
            labels: {
                style: {
                    color: '#efefef'
                }
            }            
        },     
        tooltip: {
          shared: true,
          pointFormat: '<span style="color:{series.color}">{series.name}: <b>${point.y}</b><br/>'
        },           
        plotOptions: {
          series: {
            allowPointSelect: true
          },
          column: {
            pointPadding: 0,
            borderWidth: 0,
            shadow: false
            }
        },
        series: [{
            name: data.RegionName,
            data: incomeData,
            color: '#E8DC3A',
            lineWidth: 3
        }]
    });
};

neighborhoods.createRadarChart = function( selector, keyName, data ) {

  $('#graph-radar').highcharts({
      chart: {
          backgroundColor: '#343434',
          polar: true,
          type: 'line'
      },
      legend: {
          itemStyle: {
              color: 'white'
          }
      },
      title: {
          text: '',
          x: -80
      },
      pane: {
          size: '80%'
      },
      xAxis: {
          categories: ['Population', 'Home Value', 'Crime', 'Demolitions'],
          tickmarkPlacement: 'on',
          lineWidth: 0
      },

      yAxis: {
          gridLineInterpolation: 'polygon',
          lineWidth: 0,
          min: 0
      },

      tooltip: {
          shared: true,
          pointFormat: '<span style="color:{series.color}">{series.name}: <b>{point.y} %</b><br/>'
      },

      legend: {
          enabled: false
      },

      series: [{
          name: 'Portland Average',
          data: [23, 12, 65, 43],
          pointPlacement: 'on'
      }, {
          name: 'Actual Value',
          data: [37, 9, 24, 28],
          pointPlacement: 'on'
      }]
  });
};


neighborhoods.createPieChart = function( selector, keyName, data ) {

    if( data[keyName] && data[keyName].Values) {
      
      //for now just use latest time period
      var d = data[keyName].Values[0]; 
      var k = Object.keys(d);   
      var v = [];
      for(var key in d) {
          v.push( d[key] );
      }

      data.highcharts[keyName] = [];

      for( var i=0; i < v.length; i++) {
        
        if( k[i] == "total" ) continue;

        var elem = {
            name: toTitleCase( k[i].replace(/_/g,' ') ),
            y: v[i],
            dataLabels: {
                //enabled: false
            }
        };

        data.highcharts[keyName].push(elem);
      }

      $(selector).highcharts({
          chart: {
              backgroundColor: '#343434',
              plotBorderWidth: 0,
              plotShadow: false,
              marginTop: -30,
              marginBottom: 0,
          },
          legend: {
            itemStyle: {
                color: 'white',                
                fontSize: '16px'
            },
            itemHoverStyle: {
              color: 'white',
              fontWeight: 'bold'
            }            
          },    
          title: {
              text: '',
              style: {
                  display: 'none'
              }
          },
          subtitle: {
              text: '',
              style: {
                  display: 'none'
              }
          },
          tooltip: {
              pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
          },
          plotOptions: {
              pie: {
                  dataLabels: {
                      allowPointSelect: true,
                      cursor: 'pointer',
                      enabled: false,                  
                      distance: -50,
                      style: {
                          fontWeight: 'bold',
                          color: 'white',
                          textShadow: '0px 1px 2px black'
                      }
                  },
                  showInLegend: true,
                  startAngle: -90,
                  endAngle: 90,
                  center: ['50%', '75%'],
                  borderWidth: 0
              }
          },
          series: [{
              type: 'pie',
              name: keyName,
              innerSize: '50%',
              data: data.highcharts[keyName]
          }]
      });

    }
};



neighborhoods.selectRegion = function( regionID ) { 

  var regionID = regionID + '', // make sure this is a string
      that = this,
      dataPath = "http://plot-pdx.s3-website-us-west-2.amazonaws.com/data/v1/" + regionID + ".json";
      
  var updateView = function(d){
    
    that.map.data.forEach(function(ftr) { 
        ftr.setProperty('isSelected', false);
        if( ftr.getProperty('isSelected') ){
          //console.log(ftr);
        }
    });

    // select the feature
    that.neighborhoodsObject[regionID].Feature.setProperty('isSelected', true);
    
    // pan to the Feature Region
    that.map.panTo(that.neighborhoodsObject[regionID].Center);

    // update select2 dropdown (without triggering another change event)
    that.elems.neighborhoodDropdown.val(regionID).trigger('change.select2');

    // trigger resize (to make sure map updates)
    google.maps.event.trigger(map, 'resize');

    // create object for summarized chart data
    d.highcharts = {};

    // Sort Crime Types and Pre-Process and clean up names
    if( d.Crime && d.Crime.Values && d.Crime.Values.length ) {
      
      var obj = d.Crime.Values[ d.Crime.Values.length - 1]; //grab latest crime
      var sortable = [];
      for (var item in obj){
        var name = item;
        if( item == "larceny"){ name = "theft"; }
        if( item == "duii"){ name = "DUII"; }
        sortable.push([name, obj[item]])
      }
      sortable.sort(function(a, b) {return b[1] - a[1]});
      sortable = sortable.slice(0,6);
      d.Crime.Values[0] = {};

      for( var i=0; i< sortable.length;i++) {
        d.Crime.Values[0][sortable[i][0]] = sortable[i][1]
      }
      that.createPieChart('#graph-crime-types', 'Crime', d);
      //that.createTable(d.Crime.Values[i], $("#crime-types"));
    }

    // populate graphs
    that.createZillowGraphs(d);
    that.createPieChart('#graph-education', 'Education', d);
    that.createPieChart('#graph-crime', 'ViolentCrime', d);
    that.createPieChart('#graph-ethnicity', 'Race', d);    
    that.createRentChart(d);
    that.createIncomeChart(d);

    // Dummy data
    var tableData = {
      'home_value':'400000',
      'income':'0',
      'crime_reports':'125',
      'violent_crime_reports':'125',
      'demolitions':'20'
    };

    if( d.Income && d.Income.Values ) {
      var iTotal= 0;
      for( var i=0; i<d.Income.Values.length; i++) {
        if(d.Income.Values[i]){dTotal+=d.Demolitions.Values[i];}
      }
    }
    if( d.Demolitions && d.Demolitions.Values ) {
      var dTotal= 0;
      for( var i=0; i<d.Demolitions.Values.length; i++) {
        if(d.Demolitions.Values[i]){dTotal+=d.Demolitions.Values[i];}
      }
    }    

    tableData.demolitions = dTotal;
    that.createTable(tableData, $("#table-overview"));

  };

  $.ajax({
    dataType: 'json',
    url: dataPath,
    success: function (data) {
      
      updateView(data);
      
      // load blockgroups geojson ** we have disabled this feature!
      //if( typeof data.Blockgroups != 'undefined' && data.Blockgroups.length ) {
      //  that.map.data.addGeoJson(data.Blockgroups[0]);  
      //}      
    },
    error: function (e) {
      console.log("error getting data");
      updateView(null);
    }
  });
};

neighborhoods.init = function() {

  var that = this;

  // create map
  this.map = new google.maps.Map(this.elems.map[0], this.googleMapParams);

  // create datapoint object for each geojson shape
  google.maps.event.addListener(this.map.data,'addfeature', this.addDataPoint);

  // load geoJSON (zillow), and create dropdown after it loads
  this.map.data.loadGeoJson(this.geoJSONPath, null, function (features) {
    that.createNeighborhoodsDropdown();
    that.elems.neighborhoodSummary.text(that.neighborhoodsArray.length);
  });

  // set up selected style
  this.map.data.setStyle(function(feature) {
    if( typeof feature.getProperty('NAMELSAD10') != 'undefined' ) {
      return that.blockgroupStyle;
    }
    else if (feature.getProperty('isSelected')) {
      return that.selectedStyle;
    }
    return that.disabledStyle;
  });

  // set mouseover event for each feature (neighborhood)
  this.map.data.addListener('mouseover', function(event) {    
    if (!event.feature.getProperty('isSelected')){
      that.map.data.revertStyle();
      that.map.data.overrideStyle(event.feature, that.hoverStyle);  
    }
    that.elems.neighborhoodHover.text(event.feature.H.NAME);
  });

  // set click event for each feature (neighborhood)
  this.map.data.addListener('click', function(event) {
    
    if( typeof event.feature.getProperty('NAMELSAD10') != 'undefined' ) {
      event.feature.setProperty('isBlockgroup', true);
    } 
    else {
      that.selectRegion( event.feature.H.REGIONID );  
    } 
  });

  
/*
  $(".show-hide").click(function(){
  
    var elem = $(this),
        body = elem.parent().find(".data-body")

    if( body.is(':visible') ) {
      body.slideUp();
      elem.text('Show');
    }
    else {
      body.slideDown();
      elem.text('Hide');
    }
  });
  */

  // resize map and set up autosizing events
  this.resizeMap();

};
