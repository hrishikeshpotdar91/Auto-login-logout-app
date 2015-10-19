<?php

header('Access-Control-Allow-Origin: *');  


$inp = file_get_contents('http://omega.uta.edu/~sxm6532/active.php');

$url = 'https://json-csv.com/api/getcsv';
    $email = 'hrishikesh.potdar91@gmail.com';
    $json = $inp;

    $postdata = http_build_query(
      array(
        'email' => $email,
        'json' => $json
      )
    );

    $opts = array(
      'http' => array(
        'method'  => 'POST',
        'header'  => 'Content-type: application/x-www-form-urlencoded',
        'content' => $postdata
      )
    );
    $context  = stream_context_create($opts);
    $result = file_get_contents($url, false, $context);


    print $result;

$today = date("Y-m-d");   

$csvfile = "Report-".$today.".csv";

fopen($csvfile,'w');
file_put_contents($csvfile, $result);

?>