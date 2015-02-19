<?php

session_start();

function __autoload($class_name) {
	//echo "<script>alert('autoloader !');</script>";
  include "classes/".strtolower($class_name).'.class.php';
}