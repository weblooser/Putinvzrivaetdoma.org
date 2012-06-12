<?php
error_reporting(0);

$target = "putinvzrivaetdoma.org";

$ip = $_SERVER['REMOTE_ADDR'];
$time = time();
$minutes = 5;
$found = 0;
$afound = 0;
$users = 0;
$ausers = 0;
$user  = "";

$a = $_GET["a"];
$callback = $_GET["callback"];

$tmpdata = "../chat/logs";

if (!is_file("$tmpdata/online.txt"))	
	{
	$s = fopen("$tmpdata/online.txt","w");
	fclose($s);
	chmod("$tmpdata/online.txt",0666);
	}

$f = fopen("$tmpdata/online.txt","r+");
flock($f,2);

while (!feof($f))
	{
	$user[] = chop(fgets($f,65536));
	}

fseek($f,0,SEEK_SET);
ftruncate($f,0);

foreach ($user as $line)
	{
	$linearray = explode("|",$line,2);
	$savedip = $linearray[0];
	$savedtime = $linearray[1];
	if ($savedip == $ip) {$savedtime = $time;$found = 1;}
	if ($time < $savedtime + ($minutes * 60)) 
		{
		fputs($f,"$savedip|$savedtime\n");
		$users = $users + 1;
		}
	}

if ($found == 0) 
	{
	fputs($f,"$ip|$time\n");
	$users = $users + 1;
	}
fclose ($f);

/* * */

if (!is_file("$tmpdata/attack.txt")){
	$s = fopen("$tmpdata/attack.txt","w");
	fclose($s);
	chmod("$tmpdata/attack.txt",0666);
}
$f = fopen("$tmpdata/attack.txt","r+");
flock($f,2);
while (!feof($f)){
	$auser[] = chop(fgets($f,65536));
}
fseek($f,0,SEEK_SET);
ftruncate($f,0);
foreach ($auser as $line){
$linearray = explode("|",$line,2);
$savedip = $linearray[0];
$savedtime = $linearray[1];
if ($savedip == $ip) {$savedtime = $time;$afound = 1;}
if ($time < $savedtime + ($minutes * 60))
	{
	fputs($f,"$savedip|$savedtime\n");
	$ausers = $ausers + 1;
	}
}
if ($afound == 0){
	if ( $a == 1){
		fputs($f,"$ip|$time\n");
		$ausers = $ausers + 1;
	}
}
fclose ($f);

if (isset($callback)){
    echo $callback."(".json_encode(array("online"=>$users,"attackers"=>$ausers,"target"=>$target)).");";
} else {
    echo json_encode(array("online"=>$users,"attackers"=>$ausers,"target"=>$target));
}
?>
