
function getCurrentPage(href) {
  $.ajax({
    url: "php/get_page.php",
    dataType: "json",
    data: {
      url_alias: href
    },
    success: function(data) {
      showPageContent(data);
      console.log('a[href="'+href+'"]');
        $(".nav li").removeClass("active");
        $('a[href="'+href+'"]').parent().addClass('active');
       },
    error: function(data) {
      console.log("getCurrentPage error: ", data.responseText);
    }
  });
}

function showPageContent(pageData) {
  /*
    pageData =
  */
  console.log("showPageContent success: ", pageData);
  //empty page section just in case
  $("#page").html("");
  //start building page html
  //no need to loop data, will only ever be for one page
  var pageHtml = $('<article class="pageContent"/>');
  // pageHtml.append("<h2>"+pageData["page_data"][0]["title"]+"</h2>");
  //assume body content is filtered HTML
  pageHtml.append(pageData["page_data"][0]["body"]);

  //append author and date information
  pageHtml.append("<em>Created on: "+pageData["page_data"][0]["created"]+", by: "+pageData["author_data"][0]["author"]+"</em>");

  //and insert into section#page
  $("#mainpage").html(pageHtml);

}

function getContactInfo() {
  console.log('Contact info ...');
  $.ajax({
    url: "php/contact.php",
    dataType: "json",
    data: {
      contactInfo: 1
    },
    success: function(data) {
      showContactInfo(data);
      console.log('Contact info is loaded');
       },
    error: function(data) {
      console.log("getContactInfo error: ", data.responseText);
    }
  });
}

$(".navbarSearchForm").submit(function() {
    //get search input field value
    var search_param = $(this).find('input[type="text"]').val();
    //and get pages with matching titles
    getPages(search_param);

    //return false to prevent page reload on form submit
    return false;
  });

//function to getPages.
function getPages(search_param) {
  $.ajax({
    url: "php/get_page.php",
    type: "get",
    dataType: "json",
    data: {
      //if search_param is NULL (undefined), the if-statement 
      //in get_content.php will be false
      "search_param": search_param
    },
    //on success, execute listAllPages function
    //listAllPages has been moved to helpers.js
    success: listAllPages,
    error: function(data) {
      console.log("getPages error: ", data.responseText);
    }
  });
}

//function to list pages in admin content list
function listAllPages(data) {
  console.log("listAllPages success: ", data);
  //remove all table rows in #content-list that does not 
  //have the .pageTableHeads class
  $("#content-list table tr").not(".pageTableHeads").remove();

  //and build new table rows from data
  for (var i = 0; i < data.length; i++) {
    //create new table row
    var newTableRow = $("<tr/>");
    //append important page data to newTableRow
    newTableRow.append('<td><span class="badge">'+data[i].pid+"</span></td>");
    newTableRow.append('<td><strong>'+data[i].title+"</strong></td>");
    newTableRow.append('<td>'+data[i].author+"</td>");
    newTableRow.append('<td>'+data[i].created+"</td>");

    //add page data to each <tr> representing it
    newTableRow.data("page", data[i]);

    //add admin edit & trash buttons to the #content-list
    var adminButtons = $('<td/>');
    adminButtons.append('<div class="btn-group btn-group-xs"/>');
    // adminButtons.find(".btn-group").append('<button type="button" class="btn btn-default editBtn" title="Edit"><span class="glyphicon glyphicon-pencil"></span></button>'); //TBA
    adminButtons.find(".btn-group").append('<button type="button" class="btn btn-default trashBtn" title="Trash"><span class="glyphicon glyphicon-trash"></span></button>');
    newTableRow.append(adminButtons);

    //then append newTableRow to the #content-list table
    $("#content-list table").append(newTableRow);
  }
}


function deletePage(pid) {
  console.log("delete pid: ", pid);
  $.ajax({
    url: "php/get_page.php",
    type: "get",
    dataType: "json",
    data: { "delete_pid": {
        "pid": pid
      }
    },
    //on success
    success: function(data) {
      console.log("deletePage success: ", data);
      goTo("admin.html");
    },
    error: function(data) {
      console.log("deletePage error: ", data.responseText);
    }
  });
}