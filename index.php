<?php

$data = array(
	234 => 	array(
		"name" => "Dummy",
		"age" => 12
	),
	789 => array(
		"name" => "Johny",
		"age" => 12
	),
	111 => array(
		"name" => "Multi",
		"age" => 12
	)
);?>
<!DOCTYPE html>
<html>
<head>
	<title></title>
</head>
<body>

<script src="jquery.min.js"></script>
<script src="script.js"></script>

<script>
var data = <?php echo json_encode($data, JSON_FORCE_OBJECT);?>;

var obj = new ArrayObject(data);

var item = obj.getAllIds();

console.log(item);

obj.addItem(666, { 
	name: "Novy",
	age: 99
	});

var item = obj.getAllIds();

console.log(item);
obj.refreshOrder();

var item = obj.getAllIds();

console.log(item);

obj.orderAsc();

obj.orderByKey("name");
var item = obj.getAllIds();
console.log(item);

obj.orderByKey("age");
var item = obj.getAllIds();
console.log(item);

obj.orderBy = "name";
obj.orderWay = "desc";

obj.refreshOrder();
var item = obj.getAllIds();
console.log(item);

obj.createLoop();

while(obj.isLooped()) {
	var item = obj.getLoopedItem();
	console.log(item, obj.ids, obj.loop);
}

obj.resetLoop();

obj.orderByKey("age", "asc");

obj.createLoop();

while(obj.isLooped()) {
	var item = obj.getLoopedItem();
	console.log(item, obj.ids, obj.loop);
}

obj.resetLoop();

 
</script>



</body>
</html>