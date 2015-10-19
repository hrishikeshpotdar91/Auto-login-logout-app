
<?php

header('Access-Control-Allow-Origin: *');  
// Get remote file contents, preferring faster cURL if available
$file = 'users.txt';
$email = $_POST['email'];
$contents = file_get_contents($file);
print_r($contents);

?>


