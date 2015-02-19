
function createMenuTree(menuData) {
  // The menu tree (our new deep structure)
  var menuTree = [];

  // sort by weight
  menuData.sort(function(x,y){
    return x.ord > y.ord;
  });

  //since JS always assigns properties by reference
  //we can use separate variables to track objects in menuData 
  var hash = {};

  // Loop through original data and add to hash
  menuData.forEach(function(item) {
    //give each menu item a new property called children
    item.children = [];

    //track each item in our hashes (reference to orig obj)
    hash["_"+item.mid] = item;

    // if i am top level, add to tree right away
    if(item.pid === null){
      menuTree.push(item);
      return;
    }
  });


  //add children to all menu_items using the hash reference
  for(var i in hash){
    item = hash[i];
    //if no plid, skip this iteration of the loop
    if(!item.pid){continue;}

    // add me to menuTree using the hash reference
    hash["_"+item.pid].children.push(item);
  }

  return menuTree;
}

function createAdminMenuSelect(data) {
  
  //createMenuTree() has been moved to helpers.js
  var menuTree = createMenuTree(data);

  //our #admin-form select element
  var select_html = $('<select class="form-control"/>');

  //add a top option with mlid null to our select right away
  var topOption = $('<option value="">Top</option>');
   
  console.log("AdminMenu");

topOption.data("menuItem", {mid: null, menu: "Basemenu"});
  select_html.append(topOption);

  //then recurse through the menuTree and add all menu links to select
  select_html = buildSelectOptions(select_html, menuTree, 0);

  //finally, append the select to the admin-form
  $("#admin-form .menuSelect").html(select_html);
}


//recursive function to build all select options for a menu
function buildSelectOptions(select_html, menuItems, level) {
  for (var j = 0; j < menuItems.length; j++) {
    //use - as depth indicator
    var depthIndicator = "-";
    for (var i = 0; i < level; i++) {
      //add more depth for each level
      depthIndicator += "-";
    }

    //create a new select dropdown option
    var option = $('<option value="'+menuItems[j].mid+'">'+depthIndicator+" "+menuItems[j].title+'</option>');

    //add menu item data to each select option
    option.data("menuItem", menuItems[j]);

    //and append the option
    select_html.append(option);

    //if this menu item has children, start this function all over again
    if (menuItems[j].children.length > 0) {
      select_html.append(buildSelectOptions(select_html, menuItems[j].children, level+1));
    }
  }

  return select_html;
}



 function createMainMenu(data) {
  //createMenuTree() has been moved to helpers.js
  var menuTree = createMenuTree(data);
  console.log("menuTree",menuTree);
  //create mainMenuHtml
  var mainMenuHtml = $('<ul class="nav nav-tabs"/>');
  //and append all menuLinks (and their submenus) 
  //recursively as <li> tags
  mainMenuHtml = buildMainMenu(mainMenuHtml, menuTree);

  //and finally replace .navbar menu with new html
  $("header .navbar-collapse").find(".nav-tabs").remove();
  $("header .navbar-collapse").prepend(mainMenuHtml);
}


//recursive function to build all submenus for a menuItem
function buildMainMenu(menuHtml, menuItems) {
  //for each menu item on this menu level
  for (var j = 0; j < menuItems.length; j++) {
    //create a new <li> tag
    var menuLink;
    if (menuItems[j].children.length < 1) {
      //if this item has no children, only a make menuLink 
      //("<li><a></a></li>")
      menuLink = $('<li><a href="'+menuItems[j].path+'">'+menuItems[j].title+'</a></li>');
    } else {
      //if this item has children, make a menuLink and a submenu 
      //("<li><a></a><ul></ul></li>")

      //first add <li><a></a></li>
      menuLink = $('<li class="dropdown"><a href="'+menuItems[j].path+'">'+menuItems[j].title+'</a></li>');
      
      //then create submenu <ul></ul>
      var newDropDown = $('<ul class="dropdown-menu"/>');


      //append finished dropdown to menuLink
      menuLink.prepend(newDropDown);
      //start this function all over again to append submenu 
      //menuLinks to the newDropDown
      buildMainMenu(newDropDown, menuItems[j].children);
    }

    //and finally append new menuLink to menuHtml
    menuHtml.append(menuLink);
  }

  return menuHtml;
}
