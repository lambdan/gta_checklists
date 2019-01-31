
// global vars
var json_history = [];
var game_json_file;
var game_save_name;
var game_color;


function set_game(json_filename, save_name, color) {
	game_json_file = json_filename; // vc.json
	game_save_name = save_name; // gta_checklists_vc
	game_color = color; // #f27dfd
	//console.log(game_json_file, game_save_name, game_color);
	reset();
}

function populate_checklist(json) {
	$(".checklist").empty();
	var output = []; // html output
	game_id = 0;
	$.each(json, function(game, category) {
		category_id = 0;
		output.push('<div class="accordion" id="' + ('accordion-'+game_id) + '">');
		$.each(category, function(category, missiongiver) {
			//output.push('<h2>' + category + '</h2>'); // story missions etc
			output.push('<div class="card">');
				output.push('<div class="card-header category-header" id="' + ('header-'+ game_id + '-' +category_id) +'">');
					output.push('<h5 class="mb-0">');
						output.push('<button class="btn btn-link category-btn" type="button" data-toggle="collapse" data-target="#' + ('card-' + game_id +'-' + category_id) + '" aria-expanded="false" aria-controls="' + ('card-' + game_id +'-' + category_id) + '">');
							output.push(category);
							output.push('<span id="checklist-category-tasks"> (0/0)</span>');
						output.push('</button>');
					output.push('</h5>');
				output.push('</div>'); // card header
				output.push('<div id="' + ('card-' + game_id +'-' + category_id) + '" ');
				output.push('class="collapse game-body"');
				output.push(' aria-labelledby="' + ('header-' + game_id + '-' +category_id) + '" data-parent="#' + ('accordion-' + game_id + '-' +category_id) + '">');
					output.push('<div class="card-body">');
						output.push('<div class="accordion" id="' + ('accordion-' + game_id + '-' +category_id) + '">');
						name_id = 0;
						$.each(missiongiver, function(name, mission) {
							output.push('<div class="card">');
								output.push('<div class="card-header category-header" id="' + ('header-' + game_id + '-' + category_id + '-' +name_id) +'">');
									output.push('<h5 class="mb-0">');
										output.push('<button class="btn btn-link category-btn" type="button" data-toggle="collapse" data-target="#' + ('card-' + game_id + '-' + category_id + '-' +name_id) + '" aria-expanded="false" aria-controls="' + ('card-' + game_id + '-' + category_id + '-' +name_id) + '">');
											output.push(name);
											output.push('<span id="checklist-category-tasks"> (0/0)</span>');
										output.push('</button>');
									output.push('</h5>');
								output.push('</div>'); // card header
								output.push('<div id="' + ('card-' + game_id + '-' + category_id + '-' +name_id) + '" ');
								output.push('class="collapse category-body"');
								output.push(' aria-labelledby="' + ('header-' + game_id + '-' + category_id + '-' +name_id) + '" data-parent="#' + ('accordion-' + game_id + '-' +category_id) + '">');
								output.push('<div class="card-body">');
									mission_id = 0;
									$.each(mission, function(mission_name, status) {
										id = 'task[\'' + game + '\'][\'' + category + '\'][\'' + name + '\'][\'' + mission_name + '\']'; // dont touch !!! used for json generation
										element = ('task-' + game_id + '-' + category_id + '-' +name_id + '-' + mission_id);
										if (status == true) {
											output.push('<div class="form-check form-check-inline"><input class="form-check-input checklist-task" type="checkbox" name="' + id + '" checked id="' + element +'"><label class="form-check-label" for="' + element +'">' + mission_name + '</label></div>');
										} else {
											output.push('<div class="form-check form-check-inline"><input class="form-check-input checklist-task" type="checkbox" name="' + id + '" id="' + element + '"><label class="form-check-label" for ="' + element + '">' + mission_name + '</label></div>');
										}
										mission_id += 1;
									})
								output.push('</div>'); // card body
							output.push('</div>'); // the card
							output.push('</div>'); // ?
							name_id += 1;
						})
						output.push('</div>'); // the category accordion
					output.push('</div>'); // card body
				output.push('</div>'); // the div card
			output.push('</div>'); // the card
			category_id += 1;
		})
		output.push('</div>'); // the game accordion
		game_id += 1;
	});
	$(".checklist").html(output.join(''));
	update_shown_percentage(current_percentage(), 0, 100);
	update();
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
	$.getJSON(game_json_file, function(json) {
		populate_checklist(json);
		add_to_history(); // ugly hack to make json_history[0] the default values, will likely cause issues in the future if we add auto load 
	});
}

function save() { // save to cache
	save_data = current_json();
	localStorage.setItem(game_save_name, JSON.stringify(save_data));
	//console.log(save_data);
	$("#info").html('<p>Saved ' + current_percentage() + '% at ' + new Date().toLocaleString() + '</p>');
}

function save_man() {
	save_data = current_json();
	var encoded = btoa(JSON.stringify(save_data));
	$('#info').html('<div class="form-group"><p>Heres your code for your ' + current_percentage() + '% completion:<br><textarea class="form-control" cols="40" rows="10" style="font-family:monospace" readonly>' + encoded + '</textarea><br>Copy and save it somewhere safe<br><br><a href="#" class="btn btn-primary" role="button" onclick="clear_info();">OK</a></p></div><br>');
}

function load() { // load from cache
	$(".checklist").empty();
	var retrievedObject = localStorage.getItem(game_save_name);
	json = JSON.parse(retrievedObject);
	populate_checklist(json);
	add_to_history();
	$('#info').html('<p>Loaded ' + current_percentage() + '%</p>');
}

function load_man() {
	var code = prompt("Paste your save code here");
	if (code != null) {
		$(".checklist").empty();
		json = JSON.parse(atob(code));
		populate_checklist(json);
		add_to_history();
		$('#info').html('<p>Loaded ' + current_percentage() + '%</p>');
	} else {
		alert("Did not load");
	}
}

function clear_info() {
	$("#info").empty();
}

function current_percentage() {
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
		percent = 0
	} else {
		percent = Math.floor( (done/total) * 100 );
	}
	return percent;

}

function update_shown_percentage(current, min, max) {
	$("#percent").html('<div class="progress" style="height:30px;"><div class="progress-bar bg-success progress-bar-striped" role="progressbar" aria-valuenow="' + current + '" aria-valuemin="' + min + '" aria-valuemax="' + max + '" style="width: ' + current + '%;background-color:' + game_color + ' !important;">' + current + '%</div></div>');
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

function add_to_history() {
	// push current json to "history" so we can undo back to it later 
	curr = current_json(); // .push(current_json()) pushes the function apparently
	json_history.push(curr);

	// maybe we can diff to see what was changed?
	/*
	if (json_history[json_history.length-1] != null && json_history[json_history.length-2] != null) { 
		diff = filter(json_history[json_history.length-2], json_history[json_history.length-1]);
		console.log(diff);
	}
	*/
}

function undo() { // very glitchy, needs work
	if (json_history[json_history.length-2] == null) {
		alert("Can't go back any further");
	} else {
		data = json_history[json_history.length-2]; // grab json
		json_history.splice(-1, 1); // remove the latest json
		populate_checklist(data);
		$('#info').empty();
	}
}

function filter(obj1, obj2) { // https://stackoverflow.com/a/8432188/1172196
    var result = {};
    for(key in obj1) {
        if(obj2[key] != obj1[key]) result[key] = obj2[key];
        if(typeof obj2[key] == 'array' && typeof obj1[key] == 'array') 
            result[key] = arguments.callee(obj1[key], obj2[key]);
        if(typeof obj2[key] == 'object' && typeof obj1[key] == 'object') 
            result[key] = arguments.callee(obj1[key], obj2[key]);
    }
    return result;
}

function update() {
	$('.card').each(function() {
		checkboxes = $(this).find('.checklist-task');
		section_total = checkboxes.length;
		section_done = 0;

		$.each(checkboxes, function() {
			if (this.checked) {
				section_done += 1
			}
		});

		// update 0/x next to category
		$(this).find('#checklist-category-tasks').html(' (' + section_done + '/' + section_total + ')');

		// collapse card and add bg color if all done
		if (section_total == section_done) {
			$(this).find('.category-body').addClass('collapse').removeClass('show');
			$(this).find('.category-header').addClass('bg-primary');
			$(this).find('.category-btn').addClass('text-white');
		} else { // remove the classes if  theyre not all done (eg you mark all missions, then undo something)
			$(this).find('.category-header').removeClass('bg-primary');
			$(this).find('.category-btn').removeClass('text-white');
		}
		//$(this).find('.category-body').attr("class"). // useful for finding divs
	});
}

$(document).ready(function() {
    $(".checklist").change(function() {
    	update();
    	add_to_history();
    	update_shown_percentage(current_percentage(), 0, 100);
    });
});