<?php

include_once("config.php");
include_once("autoloader.php");

$cq = New page(DB_HOST,DB_NAME,DB_USERNAME,DB_PASSWORD);

if (isset($_REQUEST["url_alias"])) {
	
  echo(json_encode($cq->getPageFromUrl($_REQUEST["url_alias"])));
} 
else if (isset($_REQUEST["search_param"])) {
	
  echo(json_encode($cq->searchForPages($_REQUEST["search_param"])));
} 
else if (isset($_REQUEST["delete_pid"])) {
  //delete content with a specific pid
  echo(json_encode($cq->deletePage($_REQUEST["delete_pid"])));
} else {
	
  echo(json_encode($cq->getAllPages()));
}