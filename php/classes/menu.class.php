<?php

//inherits all public PDOHelper methods
class menu extends PDOHelper {

 public function getMenuLinks($menu_name) {
 	//echo "<script>alert('getMenuLinks is found!');</script>";
    $menu_name = array(":menu_name" => $menu_name);
    $sql = "SELECT * FROM menu_links WHERE menu_mn = :menu_name";
    
    return $this->query($sql, $menu_name);
  }
}