<?php 

header('Content-type: application/json');

$userMessage = $_GET['message'];
$id = $_GET['id'];
$js = $_GET['js'];
$status = false;

if (isset($userMessage) && $userMessage != '' && $id) {	
	$status = true;
	$message = 'Message succesfully set';	
	$datetime = new DateTime();	
	$time = $datetime->format('Y/m/d H:i:s');
	$user_message = $userMessage;
} else {
	$message = 'An error occured sending your message, was found or no message to send';
}

if (isset($js) && $js == 'no-js') {
	$js_message = 'JAVASCRIPT NOT LOADED: This page would need to be served to the user with server side script, each event from the user would need to reload the page';
}

echo json_encode(compact('js_message', 'status', 'message', 'time', 'user_message'));

?>
