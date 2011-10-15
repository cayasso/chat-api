<?php 

header('Content-type: application/json');

$id = $_GET['id'];
$js = $_GET['js'];

if (isset($id) && $id != '') {	
	$status = true;
	$message = "Id $id succesfully released";
} else {
	$status = false;
	$message = 'No id to release';
}

if (isset($js) && $js == 'no-js') {
	$js_message = 'JAVASCRIPT NOT LOADED: This page would need to be served to the user with server side script, each event from the user would need to reload the page';
}

echo json_encode(compact('js_message', 'status', 'message'));

?>
