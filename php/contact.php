<?php

include_once("config.php");
include_once("autoloader.php");



if (isset($_REQUEST["contactInfo"])) {
	$cq = New contact(DB_HOST,DB_NAME,DB_USERNAME,DB_PASSWORD);
  echo(json_encode($cq->getContactInfo()));
} 