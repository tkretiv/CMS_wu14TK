<?php

// PDOHelper version 1.2 - 2014 Thomas Frank
class PDOHelper {

  protected function connectToDatabase($host,$dbname,$user,$pass){
    return new PDO(
      "mysql:host=$host;dbname=$dbname",
      $user,
      $pass,
      // detta TVINGAR MySQL att använda UTF-8
      // mycket trevligt och gör att vi inte riskerar problem 
      // med åäö (t.ex. vid konvertering till json)
      array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8")
    );
  }

  protected function fixNumerics($result){
    // PDO har den tråkiga ovanan att returnera nummer som strängar
    // låt oss fixa det, så att nummer blir nummer igen...
    foreach ($result as &$row) {
      foreach ($row as $key => &$val) {
        if (is_numeric($val)) {
          $row[$key] = (float) $val;
        }
      }
    }
    return $result;
  }

  public function query($sql,$parameters = array()){
    $query = $this->PDO->prepare($sql);
    $query->execute($parameters);
    // hämta bara ett resultat om vi gör en select
    if(stripos($sql,'SELECT') === 0){
      $result = $this->fixNumerics($query->fetchAll(PDO::FETCH_ASSOC));
      return $result;
    }
    // annars returnerar vi bara true
    return true;
  }

  public function jsonQuery($sql,$parameters = array()){
    return json_encode($this->query($sql,$parameters));
  }

  // konstruktor
  public function __construct($host,$dbname,$user="root",$pass=""){
    $this->PDO = $this->connectToDatabase($host,$dbname,$user,$pass);
  }
}