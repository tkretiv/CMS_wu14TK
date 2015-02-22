<?php

session_start();

function __autoload($class_name) {

  include "classes/".strtolower($class_name).'.class.php';
}