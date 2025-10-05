<?php
$data = json_decode(file_get_contents('php://input'), true);
file_put_contents('trip_data.json', json_encode($data['data'], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
echo json_encode(['success' => true]);
?>
