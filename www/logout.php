<?php

header('Access-Control-Allow-Origin: *');  
// Get remote file contents, preferring faster cURL if available

$name = $_POST['name'];
$email = $_POST['email'];
$logouttime = $_POST['logouttime'];
$active = $_POST['active'];

$inp = file_get_contents('active.txt');
$tempArray = json_decode($inp, true);
array_push($tempArray['active'], array('name' => $name, 'email' => $email, 'logouttime' => $logouttime, 'active' => $active));

$jsonData = json_encode($tempArray);
file_put_contents('active.txt', $jsonData);
#$employeepush = json_encode($arr);

print_r($jsonData);


?>