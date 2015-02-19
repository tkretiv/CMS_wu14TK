
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
  $.ajax({
    url: "php/contact.php",
    dataType: "json",
    type: "get",
    success: function(data) {
      showContactInfo(data);
      console.log('Contact info is loaded');
       },
    error: function(data) {
      console.log("getContactInfo error: ", data.responseText);
    }
  });
}