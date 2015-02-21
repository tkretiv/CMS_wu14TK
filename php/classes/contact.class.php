<?php

//inherits all public PDOHelper methods
class contact extends PDOHelper {

 public function getContactInfo() {
 	//echo "<script>alert('getMenuLinks is found!');</script>";
     $sql = "SELECT * FROM contact_info, users where users.uid=contact_info.userid ORDER BY date_create DESC limit 1";
    
    return $this->query($sql);
  }
}