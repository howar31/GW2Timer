<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>Guild Wars 2 Timer</title>

	<link href="bootstrap.min.css" rel="stylesheet">
	<link href="index.css" rel="stylesheet">

	<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>
	<script src="bootstrap.min.js"></script>

	<!--[if lt IE 9]>
	<script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
	<script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
	<![endif]-->
</head>

<body>
	<div class="container">
	<div class="page-header" id="header">
		<h1 id="header-title">Guild Wars 2 Timer</h1>
		<p class="lead">2014 Feature Pack updated world bosses time table.</p>
	</div>
	<div id="table-worldboss">
	<div class="row table-header">
		<div class="col-md-6">World Boss</div>
		<div class="col-md-3">US Pacific Time (Server Time)</div>
		<div class="col-md-3">Local Time</div>
	</div>
	</div>
</div>

<script>

function str2sec (str) {
	var a = str.split(':');
	return ((+a[0]) * 60 * 60 + (+a[1]) * 60);
}

function sec2str (sec) {
	var hh = parseInt( sec / 3600 ) % 24;
	var mm = parseInt( sec / 60 ) % 60;
	var ss = sec % 60;
//	return ((hh < 10 ? "0" + hh : hh) + ":" + (mm < 10 ? "0" + mm : mm) + ":" + (ss  < 10 ? "0" + ss : ss));
	return ((hh < 10 ? "0" + hh : hh) + ":" + (mm < 10 ? "0" + mm : mm));
}

$.getJSON("./wbtime.json", function(json) {
	var i = 0;
	var k = 0;
	var wbt = new Array();
	while(json.worldboss[i]) {
//			var tmp = '<div class="row">'
//				+'<div class="col-md-6">'+json.worldboss[i].name+'</div>';
//			$("#table-worldboss").append(tmp); 
		var j = 0;
		while(json.worldboss[i].uptime[j]) {
			sec = str2sec(json.worldboss[i].uptime[j]);
			wbt[k++] = {name: json.worldboss[i].name, uptime: json.worldboss[i].uptime[j], upsec: sec, scale: json.worldboss[i].scale};
			j++;
		}
		i++;
	}
	for (i = 0; i<k; i++) {
		console.log(wbt[i]);
	}
});

</script>
</body>
</html>
