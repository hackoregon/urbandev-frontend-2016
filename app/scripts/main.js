// Main

// Utility Functions
function roundVal(num) {    
    return +(Math.round(num + "e+2")  + "e-2");
}

function sortByName(a, b){
  var aName = a.Name.toLowerCase();
  var bName = b.Name.toLowerCase(); 
  return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
}

function registerNavModals(){
  var navItems = $('.nav-item');
  navItems.each(function(index, item){
    var type = item.innerHTML,
    template = './templates/' + type + '.html';
    $(item).modal(template);
  });
}
function toTitleCase(str){
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}


// Highcharts General Options
Highcharts.setOptions({
   global: {
      useUTC: true
   },
   credits: false,
   chart: {
      style: {
         fontFamily: 'Dosis',
         backgroundColor: '#343434'
      }
   },
   colors: [
      '#418CC9',
      '#51A1E3',
      "#7AB3E3",
      "#B8D7EB",
      '#E0E0E0',
      '#B4B7B9',
      '#999C9E',
      '#808588'
   ]
});

jQuery(document).ready(function($) {
  neighborhoods.init();	
  registerNavModals();

  // For testing only
  /*setTimeout(function(){
    neighborhoods.selectRegion(274797);
  }, 1200);*/

});

