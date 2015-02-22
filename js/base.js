
$(function() {

pushPopListeners();

getContactInfo();


$("#admin-form").submit(function() {
    //prepare adminFormData to be sent with AJAX
     console.log("adminFormData  1");
    var adminFormData = {
      ":title" : $(this).find("#page_title").val(),
      ":body" : CKEDITOR.instances.page_body.getData(),
      ":path" : $(this).find("#page_url").val()
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
    this.reset();

    //return false to prevent page reload on form submit
    return false;
  });

 $('.addToMenu input[type="checkbox"]').click(function() {
    

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

  $(".navbarSearchForm").submit(function() {
    //get search input field value
    var search_param = $(this).find('input[type="text"]').val();
    //and get pages with matching titles
    getPages(search_param);

    //return false to prevent page reload on form submit
    return false;
  });

});



function insertNewPage(adminFormData) {
  console.log("insert ",adminFormData);
  $.ajax({
    url: "php/save_content.php",
    type: "post",
    dataType: "json",
    data: {
      "page_data" : adminFormData
    },
    success: function(data) {
      
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
   
    success: function(data) {
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

    fotHtml.append("<u>Vår adress: </u>"+data[0]["Adress"]);

    //append author and date information
      fotHtml.append("<u> Phone: </u>"+data[0]["phone"]);
      fotHtml.append("<br><u>Kontakt person:</u> "+data[0]["fname"]+" "+data[0]["lname"]+" "+data[0]["email"]);

     $(".fotContact").html(fotHtml);


}
