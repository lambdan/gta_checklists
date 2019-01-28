function reset() {
	$(".checklist").empty();
	$.getJSON('vc.json', function(json) {
		populate_checklist(json);
	});
}

function populate_checklist(json) {
	console.log("populate_checklist");
	console.log(json);
	$(".checklist").empty();
	var output = [];
	output.push('<div class="form-group">');
	$.each(json, function(game, category) {
		$.each(category, function(category, missiongiver) {
			output.push('<h2>' + category + '</h2>');
			$.each(missiongiver, function(name, mission) {
				output.push('<h3>' + name + '</h3>');
				//$(".checklist").append('<div class="form-check form-check-">');
				//id = 0
				//output.push('<div class="form-group">');
				$.each(mission, function(mission_name, status) {
					id = 'task[\'' + game + '\'][\'' + category + '\'][\'' + name + '\'][\'' + mission_name + '\']';
					if (status == true) {
						output.push('<div class="form-check form-check-inline"><input class="form-check-input" type="checkbox" name="' + id + '" checked id="' + id +'"><label class="form-check-label" for="' + id +'">' + mission_name + '</label></div>');
					} else {
						output.push('<div class="form-check form-check-inline"><input class="form-check-input" type="checkbox" name="' + id + '" id="' + id + '"><label class="form-check-label" for ="' + id + '">' + mission_name + '</label></div>');
					}

					//id += 1
				})
				//output.push('</div>');
				//$(".checklist").append('</div>');
			})
		})
	});
	output.push('</div>');
	$(".checklist").html(output.join(''));
	percentage();	
}

function create_save() {
	//console.log("create save");

	var data = {};
	$( ".checklist input[type=checkbox]" ).each(function() {
  		//console.log(this.name);
  		//console.log(this.checked);
  		var val = this.checked;
  		var c = this.name.split("['");
  		var a = buildInputObject(c, val);
  		$.extend(true, data, a);
  	});

	save_data = data.task;
	//console.log(save_data);
	return save_data;

}

function save() { // save to cache
	save_data = create_save();
	localStorage.setItem('gta_checklists_vc', JSON.stringify(save_data));
	console.log(save_data);
	alert("Saved!");	
}

function save_man() {
	save_data = create_save();
	var encoded = btoa(JSON.stringify(save_data));
	$('#info').append('<form><div class="form-group"><p>Heres your code:<br><textarea class="form-control" cols="40" rows="10" style="font-family:monospace" readonly>' + encoded + '</textarea><br>Copy and save it somewhere safe<br><a href="#" onclick="clear_info();">OK</a></p></div></form>');
}

function load() { // load from cache
	$(".checklist").empty();
	var retrievedObject = localStorage.getItem('gta_checklists_vc');
	json = JSON.parse(retrievedObject);
	populate_checklist(json);
	alert("Loaded!");
}

function load_man() {
	var code = prompt("Paste your save code here");
	if (code != null) {
		$(".checklist").empty();
		json = JSON.parse(atob(code));
		populate_checklist(json);
		alert("Loaded!");
	} else {
		alert("Did not load");
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
