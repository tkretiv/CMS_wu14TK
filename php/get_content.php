<?php

include_once("config.php");
include_once("autoloader.php");



if (isset($_REQUEST["menu_name"])) {
	$cq = New menu(DB_HOST,DB_NAME,DB_USERNAME,DB_PASSWORD);
  echo(json_encode($cq->getMenuLinks($_REQUEST["menu_name"])));
} 
