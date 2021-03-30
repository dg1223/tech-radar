$(function () { // Same as document.addEventListener("DOMContentLoaded"...

  // Same as document.querySelector("#navbarToggle").addEventListener("blur",...
  // Collapses navbar menu if an open area is clicked
  $("#navbarToggle").blur(function (event) {
    var screenWidth = window.innerWidth;
    if (screenWidth < 768) {
      $("#collapsable-nav").collapse('hide');
    }
  });

  // In Firefox and Safari, the click event doesn't retain the focus
  // on the clicked button. Therefore, the blur event will not fire on
  // user clicking somewhere else in the page and the blur event handler
  // which is set up above will not be called.
  // Refer to issue #28 in the repo.
  // Solution: force focus on the element that the click event fired on
  $("#navbarToggle").click(function (event) {
    $(event.target).focus();
  });
});


(function (global) {

// Show current month and date below the ET radar banner
var dt = new Date();
var monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];
var year = dt.getFullYear();
document.getElementById("date").innerHTML = 
  monthNames[dt.getMonth()].toLocaleString() 
  + " " 
  + year.toLocaleString().replace(/,/g, '');


var dc = {};

var homeHtml = "snippets/home-snippet.html";
// var allCategoriesUrl =
//   "https://davids-restaurant.herokuapp.com/categories.json";
// var categoriesTitleHtml = "snippets/categories-title-snippet.html";
// var categoryHtml = "snippets/category-snippet.html";
// var menuItemsUrl =
//   "https://davids-restaurant.herokuapp.com/menu_items.json?category=";
// var menuItemsTitleHtml = "snippets/menu-items-title.html";
// var menuItemHtml = "snippets/menu-item.html";

// Convenience function for inserting innerHTML for 'select'
var insertHtml = function (selector, html) {
  var targetElem = document.querySelector(selector);
  targetElem.innerHTML = html;
};

// Show loading icon inside element identified by 'selector'.
var showLoading = function (selector) {
  var html = "<div class='text-center'>";
  html += "<img src='images/ajax-loader.gif'></div>";
  insertHtml(selector, html);
};

// Return substitute of '{{propName}}'
// with propValue in given 'string'
var insertProperty = function (string, propName, propValue) {
  var propToReplace = "{{" + propName + "}}";
  string = string
    .replace(new RegExp(propToReplace, "g"), propValue);
  return string;
}

// Remove the class 'active' from home and switch to Menu button
var switchMenuToActive = function () {
  // Remove 'active' from home button
  var classes = document.querySelector("#navHomeButton").className;
  classes = classes.replace(new RegExp("active", "g"), "");
  document.querySelector("#navHomeButton").className = classes;

  // Add 'active' to menu button if not already there
  classes = document.querySelector("#navMenuButton").className;
  if (classes.indexOf("active") == -1) {
    classes += " active";
    document.querySelector("#navMenuButton").className = classes;
  }
};

// On page load (before images or CSS)
document.addEventListener("DOMContentLoaded", function (event) {

// On first load, show home view
// showLoading("#main-content");
// $ajaxUtils.sendGetRequest(
//   homeHtml,
//   function (responseText) {
//     document.querySelector("#main-content")
//       .innerHTML = responseText;
//   },
//   false);

document.querySelector("#Readiness")
      .addEventListener("mousemove", 
        function(event) {
          if (event.shiftKey == true) {
            // console.log(document.querySelector(".jumbotron").innerHTML)
            console.log("x: " + event.clientX)
            console.log("y: " + event.clientY)  
          }
          
        }

      )

// Automatically generate required number of coordinates //

// Count number of technologies in each research phase
radarURL = "https://raw.githubusercontent.com/dg1223/storage/master/ETR_clean.json"

$.getJSON( radarURL, function(data){
  var num_technologies = Object.keys(data["Emerging Technology" ]).length;
  var counts = [];
  var tech_indices = [];
  var id, st, rel, pl, ad, adr, red;
  id=st=rel=pl=ad=adr=red=0;
  for (var i=0; i<num_technologies; i++) {
    if (data["KPI Research Phase (Topic)"][i] === "Identify") {
      id += 1;
    } else if (data["KPI Research Phase (Topic)"][i] === "Study") {
      st += 1;
    } else if (data["KPI Research Phase (Topic)"][i] === "Relate") {
      rel += 1;
    } else if (data["KPI Research Phase (Topic)"][i] === "Plan") {
      pl += 1;
    } else if (data["KPI Research Phase (Topic)"][i] === "Adopt") {
      ad += 1;
    } else if (data["KPI Research Phase (Topic)"][i] === "Adopt/Readiness") {
      adr += 1;
    } else if (data["KPI Research Phase (Topic)"][i] === "Readiness"){
      red += 1;
    } else {}
  }
  counts.push({
    identify: id,
    study: st,
    relate: rel,
    plan: pl,
    adopt: ad,
    adopt_readiness: adr,
    readiness: red,
    total: num_technologies
  })
  // console.log(counts)
  // console.log(data["KPI Research Phase (Topic)"])
  // return counts;

  // get document coordinates of the element
  function getCoords(elem) {
    var box = elem.getBoundingClientRect();

    return {
      top: box.top + window.pageYOffset,
      right: box.right + window.pageXOffset,
      bottom: box.bottom + window.pageYOffset,
      left: box.left + window.pageXOffset,
      height: box.height,
      width: box.width,
      radius: box.height/2,
      centre_x: (box.left + ((box.right-box.left)/2)) + window.pageXOffset,
      centre_y: (box.top + ((box.bottom-box.top)/2)) + window.pageYOffset
    };
  }

  var phaseQuery = "#Readiness";
  var phase = "Readiness";
  var elem = document.querySelector(phaseQuery);
  var rect = getCoords(elem);
  // console.log(rect);


  // Find coordinates within the boundary of an arc
  function findCoordinates(left, top, radius, numpoints) {
      // How many points do we want?
      var numberOfPoints = numpoints;
      var degreesPerPoint = 90 / numberOfPoints;

      // Keep track of the angle from centre to radius
      var currentAngle = degreesPerPoint;

      // The points on the radius will be left+x2, top+y2
      var x2;
      var y2;

      // Track the points we generate to return at the end
      var points = [];

      // Get indices for research phase
      var indices = [];
      for (var i = 0; i<num_technologies; i++){
        if (data["KPI Research Phase (Topic)"][i] === phase){
          indices.push(i)
        }
      }
      // console.log(indices)


      for(var i=0; i < numberOfPoints; i++) {
        var tech_index = indices[i];
        var technology = data["Emerging Technology"][tech_index];
        // Convert degree to radian
        var radian = currentAngle * Math.PI / 180;
        // X2 point will be cosine of angle * radius (range)
        x2 = Math.cos(radian) * radius;
        // Y2 point will be sin * range
        y2 = Math.sin(radian) * radius;

        // save to our results array
        if (i%2 === 0) {
          points.push({
            // theta: currentAngle,
            x: left-x2,
            y: top-y2,
            tech: technology
          });
        } else {
          points.push({
            // theta: currentAngle,
            x: left-(x2/2),
            y: top-(y2/2),
            tech: technology       
          });
        }
        

        // Shift our angle around for the next point
        currentAngle += degreesPerPoint;
    }
      // Return the points we've generated
      return points;
  }

  var x = rect.centre_x;
  var y = rect.centre_y;
  // var r = rect.radius;
  var numPoints = counts[0].readiness;
  var point = findCoordinates(x, y, 202.5, numPoints); // Hardcoded in styles.css
  console.log(point)

  })

});


// Load the menu categories view
dc.loadMenuCategories = function () {
  showLoading("#main-content");
  $ajaxUtils.sendGetRequest(
    allCategoriesUrl,
    buildAndShowCategoriesHTML);
};


// Load the menu items view
// 'categoryShort' is a short_name for a category
dc.loadMenuItems = function (categoryShort) {
  showLoading("#main-content");
  $ajaxUtils.sendGetRequest(
    menuItemsUrl + categoryShort,
    buildAndShowMenuItemsHTML);
};


// Builds HTML for the categories page based on the data
// from the server
function buildAndShowCategoriesHTML (categories) {
  // Load title snippet of categories page
  $ajaxUtils.sendGetRequest(
    categoriesTitleHtml,
    function (categoriesTitleHtml) {
      // Retrieve single category snippet
      $ajaxUtils.sendGetRequest(
        categoryHtml,
        function (categoryHtml) {
          // Switch CSS class active to menu button
          switchMenuToActive();

          var categoriesViewHtml =
            buildCategoriesViewHtml(categories,
                                    categoriesTitleHtml,
                                    categoryHtml);
          insertHtml("#main-content", categoriesViewHtml);
        },
        false);
    },
    false);
}


// Using categories data and snippets html
// build categories view HTML to be inserted into page
function buildCategoriesViewHtml(categories,
                                 categoriesTitleHtml,
                                 categoryHtml) {

  var finalHtml = categoriesTitleHtml;
  finalHtml += "<section class='row'>";

  // Loop over categories
  for (var i = 0; i < categories.length; i++) {
    // Insert category values
    var html = categoryHtml;
    var name = "" + categories[i].name;
    var short_name = categories[i].short_name;
    html =
      insertProperty(html, "name", name);
    html =
      insertProperty(html,
                     "short_name",
                     short_name);
    finalHtml += html;
  }

  finalHtml += "</section>";
  return finalHtml;
}



// Builds HTML for the single category page based on the data
// from the server
function buildAndShowMenuItemsHTML (categoryMenuItems) {
  // Load title snippet of menu items page
  $ajaxUtils.sendGetRequest(
    menuItemsTitleHtml,
    function (menuItemsTitleHtml) {
      // Retrieve single menu item snippet
      $ajaxUtils.sendGetRequest(
        menuItemHtml,
        function (menuItemHtml) {
          // Switch CSS class active to menu button
          switchMenuToActive();

          var menuItemsViewHtml =
            buildMenuItemsViewHtml(categoryMenuItems,
                                   menuItemsTitleHtml,
                                   menuItemHtml);
          insertHtml("#main-content", menuItemsViewHtml);
        },
        false);
    },
    false);
}


// Using category and menu items data and snippets html
// build menu items view HTML to be inserted into page
function buildMenuItemsViewHtml(categoryMenuItems,
                                menuItemsTitleHtml,
                                menuItemHtml) {

  menuItemsTitleHtml =
    insertProperty(menuItemsTitleHtml,
                   "name",
                   categoryMenuItems.category.name);
  menuItemsTitleHtml =
    insertProperty(menuItemsTitleHtml,
                   "special_instructions",
                   categoryMenuItems.category.special_instructions);

  var finalHtml = menuItemsTitleHtml;
  finalHtml += "<section class='row'>";

  // Loop over menu items
  var menuItems = categoryMenuItems.menu_items;
  var catShortName = categoryMenuItems.category.short_name;
  for (var i = 0; i < menuItems.length; i++) {
    // Insert menu item values
    var html = menuItemHtml;
    html =
      insertProperty(html, "short_name", menuItems[i].short_name);
    html =
      insertProperty(html,
                     "catShortName",
                     catShortName);
    html =
      insertItemPrice(html,
                      "price_small",
                      menuItems[i].price_small);
    html =
      insertItemPortionName(html,
                            "small_portion_name",
                            menuItems[i].small_portion_name);
    html =
      insertItemPrice(html,
                      "price_large",
                      menuItems[i].price_large);
    html =
      insertItemPortionName(html,
                            "large_portion_name",
                            menuItems[i].large_portion_name);
    html =
      insertProperty(html,
                     "name",
                     menuItems[i].name);
    html =
      insertProperty(html,
                     "description",
                     menuItems[i].description);

    // Add clearfix after every second menu item
    if (i % 2 != 0) {
      html +=
        "<div class='clearfix visible-lg-block visible-md-block'></div>";
    }

    finalHtml += html;
  }

  finalHtml += "</section>";
  return finalHtml;
}


// Appends price with '$' if price exists
function insertItemPrice(html,
                         pricePropName,
                         priceValue) {
  // If not specified, replace with empty string
  if (!priceValue) {
    return insertProperty(html, pricePropName, "");;
  }

  priceValue = "$" + priceValue.toFixed(2);
  html = insertProperty(html, pricePropName, priceValue);
  return html;
}


// Appends portion name in parens if it exists
function insertItemPortionName(html,
                               portionPropName,
                               portionValue) {
  // If not specified, return original string
  if (!portionValue) {
    return insertProperty(html, portionPropName, "");
  }

  portionValue = "(" + portionValue + ")";
  html = insertProperty(html, portionPropName, portionValue);
  return html;
}


global.$dc = dc;

})(window);
