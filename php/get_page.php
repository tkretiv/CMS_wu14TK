<?php

include_once("config.php");
include_once("autoloader.php");

if (isset($_REQUEST["url_alias"])) {
	$cq = New page(DB_HOST,DB_NAME,DB_USERNAME,DB_PASSWORD);
  echo(json_encode($cq->getPageFromUrl($_REQUEST["url_alias"])));
} 
else if (isset($_REQUEST["search_param"])) {
	$cq = New page(DB_HOST,DB_NAME,DB_USERNAME,DB_PASSWORD);
  echo(json_encode($cq->searchForPages($_REQUEST["search_param"])));
} 
else {
	$cq = New page(DB_HOST,DB_NAME,DB_USERNAME,DB_PASSWORD);
  echo(json_encode($cq->getAllPages()));
}