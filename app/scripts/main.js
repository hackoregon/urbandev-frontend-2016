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
function formatRankData(obj){
  if (obj.rank && obj.count) {
    return ordinalSuffixOf(obj.rank) + ' of ' + obj.count;
  } else {
    return 'NA';
  }
}
function ordinalSuffixOf(i) {
  var j = i % 10,
      k = i % 100;
  if (j == 1 && k != 11) {
    return i + "st";
  }
  if (j == 2 && k != 12) {
    return i + "nd";
  }
  if (j == 3 && k != 13) {
    return i + "rd";
  }
  return i + "th";
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
    ALEX'S COLORS:
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
   */
   colors: [
    '#51A1E3',
    '#E8DC3A',
    '#E57900',
    '#1D4F0F',
    '#789310',
    '#515151',
    '#C95C7C', // white ethnicity
    '#AA370F',
    '#3E4B6D',
    '#ADCE4F',
    '#E8CB71',
    '#EAA475',
    '#C66363'
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
