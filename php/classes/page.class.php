<?php


//inherits all public PDOHelper methods
class page extends PDOHelper {
  //later when we have login in place, real user_info 
  //will be stored in the property user_info.
  //for now let's just fake it
  protected $user_info = false; //array("user_id" => 1);

// ************************************
public function __construct($host,$dbname,$user,$pass) {
  $this->user_info = isset($_SESSION["loggedUser"]) ?
                    $_SESSION["loggedUser"] :
                    false;

          // var_dump($_SESSION["loggedUser"]);
          // die("hej");
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


  public function getPageFromUrl($url_alias) {
    /* note: 
      it would be much better to do all these queries in a join
      or as a view in the DB, might change to that later :)
    */

    //create an array of data from pages, users, images, 
    //and videos tables for a single page
    $return_arr = array();

    //url_alias lookup query 
    //(get page id, only latest entry if more that one)
    $sql = "SELECT pageid from menu_links WHERE path = :path ORDER BY mid DESC limit 1";
    $url_data = array(":path" => strtolower($url_alias));
    $url_result = $this->query($sql, $url_data);

    //page sql query  
    //(get * columns)
    $sql2 = "SELECT * FROM pages WHERE pageid = :pageid";
    $page_data = array(":pageid" => $url_result[0]["pageid"]);
    $page_data = $this->query($sql2, $page_data);

    //store page data in return arr
    $return_arr["page_data"] = $page_data;

    //author sql query 
    //(get full name of author)
    $sql3 = "SELECT CONCAT(fname, ' ', lname) as author FROM users WHERE uid = :user_id";
    $user_data = array(":user_id" => $return_arr["page_data"][0]["user_id"]);
    $author = $this->query($sql3, $user_data);

    //store user data in return arr
    $return_arr["author_data"] = $author;

    //still need to add SQL for images && videos, 
    //we'll do that later when we have a view in the DB

    //and return all collected data for a single page
    return $return_arr;
  }


  public function saveNewPage($page_data) {

    //adding user_id before insert
    if (isset($this->user_info["user_id"])) {
      $page_data[":user_id"] = $this->user_info["user_id"];
    }
    else {
      $page_data[":user_id"] =$_SESSION["loggedUser"];
    }

    //extract and remove page path to prevent crash on insert page
    $page_path = $page_data[":path"];
    unset($page_data[":path"]);
    //extract and remove page menu data to prevent crash on insert page
    $menu_data = $page_data["menuData"];
    unset($page_data["menuData"]);

    $sql = "INSERT INTO pages (title, body, user_id) VALUES (:title, :body, :user_id)";
    //since we are using prepared SQL statements, 
    //SQL and data are sent separately to the query method

    //first insert into the pages table
    $this->query($sql, $page_data);

    //then find pid of new page by selecting the latest page 
    //in the pages table
    $sql2 = "SELECT pageid FROM pages ORDER BY created DESC LIMIT 1";
    $new_pid = $this->query($sql2);
    //extract pid from the array we get back
    $new_pid = $new_pid[0]["pageid"];
   
    //if we are adding the page to a menu, do so

    if (isset($menu_data)) {

      $sql4 = "INSERT INTO menu_links (title, path, menu_mn, pid, ord, pageid) VALUES (:title, :path, :menu_name, :pid, :weight, :pageid)";
      $menu_data = array(
        "title" => $menu_data["title"],
        "path" => strtolower($page_path),
        "menu_name" => $menu_data["parent"]["menu"] ? $menu_data["parent"]["menu"] : $menu_data["parent"]["menu_mn"],
        "pid" => $menu_data["parent"]["mid"] ? $menu_data["parent"]["mid"] : null,
        "weight" => $menu_data["weight"],
        "pageid" => $new_pid
      );
      $this->query($sql4, $menu_data);
    }

    return true;
  }


  public function getAllPages() {
    $sql = "SELECT p.pageid pid, p.title, p.body, p.created, CONCAT(u.fname, ' ', u.lname) as author FROM pages p, users u where p.user_id=u.uid";
    return $this->query($sql);
  }


  public function searchForPages($search_param) {
    $search_param = array(":search_param" => "%".$search_param."%");
    $sql = "SELECT p.pageid pid, p.title, p.body, p.created, CONCAT(u.fname, ' ', u.lname) as author FROM pages p, users u WHERE p.title LIKE :search_param and p.user_id=u.uid";
    return $this->query($sql, $search_param);
  }


  /**
   * Menus
   */

  public function getMenuNames() {
    $sql = "SELECT * FROM menus";
    return $this->query($sql);
  }


  public function getMenuLinks($menu_name) {
    $menu_name = array(":menu_name" => $menu_name);
    $sql = "SELECT * FROM menu_links WHERE menu = :menu_name";
    
    return $this->query($sql, $menu_name);
  }
}