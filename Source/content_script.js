// JuicyInfeaux by Danny Walker, 2017
// Licensed as CC BY-NC-SA 4.0

// I apologise for making this.

// Here's the good shit we're looking for, feel free to edit this as you want
var theJuicyKeyWords = ["Legal", "issues", "Arrest", "conviction", "personal", "lawsuit", "Controversy", "politics", "education", "drug", "views"];

// Probably not a great idea to edit from here onwards if you don't know what you're doing.

var nextUntil = function (elem, selector, filter) {
    // Good-ass function courtesy of https://gomakethings.com/how-to-get-all-sibling-elements-until-a-match-is-found-with-vanilla-javascript/
    // matches() polyfill
    if (!Element.prototype.matches) {
        Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
    }

    // Setup siblings array
    var siblings = [];

    siblings.push(elem);

    // Get the next sibling element
    elem = elem.nextElementSibling;

    // As long as a sibling exists
    while (elem) {

        // If we've reached our match, bail
        if (elem.matches(selector)) break;

        // If filtering by a selector, check if the sibling matches
        if (filter && !elem.matches(filter)) {
            elem = elem.nextElementSibling;
            continue;
        }

        // Otherwise, push it to the siblings array
        siblings.push(elem);

        // Get the next sibling element
        elem = elem.nextElementSibling;

    }
    return siblings;
};


var prevH2 = function (elem) {
    // Basically the same as above but it only looks upwards for a h2 object
    // matches() polyfill
    if (!Element.prototype.matches) {
        Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
    }

    // Get the preious sibling element
    elem = elem.previousElementSibling;

    var foundH2;

    // As long as a sibling exists
    while (elem) {

        // If we've found a h2, bail
        if (elem.matches("h2")){
          foundH2 = elem;
          break;
        }
        // If not...
        // Get the previous sibling element
        elem = elem.previousElementSibling;

    }
    return foundH2;
};

// Formats a given string in the same way wikipedia formats their headings so we can get matches
var formatHeading = function (juicyString){
  var stringz = juicyString.split(" ");
  for(var w = 0; w<stringz.length;w++){
    stringz[w] = stringz[w].toLowerCase();
  }
  if(stringz[0].length>1){
    var firstWord = stringz[0].substring(0,1).toUpperCase() + stringz[0].substring(1,stringz[0].length);
    stringz[0] = firstWord;
  } else {
    var firstWord = stringz[0].toUpperCase();
    stringz[0] = firstWord;
  }
  var headingCased = "";
  for(var w = 0; w<stringz.length;w++){
    headingCased += stringz[w];
    if(w != stringz.length-1){
      headingCased += "_";
    }
  }
  return headingCased;
}

// Arrays to store mathed h2 and h3 strings
var theJuicyH2s = [];
var theJuicyH3s = [];

// Fun way of converting a HTMLCollection to an Array, which is brexit tbh
var h2 = Array.prototype.slice.call(document.getElementsByTagName("h2"), 0);
var h3 = Array.prototype.slice.call(document.getElementsByTagName("h3"), 0);

// Grab the first h2 node (that isn't the word "Contents", so actually the second node) so we can put stuff after it
h2First = h2[1];

// Search for h2 elements that match first, and then search for h3 elements that match separately
for(var i=0;i<h2.length;i++){
  for (var j=0;j<theJuicyKeyWords.length;j++){
    var headingText = h2[i].firstChild.innerHTML;
    if(headingText){ // If there is some inner HTML
      var searchTerms = theJuicyKeyWords[j].split(" "); // Split the title up into words
      for(var k = 0; k<searchTerms.length; k++){ // Loop over the array returned
        if(headingText.toLowerCase().includes(searchTerms[k].toLowerCase())){ // Do the actual checking for matches with the juicy keywords
          theJuicyH2s.push(formatHeading(headingText)); // If we find a match, add it to the array
        }
      }
    }
  }
}

// Do the h3 search, the same as above
for(var i=0;i<h3.length;i++){
  for (var j=0;j<theJuicyKeyWords.length;j++){
    var headingText = h3[i].firstChild.innerHTML;
    if(headingText){
      var searchTerms = theJuicyKeyWords[j].split(" ");
      for(var k = 0; k<searchTerms.length; k++){
        if(headingText.toLowerCase().includes(searchTerms[k].toLowerCase())){
          theJuicyH3s.push(formatHeading(headingText));
        }
      }
    }
  }
}

console.log("Moving these Sections:");

// Grab the matched elements and move them to in front of the first h2
for(var t = 0; t<theJuicyH2s.length;t++){
  var f = document.getElementById(theJuicyH2s[t]);
  if(f){
    console.log(theJuicyH2s[t])
    f = f.parentElement;
    var g = nextUntil(f,"h2");
    g.forEach(function(el){
      h2First.insertAdjacentElement('beforebegin', el)
    });
  }
}

// Kinda brexit way of not duplicating h2 nodes repeatedly given lots of h3 matches
var copiedH2s = [];

// Same as above, but with the check for duplicate h2s if there's multiple matches in one section
for(var t = 0; t<theJuicyH3s.length;t++){
  var f = document.getElementById(theJuicyH3s[t]);
  if(f){
    console.log(theJuicyH3s[t])
    f = f.parentElement;
    var h2above = prevH2(f);
    if(copiedH2s.includes(h2above)){
      var h2copy = h2above.cloneNode(true);
      h2First.insertAdjacentElement('beforebegin', h2copy);
      copiedH2s.push(h2above);
    }
    var g = nextUntil(f,"h2,h3");
    g.forEach(function(el){
      h2First.insertAdjacentElement('beforebegin', el)
    });
  }
}
