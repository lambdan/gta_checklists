function populate_checklist(json) {
	//console.log("populate_checklist");
	//console.log(json);
	$(".checklist").empty();
	var output = []; // html output
	//output.push('<div class="form-group">');
	$.each(json, function(game, category) {
		$.each(category, function(category, missiongiver) {
			output.push('<h2>' + category + '</h2>'); // story missions etc
			output.push('<div class="accordion" id="' + ('accordion'+category).replace(/\s+/g, '') + '">');
			$.each(missiongiver, function(name, mission) {
				//output.push('<h3>' + name + '</h3>'); // ken rosenberg etc
				output.push('<div class="card">');
				output.push('<div class="card-header" id="' + ('header'+name).replace(/\s+/g, '') +'">');
				output.push('<h5 class="mb-0">');
				output.push('<button class="btn btn-link" type="button" data-toggle="collapse" data-target="#' + ('div'+name).replace(/\s+/g, '') + '" aria-expanded="false" aria-controls="' + ('div'+name).replace(/\s+/g, '') + '">');
				output.push(name);
				// calculate progress
				total = 0
				done = 0
				$.each(mission, function(mission_name, status) {
					if (status==true) {
						done += 1
					}
					total += 1
				});
				output.push(' (' + done + '/' + total + ')');
				output.push('</button>');
				output.push('</h5>');
				//output.push('<div class="progress"><div class="progress-bar" role="progressbar" style="width: 33%">0 / 4</div></div>');
				output.push('</div>'); // card header
				output.push('<div id="' + ('div'+name).replace(/\s+/g, '') + '" ');
				if (total == done) { // all tasks done, can collapse
					output.push('class="collapse"');
				} else {
					output.push('class="show');
				}
				output.push(' aria-labelledby="' + ('header'+name).replace(/\s+/g, '') + '" data-parent="#' + ('accordion'+category).replace(/\s+/g, '') + '">');
				output.push('<div class="card-body">');
				$.each(mission, function(mission_name, status) {
					id = 'task[\'' + game + '\'][\'' + category + '\'][\'' + name + '\'][\'' + mission_name + '\']';
					//id2 = btoa(id); // for "for" bootstrap targets
					if (status == true) {
						output.push('<div class="form-check form-check-inline"><input class="form-check-input" type="checkbox" name="' + id + '" checked id="' + btoa(id) +'"><label class="form-check-label" for="' + btoa(id) +'">' + mission_name + '</label></div>');
					} else {
						output.push('<div class="form-check form-check-inline"><input class="form-check-input" type="checkbox" name="' + id + '" id="' + btoa(id) + '"><label class="form-check-label" for ="' + btoa(id) + '">' + mission_name + '</label></div>');
					}
				})
				output.push('</div>'); // card body
				output.push('</div>'); // the div class collape show ...
				output.push('</div>'); // the card
			})
			output.push('</div>'); // the accordion
		})
	});
	//output.push('</div>'); // the form group
	$(".checklist").html(output.join(''));
	update_shown_percentage();
}

function current_json() {
	var data = {};
	$( ".checklist input[type=checkbox]" ).each(function() {
  		var val = this.checked;
  		var c = this.name.split("['");
  		var a = buildInputObject(c, val);
  		$.extend(true, data, a);
  	});

	save_data = data.task;
	return save_data;

}

function reset() {
	$(".checklist").empty();
	$("#info").empty();
	$.getJSON('vc.json', function(json) {
		populate_checklist(json);
	});
}

function save() { // save to cache
	save_data = current_json();
	localStorage.setItem('gta_checklists_vc', JSON.stringify(save_data));
	console.log(save_data);
	$("#info").html('<p>Saved ' + percentage() + ' at ' + new Date().toLocaleString() + '</p>');
}

function save_man() {
	save_data = current_json();
	var encoded = btoa(JSON.stringify(save_data));
	$('#info').html('<div class="form-group"><p>Heres your code for your ' + percentage() + ' completion:<br><textarea class="form-control" cols="40" rows="10" style="font-family:monospace" readonly>' + encoded + '</textarea><br>Copy and save it somewhere safe<br><br><a href="#" class="btn btn-primary" role="button" onclick="clear_info();">OK</a></p></div><br>');
}

function load() { // load from cache
	$(".checklist").empty();
	var retrievedObject = localStorage.getItem('gta_checklists_vc');
	json = JSON.parse(retrievedObject);
	populate_checklist(json);
	$('#info').html('<p>Loaded ' + percentage() + '</p>');
}

function load_man() {
	var code = prompt("Paste your save code here");
	if (code != null) {
		$(".checklist").empty();
		json = JSON.parse(atob(code));
		populate_checklist(json);
		$('#info').html('<p>Loaded ' + percentage() + '</p>');
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
	//$("#percent").html("<h2>" + percent + "</h2>");
	return percent;

	//save_data = data.task;
}

function update_shown_percentage() {
	$("#percent").html('<div class="progress"><div class="progress-bar" role="progressbar" style="width: ' + percentage() + ';background-color:#F27DFD !important">' + percentage() + '</div></div>');
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
	reset(); // load default json
    $(".checklist").change(function() {
    	populate_checklist(current_json());
    	update_shown_percentage();
    });
});
