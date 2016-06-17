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
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1)});
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
   /* Not using these colors, too similar
   colors: [
    '#418CC9',
    '#51A1E3',
    '#7AB3E3',
    '#B8D7EB',
    '#E0E0E0',
    '#B4B7B9',
    '#999C9E',
    '#808588',
    '656B6F'
   ]
   */
   colors: [

    '#7ec9ac',
      '#e06d5e',
      '#fcead5',      
      '#357573', 
      '#c9aa7e',                
      '#683E81',
      '#1d9fd3', // white ethnicity
      '#C18657',
      '#C1C057',
      '#2C9D6C',
      '#66A1B7',
      '#FFC189',
      '#9d7ec9'
   ]
});

jQuery(document).ready(function($) {
  neighborhoods.init();	
  registerNavModals();

  // For testing only
  setTimeout(function(){
    neighborhoods.selectRegion(274797);
  }, 800);

});

