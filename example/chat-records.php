<?php 
header('Content-type: application/json');
$js = $_GET['js'];

if (isset($js) && $js == 'no-js') {
	$js_message = 'JAVASCRIPT NOT LOADED: This page would need to be served to the user with server side script, each event from the user would need to reload the page';
}

$datetime = new DateTime();	
$time = $datetime->format('Y/m/d H:i:s');
$data = "$time<br /><strong>Me: </strong>This is one message I sent<br /><hr />$time<br />	<strong>Superman: </strong>This is another message I sent a while ago<br /><hr />$time<br /><strong>Batman: </strong>Hello world this is the last message I sent.<br /><hr />------ YOUR CHAT HISTORY END HERE -------<br />";
$status = true;
$message = 'Chat records loaded';

echo json_encode(compact( 'js_message','status','message','data'));

?>
