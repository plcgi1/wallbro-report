<?php
//phpinfo();
require_once('lib/config.php');

$possible_url = array("categories", "companies","save","get_report", "change_company", "upload", "get_report_files", "remove_report_file");

$value = array("status" => "error","message" => "No such method" );
$DBH = null;
try {
    # MySQL with PDO_MYSQL
    $DBH = new PDO("mysql:host=".$CONFIG['DB_HOST'].";dbname=".$CONFIG['DB_NAME'], $CONFIG['DB_USER'] );
    $DBH->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $DBH->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
}
catch(PDOException $e) {
    $res = array( "status" => "error", "message" => $e->getMessage());
    echo json_encode($res);
    exit();
}

if (isset($_GET["action"]) && in_array($_GET["action"], $possible_url)) {
    switch ($_GET["action"]) {
        case "categories":
            $value = categories($DBH);
            break;
        case "companies":
            $value = companies($DBH);
            break;
        case "get_report":
            $value = get_report($DBH);
            break;
        case "change_company":
            $value = change_company($DBH);
            break;
        case "save":
            $value = save($DBH);
            break;
        case "upload":
            $value = upload($DBH);
            break;
        case "get_report_files":
            $value = get_report_files($DBH);
            break;
        case "remove_report_file":
            $value = remove_report_file($DBH);
            break;
    }
}
header("Content-Type: application/json");
echo json_encode($value);

exit();

$DBH = null;

function companies($dbh){
    $sth = $dbh->query('SELECT * FROM company');
    
    $res = array();
    # showing the results
    while($row = $sth->fetch(PDO::FETCH_ASSOC)) {        
        array_push($res,$row);
    }
    return $res;
}

function categories($dbh){
    $sth = $dbh->query('SELECT * FROM category');
    
    $res = array();
    # showing the results
    while($row = $sth->fetch(PDO::FETCH_ASSOC)) {        
        array_push($res,$row);
    }
    return $res;
}

function change_company($dbh){
    $raw = file_get_contents('php://input');
    $param = json_decode($raw);
    $report_id = $param->report_id;
    $company_id = $param->company_id;
    $res = array();
    if( isset($report_id) && isset($company_id)){
        $stmt = $dbh->prepare("UPDATE reports SET company_id=?,updated=unix_timestamp() WHERE id=?");
        $stmt->execute(array($company_id,$report_id));
        $res = array( 'status' => "ok", 'message' => 'company updated', 'company_id' => $company_id, 'report_id' => $report_id );
    }
    return $res;
}

function get_report($dbh) {
    $id = $_GET['id'];
    $sth = $dbh->prepare(
        'SELECT me.*,r.company_id,cat.name AS category_title
        FROM report me
        join reports r ON me.report_id=r.id
        JOIN category cat ON me.category_id=cat.id WHERE r.id=:id GROUP BY me.id'
    );
    $sth->execute(array(':id'=>$id));
    
    $rows = array();
    while($row = $sth->fetch()){
        array_push($rows,$row);
    }
    
    return array('rows' => $rows, 'report_id' => $row[0]['report_id'], 'company_id' => $row[0]['company_id'] );
}

function save($dbh){
    $raw = file_get_contents('php://input');
    $param = json_decode($raw);
    
    $id = NULL;
    $report_id = $param->report_id;
    $report = NULL;
    $parent_report = NULL;
        
    // �������� ������� ������ � report
    if( isset($param->id) ){
        // ������ ���
        $sth = $dbh->prepare('SELECT * FROM report WHERE id=?');
        $sth->execute(array($param->id));
        $report = $sth->fetch();
        // ������ ��� - ���������� status : error, message: 'No such report'
        if( !isset($report) ) {
            return array( 'status' => 'error', 'message' => 'No such item in report' );
        }
        $id = $param->id;
        $report_id = $report['id'];
    }
    if( isset($report_id) ) {
        // ������ ���
        $sth = $dbh->prepare('SELECT * FROM reports WHERE id=?');
        $sth->execute(array($param->id));
        $report = $sth->fetch();
        // ������ ��� - ���������� status : error, message: 'No such report'
        if( !isset($report) ) {
            return array( 'status' => 'error', 'message' => 'No such report in reports' );
        }
    }
    
    if( isset($id) ) {
        $stmt = $dbh->prepare("UPDATE reports SET updated=unix_timestamp(),company_id=? WHERE id=?");
        $stmt->execute(array($param->company_id,$report_id));
         
        $stmt = $dbh->prepare("UPDATE report SET employee=?,currency=?,value=?,rate=?,category_id=?,updated=unix_timestamp() WHERE id=?");
        $stmt->execute(array($param->employee, $param->currency,$param->value,$param->rate,$param->category_id,$id));
        $res = array( 'status' => "ok", 'message' => 'updated', 'id' => $id, 'report_id' => $report_id );
    }
    else {
        if( !isset($report) ) {
            $stmt = $dbh->prepare(
                "INSERT INTO reports(company_id,created,updated) VALUES(:company_id,unix_timestamp(),unix_timestamp())"
            );
            $stmt->execute(array(':company_id' => $param->company_id));
            $report_id = $dbh->lastInsertId();
        }
        $stmt = $dbh->prepare(
            "INSERT INTO report(employee,currency,value,rate,category_id,report_id,created,updated) VALUES(:employee,:currency,:value,:rate,:category_id,:report_id,unix_timestamp(),unix_timestamp())"
        );
        $stmt->execute(
            array(
                ':employee' => $param->employee,
                ':currency' => $param->currency,
                ':value'    => $param->value,
                ':rate'     => $param->rate,
                ':category_id' => $param->category_id,
                ':report_id'   => $report_id
            )
        );
        $id = $dbh->lastInsertId();
        // ���������� ����� �� ��������� ����� ��� �������� ������ - � ����� CONFIG[UPLOAD_PATH]/id
    }
    $res = array( 'status' => "ok", 'id' => $id, 'report_id' => $report_id );
    return $res;
}

function upload($dbh){
    $report_id = $_GET['report_id'];
    $res = array();
    if ( !empty( $_FILES ) ) {
        $path = dirname( __FILE__ ).'/files/'.$report_id;
        if( !file_exists( $path )) {
            mkdir($path);
        }
        $file = $path . '/' . $_FILES[ 'file' ][ 'name' ];
        
        $temp_path = $_FILES[ 'file' ][ 'tmp_name' ];
        move_uploaded_file( $temp_path, $file );
        $res['answer'] = 'ok';
    
        // ������� ������ � �� � ����� � �����
        $stmt = $dbh->prepare(
            "INSERT INTO report_files(report_id,name,type,size,created) VALUES(:report_id,:name,:type,:size,unix_timestamp())"
        );
        $stmt->execute(
            array(
                ':report_id'    => $report_id,
                ':name'         => $file,
                ':type'         => $_FILES[ 'file' ][ 'type' ],
                ':size'         => $_FILES[ 'file' ][ 'size' ]
            )
        );
        $res['id'] = $dbh->lastInsertId();
    }
    return $res;
}

function get_report_files($dbh){
    $report_id = $_GET['report_id'];
    $sth = $dbh->prepare('SELECT * FROM report_files WHERE report_id=?');
    $sth->execute(array($report_id));
    $files = array();
    while($row = $sth->fetch(PDO::FETCH_ASSOC)) {        
        array_push($files,$row);
    }
    // ������ ��� - ���������� status : error, message: 'No such report'
    if( !isset($files) ) {
        return array( 'status' => 'error', 'message' => 'No such item in report' );
    }
    return array( 'status' => 'ok', 'files' => $files);
}

function remove_report_file($dbh){
    $id = $_GET['id'];
    
    $stmt = $dbh->prepare('SELECT * FROM report_files WHERE id=?');
    $stmt->execute(array($id));
    $file = $stmt->fetch(PDO::FETCH_ASSOC);
    unlink($file['name']);
    
    $stmt = $dbh->prepare('DELETE FROM report_files WHERE id=:id');
    $stmt->bindValue(':id', $id, PDO::PARAM_STR);
    $stmt->execute();
    
    return array( 'status' => 'ok' );
}
?>