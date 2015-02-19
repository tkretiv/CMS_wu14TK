<?php

include_once("config.php");
include_once("autoloader.php");

$cq = New login(DB_HOST,DB_NAME,DB_USERNAME,DB_PASSWORD);

if (isset($_REQUEST["login"])) {
  echo(json_encode($cq->logIn($_REQUEST["login"])));
} elseif(isset($_REQUEST["logout"])) {
  echo(json_encode($cq->logOut()));
} else {
  //assume check if logged in
  echo(json_encode($cq->isLoggedIn()));
}