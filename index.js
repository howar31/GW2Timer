function getTimezone () {
	var offset = new Date().getTimezoneOffset();
	return (offset * -1 / 60);
}

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

function sortByTime(a, b) {
	var now = new Date();
	var nowoffset = str2sec(now.getHours()+":"+now.getMinutes());
	var x = a.lcsec - nowoffset + 900;
	var y = b.lcsec - nowoffset + 900;
	if (x < 0) x += 86400;
	if (y < 0) y += 86400;
	return ((x < y) ? -1 : ((x > y) ? 1 : 0));
}

//function sortByFirstName(a, b) {
//    var x = a.FirstName.toLowerCase();
//    var y = b.FirstName.toLowerCase();
//    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
//}

function getnowtime() {
	var now = new Date();
	var hh = now.getHours();
	var mm = now.getMinutes();
	var ss = now.getSeconds();
	return ((hh < 10 ? "0" + hh : hh) + ":" + (mm < 10 ? "0" + mm : mm) + ":" + (ss  < 10 ? "0" + ss : ss));	
}

function refreshall () {
	$(".table-content").remove();
	$.getJSON("./wbtime.json", function(json) {
		var i = 0;
		var k = 0;
		var wbt = new Array();
		while(json.worldboss[i]) {
			var j = 0;
			while(json.worldboss[i].uptime[j]) {
				sec = str2sec(json.worldboss[i].uptime[j]);
				lsec = sec + ((7 + getTimezone()) * 3600)
				if (lsec >= 86400) lsec -= 86400;
				wbt[k++] = {
					name: json.worldboss[i].name, 
					uptime: json.worldboss[i].uptime[j], 
					upsec: sec, 
					lctime: sec2str(lsec),
					lcsec: lsec,
					scale: json.worldboss[i].scale,
					waypoint: json.worldboss[i].waypoint
				};
				j++;
			}
			i++;
		}
		wbt.sort(sortByTime);
		for (i = 0; i<k; i++) {
			var tmp = '<div class="row table-content scale-'+wbt[i].scale+'">'
				+'<div class="col-sm-4 wbname">'+wbt[i].name+'</div>'
				+'<div class="col-sm-3 localtime">'+wbt[i].lctime+'</div>'
				+'<div class="col-sm-3 psttime">'+wbt[i].uptime+'</div>'
				+'<div class="col-sm-2 waypoint">'+wbt[i].waypoint+'</div>'
				+'</div>';
			$("#table-worldboss").append(tmp); 
		}
	});
}

$( document ).ready(function() {
	$("#localtime-title").append(" (UTC+"+getTimezone()+")");
	refreshall();
	setInterval(function() {
		$("#nowtime").html(getnowtime());
	},1000);
	setInterval(function() {
//		refreshall();
	},60000);
	$( document ).on("click", ".waypoint:not(:has(input))", function() {
		var text = this;
		var chatlink = $("<input class='chatlink' type='text' value='"+$( text ).text()+"' />");
		$( text ).html( chatlink );
		chatlink.one("focusout", function() {
			$( text ).html($( this ).val());
		}).focus().select();
	});
});
