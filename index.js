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
	var x = a.lcsec - nowoffset + 1800;
	var y = b.lcsec - nowoffset + 1800;
	if (x < 0) x += 86400;
	if (y < 0) y += 86400;
	return ((x < y) ? -1 : ((x > y) ? 1 : 0));
}

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
					class: json.worldboss[i].name.replace(/\s+/g, ''),
					name: json.worldboss[i].name, 
					uptime: json.worldboss[i].uptime[j], 
					upsec: sec, 
					lctime: sec2str(lsec),
					lcsec: lsec,
					scale: json.worldboss[i].scale,
					map: json.worldboss[i].map,
					waypoint: json.worldboss[i].waypoint
				};
				j++;
			}
			i++;
		}
		wbt.sort(sortByTime);
		for (i = 0; i<k; i++) {
			var donechk = wbdonecheck(wbt[i].class)?" done":"";
			var tmp = '<div class="row table-content scale-'+wbt[i].scale+' '+wbt[i].class+'">'
				+'<div class="col-sm-4 wbname'+donechk+'"><span class="hiddenvalue" hidden>'+wbt[i].class+'</span>'+wbt[i].name+'<span class="wbmap">'+(wbt[i].map?" - "+wbt[i].map:"")+'</span></div>'
				+'<div class="col-sm-3 localtime">'+wbt[i].lctime+'</div>'
				+'<div class="col-sm-3 psttime">'+wbt[i].uptime+'</div>'
				+'<div class="col-sm-2 waypoint">'+wbt[i].waypoint+'</div>'
				+'</div>';
			$("#table-worldboss").append(tmp); 
		}
	});
}

function getCookie(cname)
{
	var name = cname + "=";
	var ca = document.cookie.split(';');
	for(var i=0; i<ca.length; i++) {
		var c = ca[i].trim();
		if (c.indexOf(name)==0) return c.substring(name.length,c.length);
	}
	return "";
}

Array.prototype.clean = function(deleteValue) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == deleteValue) {         
      this.splice(i, 1);
      i--;
    }
  }
  return this;
};

function wbdone(wbval) {
	var wbd = getCookie('wbdone').split('/');
	var wbset = $.inArray( wbval, wbd );
	if (wbset > -1) {
		wbd.splice(wbset, 1);
	} else {
		wbd.push(wbval);
	}
	wbd.clean("");
	wbval = wbd.join("/");

	var now = new Date();
	var expire = new Date();
	expire.setUTCFullYear(now.getUTCFullYear());
	expire.setUTCMonth(now.getUTCMonth());
	expire.setUTCDate(now.getUTCDate()+1);
	expire.setUTCHours(0);
	expire.setUTCMinutes(0);
	expire.setUTCSeconds(0);
	document.cookie = "wbdone="+wbval+"; expires=" + expire.toUTCString() +";";
}

function wbdonecheck(wbval) {
	var wbd = getCookie('wbdone').split('/');
	var wbset = $.inArray( wbval, wbd );
	if (wbset > -1) {
		return true;
	} else {
		return false
	}
}

$( document ).ready(function() {
	$("#nowtimezone").append(" (UTC+"+getTimezone()+")");

	refreshall();

	setInterval(function() {
		$("#nowtime").html(getnowtime());
		var rn = new Date();
		var rs = rn.getSeconds();
		if (rs == 0) refreshall();
	},1000);

	$( document ).on("click", ".waypoint:not(:has(input))", function() {
		var text = this;
		var chatlink = $("<input class='chatlink' type='text' value='"+$( text ).text()+"' />");
		$( text ).html( chatlink );
		chatlink.one("focusout", function() {
			$( text ).html($( this ).val());
		}).focus().select();
	});

	$( document ).on("click", ".wbname", function() {
		var wbid = $(this).children("span.hiddenvalue").html();
		wbdone(wbid);
		$("."+wbid+">.wbname").toggleClass("done");
	});
});
