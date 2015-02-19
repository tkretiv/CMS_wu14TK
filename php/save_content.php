<?php

include_once("autoloader.php");
include_once("config.php");
// echo '<script>console.log("save_content 1")</script>';
 
$cq = New page(DB_HOST,DB_NAME,DB_USERNAME,DB_PASSWORD);

//save content if told to do so (by receiving correct AJAX data)
if (isset($_REQUEST["page_data"])) {
  //save page and echo ContentQueries response
	//echo "<script>alert('page_data is found!');</script>";

  echo(json_encode($cq->saveNewPage($_REQUEST["page_data"])));
}
else
{echo "<script>alert('page_data is NOT found!');</script>";
}