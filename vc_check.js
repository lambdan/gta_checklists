function reset() {
	$(".checklist").empty();
	$.getJSON('vc.json', function(json) {
		console.log(json);
		$.each(json, function(game, category) {
			$.each(category, function(category, missiongiver) {
				$(".checklist").append('<h2>' + category + '</h2>');
				$.each(missiongiver, function(name, mission) {
					$(".checklist").append('<h3>' + name + '</h3>');
					$.each(mission, function(mission_name, status) {
						if (status == true) {
							$(".checklist").append('<input type="checkbox" name="task[\'' + game + '\'][\'' + category + '\'][\'' + name + '\'][\'' + mission_name + '\']" checked> ' + mission_name + '<br>');
						} else {
							$(".checklist").append('<input type="checkbox" name="task[\'' + game + '\'][\'' + category + '\'][\'' + name + '\'][\'' + mission_name + '\']"> ' + mission_name + '<br>');
						}
					})
				})
			})
		})
	});
	percentage();	
}

function save() {
	console.log("save");

	// https://stackoverflow.com/a/7108685/1172196
	/* Get input values from form */ 
	var data = {}
	values = jQuery(".checklist").serializeArray();
	$.each(values, function() {
		if (this.value == "on") {
			//this.value = true;
			var val = true;
			var c = this.name.split("['");
			var a = buildInputObject(c, val);
			$.extend(true, data, a);
		}
	});
	

	jQuery('.checklist input[type=checkbox]:not(:checked)').map(
			function() {
				//return {"name": this.name, "value": false}
				var val = false;
				var c = this.name.split("['");
				var a = buildInputObject(c, val);
				$.extend(true, data, a);
	});

	//console.log(data);
	save_data = data.task;
	//console.log(data.task);
	localStorage.setItem('gta_checklists_vc', JSON.stringify(save_data));
	alert("Saved!");

}

function load() {
	$(".checklist").empty();
	var retrievedObject = localStorage.getItem('gta_checklists_vc');
	json = JSON.parse(retrievedObject);
	console.log(json);
	$.each(json, function(game, category) {
		$.each(category, function(category, missiongiver) {
			$(".checklist").append('<h2>' + category + '</h2>');
			$.each(missiongiver, function(name, mission) {
				$(".checklist").append('<h3>' + name + '</h3>');
				$.each(mission, function(mission_name, status) {
					if (status == true) {
						$(".checklist").append('<input type="checkbox" name="task[\'' + game + '\'][\'' + category + '\'][\'' + name + '\'][\'' + mission_name + '\']" checked> ' + mission_name + '<br>');
					} else {
						$(".checklist").append('<input type="checkbox" name="task[\'' + game + '\'][\'' + category + '\'][\'' + name + '\'][\'' + mission_name + '\']"> ' + mission_name + '<br>');
					}
				})
			})
		})
	});
	alert("Loaded!");
	percentage();
}

function save_man() {
	var data = {}
	values = jQuery(".checklist").serializeArray();
	$.each(values, function() {
		if (this.value == "on") {
			//this.value = true;
			var val = true;
			var c = this.name.split("['");
			var a = buildInputObject(c, val);
			$.extend(true, data, a);
		}
	});
	

	jQuery('.checklist input[type=checkbox]:not(:checked)').map(
		function() {
				//return {"name": this.name, "value": false}
				var val = false;
				var c = this.name.split("['");
				var a = buildInputObject(c, val);
				$.extend(true, data, a);
			});

	save_data = data.task;
	var encoded = btoa(JSON.stringify(save_data));
	$('#info').append('<p>Heres your code:<br><textarea cols="40" rows="10" style="font-family:monospace" readonly>' + encoded + '</textarea><br>Copy and save it somewhere safe<br><a href="#" onclick="clear_info();">OK</a></p>');
}

function load_man() {
	var code = prompt("Paste your save code here");
	if (code != null) {
		$(".checklist").empty();
		json = JSON.parse(atob(code));
		console.log(json);
		$.each(json, function(game, category) {
			$.each(category, function(category, missiongiver) {
				$(".checklist").append('<h2>' + category + '</h2>');
				$.each(missiongiver, function(name, mission) {
					$(".checklist").append('<h3>' + name + '</h3>');
					$.each(mission, function(mission_name, status) {
						if (status == true) {
							$(".checklist").append('<input type="checkbox" name="task[\'' + game + '\'][\'' + category + '\'][\'' + name + '\'][\'' + mission_name + '\']" checked> ' + mission_name + '<br>');
						} else {
							$(".checklist").append('<input type="checkbox" name="task[\'' + game + '\'][\'' + category + '\'][\'' + name + '\'][\'' + mission_name + '\']"> ' + mission_name + '<br>');
						}
					})
				})
			})
		});
		alert("Loaded!");
		percentage();	
	}
}

function clear_info() {
	$("#info").empty();
}

function percentage() {
	done = 0;
	total = 0;
	values = jQuery(".checklist").serializeArray();
	$.each(values, function() {
		if (this.value == "on") {
			done += 1;
			total += 1;
		}
	});

	jQuery('.checklist input[type=checkbox]:not(:checked)').map(
		function() {
			total += 1;
			});

	if (done == 0 || total == 0) {
		percent = "0%"
	} else {
		percent = ((done/total) * 100).toFixed(0) + '%'
	}
	$("#percent").html("<h2>" + percent + "</h2>");

	//save_data = data.task;
}

function buildInputObject(arr, val) { // https://stackoverflow.com/a/35689636/1172196
	if (arr.length < 1)
		return val;  
	var objkey = arr[0];
	if (objkey.slice(-2) == "']") {
		objkey = objkey.slice(0,-2);
	}  
	var result = {};
	if (arr.length == 1){
		result[objkey] = val;
	} else {
		arr.shift();
		var nestedVal = buildInputObject(arr,val);
		result[objkey] = nestedVal;
	}
	return result;
}

$(document).ready(function() {
    $(".checklist").change(function() {
    	percentage();
    });
});