


function showPage(pageUrl, loggedIn) {
  //if no pageUrl was recieved (or home was recieved),
  //show the "front page"
  if (!pageUrl || pageUrl == "home") {
    pageUrl = "home.html";
  }

  $(".logForm").hide();
  if (loggedIn) {
    $("#logOutForm").show();
    $("#sp_username").text("Logged in as "+ loggedIn["email"]);
  } else {
    $("#loginForm").show();
  }

  console.log("showPage: ", pageUrl, loggedIn);

  getMenuLinks("Basemenu", createMainMenu);

  $(".navbarSearchForm").hide();
  $("#mainpage").hide();
  $(".adminForm").hide();

  if (pageUrl !== "admin.html" || !loggedIn)
   {
    $("#mainpage").show();
    getCurrentPage(pageUrl);
    $(".adminForm").hide();
    }
  else {
    $("#mainpage").hide();
    $(".adminForm").show();
    getPages();
    $(".navbarSearchForm").show();
    
    CKEDITOR.replace( 'page_body', {
                      language: 'sv',
                      uiColor: '#4cae4c'
                      });
    
  }

}


function goTo(href) {
  console.log("href",href);
  checkIfLoggedIn(href);

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
    // and CKEditor service commands
    if ($(this).attr("href") && $(this).attr("href") !== "#" && $(this).attr("href").indexOf(":void") <0) {
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