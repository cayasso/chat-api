<?php 

header('Content-type: application/json');
$id = $_GET['id'];
$usedIds = array('superman', 'batman', 'robin');
$js = $_GET['js'];
$status = false;

if (isset($id) && $id != '') {
	
	if (in_array($id, $usedIds)) {
		$message = "Id $id is in used by another person";
	} else {		
		$message = 'Id succesfully changed to: '.$id;
		$status = true;
	}
} else {
	$message = 'An error occured adding your id or your didn submit any id';
}

if (isset($js) && $js == 'no-js') {
	$js_message = 'JAVASCRIPT NOT LOADED: This page would need to be served to the user with server side script, each event from the user would need to reload the page';
}

echo json_encode(compact('js_message', 'status', 'message'));

?>
