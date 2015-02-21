$(function() {

 $("#loginForm").submit(function() {
  
  var loginData = {
      ":email": $("#username").val(),
      ":pass": $("#password").val()
    };
              
    logIn(loginData);
               
    return false;
  });

 $("#logOutForm").submit(function() {
    
    logOut();

    return false;
  });
});

function logIn(loginData) {
	$.ajax({
    url:"php/login.php",
    type:"post",
    dataType:"json",
    data: {
      "login" : loginData
    },
   //  createAdminMenuSelect,
    success: function(data) {
       //on success, goTo() the contentList url
      // goTo("content-list");
      console.log("Login success ",data);
       if (data) {
          console.log("go to Admin, plzzz");
          goTo("admin.html");
        }
     },
    error: function (data) {
      console.log("Login error  vvv: ", data.responseText);
            }
	});
}


function logOut() {
  $.ajax({
    url: "php/login.php",
    type: "post",
    dataType: "json",
    data: {
      logout: 1
    },
    success: function(data) {
      goTo("home.html");
    },
    error: function(data) {
      console.log("checkIfLoggedIn error: ", data.responseText);
    }
  });
}

function loginResult(data) {
	console.log("go to Admin, plzzz");
  goTo("admin.html");
}

function checkIfLoggedIn(goToUrl) {
  $.ajax({
    url: "php/login.php",
    type: "post",
    dataType: "json",
    //on success, execute logInUser function
    //logInUser has been moved to helpers.js
    success: function(data) {
      console.log("checkIfLoggedIn success: ", data);
      //once results are in, execute showPage() in pushPop.js
      showPage(goToUrl, data);
    },
    error: function(data) {
      console.log("checkIfLoggedIn error: ", data.responseText);
    }
  });
}