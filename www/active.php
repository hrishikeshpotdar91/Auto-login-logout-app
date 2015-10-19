<?php

header('Access-Control-Allow-Origin: *');  
$inp = file_get_contents('active.txt');
print_r($inp);
?>