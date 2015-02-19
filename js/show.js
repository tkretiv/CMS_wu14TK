


/**
 * Navigation & history push/pop-state
 *
 */

//function to show/hide sections
function showPage(pageUrl) {
  //if no pageUrl was recieved (or home was recieved),
  //show the "front page"
  if (!pageUrl || pageUrl == "home") {
    pageUrl = "home.html";
  }

  //get main menu links
  //now also sending the createMainMenu() function as a parameter
  getMenuLinks("Basemenu", createMainMenu);



  //always initially hide the admin content-list search box
  // $(".navbarSearchForm").hide();

  //if needed get data using AJAX
  // if (pageUrl == "content-list") {
  //   //get admin content list
  //   getPages();

  //   //and show the admin content-list search box
  //   $(".navbarSearchForm").fadeIn(500);
  // } else if (pageUrl == "admin-form") {
  //   //hide "Add to menu" fields initially
  //   $("#admin-form .menuLinkFields").hide();

  //   //get admin "Add to menu" select list
  //   //now also sending the createAdminMenuSelect() function 
  //   //from menus.js as a parameter to getMenuLinks.
  //   getMenuLinks("menu-main-menu", createAdminMenuSelect);
  // } else {
  //   //else try to find a page for the url using 
  //   //getCurrentPage() from ajax.js 
  console.log("show page: ",pageUrl);
    getCurrentPage(pageUrl);

  //   //once we have sent our ajax request for page data,
  //   //change pageUrl to the correct section id so that our
  //   //section shows
  //   pageUrl = "page";
  // }

  //hide all sections in main .row except section.mySidebar
  // $("main .row").children().not(".mySidebar").hide();

  // //then show the requested section
  // $('section#'+pageUrl).fadeIn(500);

  //remove .active from all li tags that are inside a ul
  //with the class .nav
 console.log('a 1 [href="'+pageUrl+'"]');
 
}


//go to "page" function
function goTo(href) {
  // Show a "page" in a section with the id corresponding
  // to the link's href value
  console.log("href",href);
  if (href !== "admin.html")
   {

    $("#mainpage").show();
     checkIfLoggedIn(href);
    $(".adminForm").hide();
    }
  else {
    $(".adminForm").show();
    $("#mainpage").hide();
  }
 
  // Add the current "state/page" to our history of visited pages
  history.pushState(null,null,href);
}


//setup push/pop-state pushPopListeners for <a> tags
function pushPopListeners() {
  // When we click a link

  console.log("pushPOP");
  $(document).on("click","a",function(event){

    //if the user clicks a real http:// || https:// link,
    if ($(this).attr("href").indexOf("://") >=0) {
      //assume they are leaving the site
      return;
    }

    //prevent "empty" urls from affecting browsing
    if ($(this).attr("href") && $(this).attr("href") !== "#") {
      goTo($(this).attr("href"));
    }
  

 
    event.preventDefault();
  });


  // Add a pop state listener
  // (listen to forward/backward buttons in the browser)
  addEventListener("popstate",onPopAndStart);

  //and run once immediately (this function runs at DOM ready)
  onPopAndStart();


  // Run this function on popstate and initial load
  function onPopAndStart(){
    //alert("The popstate event is triggered!");

    // Read our url and extract the page name
    // the characters after the last slash
    var l = location.href;
    //might need to change this
    var pageName = l.substring(l.lastIndexOf("/")+1);

    // if no pageName set pageName to false
    pageName = pageName || false;
    console.log("pageName: ", pageName);
    //and showPage
     checkIfLoggedIn(pageName);
  }
}