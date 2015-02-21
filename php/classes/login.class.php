<?php
class login extends PDOHelper {

  protected $user_info = false; //array("user_id" => 1);

// ************************************

 public function __construct($host,$dbname,$user="root",$pass="") {
    // var_dump($_SESSION);
    // die();
    $this->user_info = isset($_SESSION["loggedUser"]) ?
                       $_SESSION["loggedUser"] :
                       false;

    //call PDOHelpers constructor to preserve functionality
    parent::__construct($host,$dbname,$user,$pass);
  }


public function query($sql, $params =array()) {
    if (!$this->user_info&& stripos($sql, 'SELECT') !==0) {
      return false;
    }
  return parent::query($sql, $params);
}

// **********************************
// ++++++++++++++++++
public function isLoggedIn() {
  return $this->user_info;
}

public function logIn($login_data) {
    $sql="SELECT uid, email FROM users WHERE email=:email && pass=:pass;";
    $result = $this->query($sql,$login_data);
 
    if (count($result)>0) {
      $result = $result[0];
      $_SESSION["loggedUser"] =array("user_id"=>$result['uid'], "email" => $result["email"]);
      // echo("Trying to store this:");
      // var_dump(array("user_id"=>$result['uid']));
      // echo('<br>');
      // var_dump($_SESSION["loggedUser"]);
      // die("Set during login");
      return true;
    }
   else {return false;}
}

 public function logOut() {
    unset($_SESSION["loggedUser"]);
    return true;
  }
}