<?php
session_start();

error_reporting(E_ERROR | E_WARNING | E_PARSE);

$dbHost = "localhost";
$dbUser = ""; //сюда вбиваем базу, пароль, юзернейм мускула
$dbPass = ""; //если не знаешь что такое, как и зачем
$dbName = ""; //иди убейся об гугл

function mysqlConnect() {
    global $dbHost, $dbUser, $dbPass, $dbName, $conn;
    //Mysql Connection
    $conn = mysql_connect($dbHost, $dbUser, $dbPass) or die('{"status":"db_error"}');
    mysql_select_db($dbName) or die('{"status":"db_error"}');
    mysql_query("SET NAMES 'utf8'");
}

$dbTable = "putin_users";
$action = $_POST[action];
$nickname = $_POST[nick];
$chatcolor = $_POST[chatcolor];
$price_color = 50000;

$pattern = '/^#[A-Fa-f0-9]{6}$/';
if (preg_match($pattern, $chatcolor) == false){
    $chatcolor = false;
}
//звания и очки, рандом от балды. чувствуешься себя большим педросяном? меняй детка, меняй.
$level[0] = 0;
$level[1] = 150;
$level[2] = 400;
$level[3] = 1200;//4h
$level[4] = 3000;
$level[5] = 6000;
$level[6] = 15000;//32h
$level[7] = 30000;
$level[8] = 50000;
$level[9] = 100000;//11d
$level[10] = 200000;//23d
$level[11] = 400000;
$level[12] = 700000;
$level[13] = 1500000;
$level[14] = 3000000;
$level[15] = 6666666;//2y
$level[16] = 10000000;//2y

$titles[0] = "Чмо";
$titles[1] = "Влетевший";
$titles[2] = "Щемящийся";
$titles[3] = "Будущий школьник";
$titles[4] = "Голодранец";
$titles[5] = "Пешка";
$titles[6] = "Младший школьник";
$titles[7] = "Школьник";
$titles[8] = "Школьник-терпила";
$titles[9] = "Терпила";
$titles[10] = "Сослик";
$titles[11] = "Услик";
$titles[12] = "Контр-паукан";
$titles[13] = "Вице-нуб";
$titles[14] = "Колчак";
$titles[15] = "Петросян флота";
$titles[16] = "Альфазадрот";


//if ($_GET['admin'] == 'restore'){
//    header('Content-type: text/html');
//    $conn = mysql_connect($dbHost, $dbUser, $dbPass) or die('{"status":"db_error"}');
//    mysql_select_db($dbName) or die('{"status":"db_error"}');
//    mysql_query("SET NAMES 'utf8'");
//    $query = "SELECT * FROM $dbTable" or die('{"status":"query_error"}');
//    $result = mysql_query($query) or die('{"status":"query_error"}');
//
//    while($row = mysql_fetch_array($result)){
//        echo $row['level']." ".$row['title'];
//        $nickhash = $row['nickname'];
//        if ($row['level']>16){
//            $newlevel = 16;
//        }
//        for ($i = 16; $i>0; $i--){
//            if ($row['score'] < $level[$i]){
//                $newlevel = $i-1;
//            }
//        }
//        $title = $titles[$newlevel];
//
//        $query2 = "UPDATE $dbTable SET level = '$newlevel' WHERE nickname = '$nickhash'";
//        $result2 = mysql_query($query2) or die('{"status":"query_update_error"}');
//
//        echo $newlevel." ".$title."\n";
//    }
//    mysql_close($conn);
//}


 if ($action == 'register' && $nickname)
{
	$nickhash = md5( $nickname );
	$reg_date = date('Y-m-d');

        mysqlConnect();

	// Performing SQL query
	$query = "SELECT nickname FROM $dbTable WHERE nickname='$nickhash'";
	$result = mysql_query($query);
	$row = mysql_fetch_array($result);
	if ($row){
		echo json_encode(array("status"=>"user_error"));
	} else {
		$query = "INSERT INTO $dbTable (nickname, reg_date, score, title, color, status, level) VALUES ('$nickhash', '$reg_date', 0, 'Никто', '', 'new', 0)";
		$result = mysql_query($query) or die('{"status":"query_error"}');
		
		$query = "SELECT nickname FROM $dbTable WHERE nickname='$nickhash'";
		$result = mysql_query($query) or die('{"status":"db_error"}');
		while($row = mysql_fetch_array($result))
		{
			echo json_encode(array("status"=>"reg_success"));
		}
                $query = "INSERT INTO achivements (nickname) VALUES ('$nickhash')";
                $result = mysql_query($query) or die('{"status":"query_update_error"}');
	}
	mysql_close($conn);
} else if ( $action == 'login' && $nickname )
{
	$nickhash = md5( $nickname );
        mysqlConnect();
	$query = "SELECT nickname FROM $dbTable WHERE nickname='$nickhash'" or die('{"status":"query_error"}');
	$result = mysql_query($query);
	$row = mysql_fetch_array($result);
	if (!$row){
		echo json_encode(array("status"=>"user_error"));
	} else
	{
            $query = "SELECT * FROM $dbTable WHERE nickname='$nickhash'";
            $result = mysql_query($query) or die('{"status":"query_error"}');
            while($row = mysql_fetch_array($result))
            {
                    $_SESSION['score'] = $row['score'];
                    $_SESSION['title'] = $row['title'];
                    $_SESSION['level'] = $row['level'];
                    $_SESSION['chatcolor'] = $row['color'];
                    $_SESSION['login'] = 1;
            }
            $query = "SELECT * FROM achivements WHERE nickname='$nickhash'";
            $result = mysql_query($query) or die('{"status":"query_error"}');
            while($row = mysql_fetch_array($result))
            {
                $i=0;
                foreach ($row as $key => $value){
                    //оставляем только названия столбцов, где есть ачивки
                    if ($value == 1 && !preg_match('/[0-9]/', $key)){
                        $ach[$i] = $key;
                        $i++;
                    }
                }
            }
            $_SESSION['achivements'] = $ach;
            $_SESSION['nickhash'] = $nickhash;
            echo json_encode(array("nickhash"=>$_SESSION['nickhash'], "score"=>$_SESSION['score'], "title"=>$_SESSION['title'], "chatcolor"=>$_SESSION['chatcolor'],"ach"=>$_SESSION['achivements']));
	}
	mysql_close($conn);
} else if ( $action == 'logout' && $_SESSION['login'] == 1){
        $nickhash = $_SESSION['nickhash'];
//        if ( isset($_SESSION['score']) ){
            if ($_SESSION['time_start']){
                $score_gained = (int)( time() - $_SESSION['time_start'] );
                $_SESSION['score'] += $score_gained;
            }
            $score = $_SESSION['score'];
            $title = $_SESSION['title'];

    mysqlConnect();

            $query = "UPDATE $dbTable SET score = '$score', title = '$title' WHERE nickname = '$nickhash'";
            $result = mysql_query($query) or die('{"status":"query_update_error"}');
//        }
	$_SESSION['score'] = false;
	$_SESSION['title'] = "Путин";
	$_SESSION['login'] = false;
	$_SESSION['nickname'] = false;
	$_SESSION['nickhash'] = false;
	$_SESSION['time_start'] = false;
        $_SESSION['userenter'] = false;
        $_SESSION['level'] = 0;
        $_SESSION['chatcolor'] = "";
	mysql_close($conn);
} else if ( $action == 'start_score' && $_SESSION['login'] == 1){
	$_SESSION['time_start'] = time();
} else if ( $action == 'update_score' && $_SESSION['time_start'] && $_SESSION['login'] == 1){
	$nickhash = $_SESSION['nickhash'];

        mysqlConnect();

        $query = "SELECT score FROM $dbTable WHERE nickname='$nickhash'";
        $result = mysql_query($query) or die('{"status":"query_error"}');
        while($row = mysql_fetch_array($result)){
            $score_current = $row['score'];
        }
        //сколько очков набежало за это время
        if ($_SESSION['time_start']){
            $score_gained = (int)(time() - $_SESSION['time_start']);
            //начинаем считать заново
            $_SESSION['time_start'] = time();
            $_SESSION['score'] = $score_current + $score_gained;
        }
	$score = $_SESSION['score'];
	//левел-ап
        if ($score > $level[$_SESSION['level']+1] && $_SESSION['level'] < 16){
            $_SESSION['level']++;
        }
//        for ($i = 0; $i<=16; $i++){
//            if ($score > $level[$i]){
//                $_SESSION['level'] = $i;
//            }
//        }
	$title = $_SESSION['title'] = $titles[$_SESSION['level']];
        $pogon = $_SESSION['level'];

	$query = "UPDATE $dbTable SET score = '$score', title = '$title', level = '$pogon' WHERE nickname = '$nickhash'";
	$result = mysql_query($query) or die('{"status":"query_update_error"}');
        mysql_close($conn);
	echo json_encode(array("title"=>$_SESSION['title']));
} else if ($action == 'update_color' && $chatcolor && $_SESSION['login'] == 1){
	$nickhash = $_SESSION['nickhash'];
	//сколько очков набежало за время с последнего update_score
        if ($_SESSION['time_start']){
            $score_gained = ( time() - $_SESSION['time_start'] );
            $_SESSION['time_start'] = time();
            $_SESSION['score'] += $score_gained;
        }
        if ($_SESSION['score'] >= $price_color){
            $_SESSION['chatcolor'] = $chatcolor;
            $_SESSION['score'] -= $price_color;
            $score = $_SESSION['score'];

            mysqlConnect();

            $query = "UPDATE $dbTable SET score = '$score', color = '$chatcolor' WHERE nickname = '$nickhash'";
            $result = mysql_query($query) or die('{"status":"query_update_error"}');
            mysql_close($conn);
            echo json_encode(array("status"=>200,"score"=>$_SESSION['score'], "chatcolor"=>$_SESSION['chatcolor']));
        } else {
            echo json_encode(array("status"=>"no_ions"));
        }
} else {
        if ($action == "userenter"){
            $_SESSION['userenter'] = 1;
        }
        //случайный домен для нашего Ифрейма = чистим рефак
        $loicsrc = array("a.xn--48jwgybuise.jp","qua.now.im","zoo.orts.ru","oro.ro.lt","zip.uk.to","pidor.suka.se","loool.nprog.ru","answer.ask2ask.com","eleven.homenet.org","source.logout.us");
        $srchost = $loicsrc[rand(0, count($loicsrc))];
        //проверка происходит при загрузке страницы. Если вошел, то вернется 1
	//сброс таймера если update_score не было давно
        if ( (int)(time() - $_SESSION['time_start']) > 100 ){
            $_SESSION['time_start'] = false;
        }
        if ($_SESSION['login']!=1){
            $_SESSION['title'] = "Путин";
            $_SESSION['level'] = "0";
            $_SESSION['chatcolor'] = "#aebcc7";
            $_SESSION['nickhash'] = "Путин";
            $_SESSION['achivements'] = 0;
        }
        echo json_encode(array("login"=>$_SESSION['login'], "title"=>$_SESSION['title'], "score"=>$_SESSION['score'], "chatcolor"=>$_SESSION['chatcolor'], "session_name"=>session_name(), "session_id"=>session_id(), "ach"=>$_SESSION['achivements'], "srchost"=>$srchost));
}
?>
