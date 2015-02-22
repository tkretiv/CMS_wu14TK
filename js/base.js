
$(function() {

// checkIfLoggedIn("hom e.html");

pushPopListeners();

getContactInfo();


$("#admin-form").submit(function() {
    //prepare adminFormData to be sent with AJAX
     console.log("adminFormData  1");
    var adminFormData = {
      ":title" : $(this).find("#page_title").val(),
      ":body" : CKEDITOR.instances.page_body.getData(),
      ":path" : $(this).find("#page_url").val()
      //":user_id" : 1 //this has been moved to PHP
    };
    //if the user has asked to add page to menu
     if ($('.addToMenu input[type="checkbox"]').is(":checked")) {
      //get selected menu parent data
      adminFormData.menuData = {};
      adminFormData.menuData["parent"] = $('.addToMenu select').find(":selected").data("menuItem");
      //get menu link title
      adminFormData.menuData["title"] = $('.addToMenu #menu_title').val();
      //get menu link order
      adminFormData.menuData["weight"] = $('.addToMenu #menu_weight').val();
    }
    console.log("adminFormData  ", adminFormData);

    //send adminFormData with AJAX to DB
    insertNewPage(adminFormData);

    //empty the form once we're done with the information in it
    this.reset(); //.reset() is a JS function, NOT a jQuery function... :D

    //return false to prevent page reload on form submit
    return false;
  });

 $('.addToMenu input[type="checkbox"]').click(function() {
    // if ($(this).is(":checked")) {

    //   $("#admin-form .menuLinkFields").show();
    // } else {
    //   $("#admin-form .menuLinkFields").hide();
    // }

    console.log("click checkBox");
    getMenuLinks("Basemenu", createAdminMenuSelect);
    //whenever the user clicks add to menu, 
    //make the menu title field required
    $(".addToMenu #menu_title").attr("required", $(this).is(":checked"));
  });

 $("body").on("click", "#content-list table .trashBtn", function() {
    //trash btn clickhandler
    var pageData = $(this).parents("tr").data("page");
    console.log("pageData: ", pageData);
    
    if(confirm('Are you sure you want to permanently delete the page: "'+pageData.title+'" and all of its data?')) {
      deletePage(pageData.pid);
    }
  });

});



function insertNewPage(adminFormData) {
  console.log("insert ",adminFormData);
  $.ajax({
    url: "php/save_content.php",
    type: "post",
    dataType: "json",
    data: {
      //this request must have data to get through the 
      //if-statement in save_content.php
      "page_data" : adminFormData
    },
    success: function(data) {
      //on success, goTo() the contentList url
     // goTo("content-list");
     console.log("insertNewPage success ");
     goTo(adminFormData[":path"]);
    },
    error: function(data) {
      console.log("insertNewPage error: ", data);
    }
  });
}

function getMenuLinks(menu_name, successFunction) {
  
  $.ajax({
    url: "php/get_content.php",
    type: "get",
    dataType: "json",
    data: {
      "menu_name" : "Basemenu"
    },
   //  createAdminMenuSelect,
    success: function(data) {
       //on success, goTo() the contentList url
      // goTo("content-list");
      console.log("MenuLinks success ");
      successFunction(data);
     },
    error: function (data) {
      console.log("getMenuLinks error: ", data.responseText);
            }

  });
}

function showContactInfo(data) {
  
  $(".fotContact").html("");

  var fotHtml = $('<div class="container text-muted"></div>');

  // console.log("CONTACT", data);
    // fotHtml.append('<p class="text-muted"> ');
    fotHtml.append("<u>Vår adress: </u>"+data[0]["Adress"]);

    //append author and date information
      fotHtml.append("<u> Phone: </u>"+data[0]["phone"]);
      fotHtml.append("<br><u>Kontakt person:</u> "+data[0]["fname"]+" "+data[0]["lname"]+" "+data[0]["email"]);

   // fotHtml.append('</p> ');
  $(".fotContact").html(fotHtml);


}
