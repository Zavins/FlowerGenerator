/***
 *    ███████╗ █████╗ ██╗   ██╗██╗███╗   ██╗███████╗
 *    ╚══███╔╝██╔══██╗██║   ██║██║████╗  ██║██╔════╝
 *      ███╔╝ ███████║██║   ██║██║██╔██╗ ██║███████╗
 *     ███╔╝  ██╔══██║╚██╗ ██╔╝██║██║╚██╗██║╚════██║
 *    ███████╗██║  ██║ ╚████╔╝ ██║██║ ╚████║███████║
 *    ╚══════╝╚═╝  ╚═╝  ╚═══╝  ╚═╝╚═╝  ╚═══╝╚══════╝
 *                                                  
 * Project For Applied Computing Monthly App Challenge.
 */


var canvas;
var export_canvas;
var ctx;
var export_ctx;
const petal_max_degree = 60;
const petal_min_degree = 10;

function init() {
	canvas = document.getElementById("world");
	export_canvas = document.getElementById("export_canvas");
	ctx = canvas.getContext("2d");
	export_ctx = export_canvas.getContext("2d");;
	ctx.save();
	export_ctx.save();
	set_canvas_size();
	change_background();
	go_to_center();
	change_aim_position();
	init_events();
}

function set_canvas_size() {
	if(!canvas) return;
	clear_canvas();
	//clear canvas before setting canvas
	canvas.width = canvas.offsetWidth;
	canvas.height = canvas.offsetHeight;
	export_canvas.width = canvas.width;
	export_canvas.height = canvas.height;
	go_to_center();
	get_element("position_x").max = canvas.width;
	get_element("position_y").max = canvas.height;
}

function go_to_center() {
	//center x and y
	var x = canvas.width / 2;
	var y = canvas.height / 2
	ctx.moveTo(x, y);
	get_element("position_x").value = x;
	get_element("position_y").value = y;
	change_aim_position()
}

function clear_canvas() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.restore();
}


//events
function init_events() {

	get_element("generate").addEventListener("click", function() {
		generate();
	});

	get_element("generate_random").addEventListener("click", function() {
		generate_random();
	});

	get_element("clear").addEventListener("click", function() {
		clear_canvas();
	});
	
	get_element("export").addEventListener("click", function() {
		save_image();
	});

	get_element("rainbow").addEventListener("click", function() {
		check_rainbow();
	});

	get_element("aim").addEventListener("mousedown", function(e) {
		document.onmousemove = aim_drag;
		document.onmouseup = end_aim_drag;
	});

}



//Change properties
function change_background(){
	color = get_element("background_color").value;
	canvas.style.background = color;
}
function change_aim_position() {
	var x = parseFloat(get_element("position_x").value);
	var y = parseFloat(get_element("position_y").value);
	var aim = get_element("aim");
	var offset = canvas.getBoundingClientRect();
	//offset cuz of margin and padding?
	aim.style.left = (offset.left + x - 22) + 'px';
	aim.style.top = (offset.top + y - 22) + 'px';
}

function change_angle(angle, type) {
	//type 1 on input changed
	//type 2 on slider changed
	if (type == 1) {
		get_element("angle_slider").value = angle;
	}
	if (type == 2) {
		get_element("angle").value = angle;
	}
	get_element("arrow").style.transform = 'rotate(' + angle + 'deg)'
}

function change_transparency(value, type) {
	//type 1 on input changed
	//type 2 on slider changed
	if (type == 1) {
		get_element("transparency_slider").value = value;
	}
	if (type == 2) {
		get_element("transparency").value = value;
	}
}

function aim_drag(e) {
	e.preventDefault();
	var offset = canvas.getBoundingClientRect();
	get_element("position_x").value = clamp(e.clientX - offset.left, canvas.width, 0);
	get_element("position_y").value = clamp(e.clientY - offset.top, canvas.height, 0);
	change_aim_position();
}

function end_aim_drag(e) {
	document.onmouseup = null;
	document.onmousemove = null;
}

function check_rainbow() {
	var rainbow = get_element("rainbow").checked;
	get_element("color").disabled = rainbow;
	
}

//generate
function generate() {
	//0 triangle 1 rectangle 2 circle
	var shape_index = get_element("shape").selectedIndex;
	//position of the flower
	var position_x = parseFloat(get_element("position_x").value);
	var position_y = parseFloat(get_element("position_y").value);
	//size of the flower
	var size = parseInt(get_element("size").value);
	//count of petals
	var petals = parseInt(get_element("petals").value);
	//angle of the flower
	var angle = parseInt(get_element("angle").value);
	//transparency of the flower
	var transparency = parseFloat(get_element("transparency").value);
	//color of the flower
	var color = hex_to_rgba(get_element("color").value, transparency);
	//rainbow?
	var rainbow = get_element("rainbow").checked;
	generate_image(shape_index, position_x, position_y, size, petals, angle, color, rainbow, transparency);
}


function generate_random() {
	//0 triangle 1 rectangle 2 circle
	var shape_index = get_random_int(0, 2);
	//position of the flower
	var position_x = get_random_int(0, canvas.width);
	var position_y = get_random_int(0, canvas.height);
	//size of the flower
	var size = get_random_int(10, 300);
	//count of petals
	var petals = get_random_int(3, 12);
	//angle of the flower
	var angle = get_random_int(0, 359);
	//color of the flower
	var color = get_random_rgba();
	//rainbow?
	var rainbow = get_random_int(0, 10) < 2 ? true : false;
	//rainbow transparency
	var rainbow_transparency = get_random_int(20, 100) / 100;
	generate_image(shape_index, position_x, position_y, size, petals, angle, color, rainbow, rainbow_transparency);
}

function generate_image(shape_index, position_x, position_y, size, petals, angle, color, rainbow, rainbow_transparency) {
	switch (shape_index) {
		case 0:
			draw_triangle_flower(position_x, position_y, petals, size, angle, color, rainbow, rainbow_transparency);
			break;
		case 1:
			draw_rectangle_flower(position_x, position_y, petals, size, angle, color, rainbow, rainbow_transparency);
			break;
		case 2:
			draw_circle_flower(position_x, position_y, petals, size, angle, color, rainbow, rainbow_transparency);
			break;
		default:
			draw_triangle_flower(position_x, position_y, petals, size, angle, color, rainbow, rainbow_transparency);
			break;
	}
}


//draw images
function draw_triangle_flower(x, y, n, length, angle, color, rainbow, rainbow_transparency) {
	ctx.moveTo(x, y);
	var petal_degree = clamp(360 / (n + 1), petal_max_degree, petal_min_degree);
	var petal_gap_degree = (360 - petal_degree * n) / n;
	for (var i = 0; i < n; i++) {
		ctx.beginPath();
		/*one side of the petal
		if petal = 30 degree, gap = 10 and angle = 0 degree
		then first side of petals will be 0, 40, 80*/
		let coordinate = get_endpoint_position(x, y, i * (petal_degree + petal_gap_degree) + angle, length);
		ctx.lineTo(coordinate[0], coordinate[1]);
		/*the other side of the petal
		if petal = 30 degree, gap = 10 and angle = 0 degree
		then the other side of petals will be 30, 70, 110*/
		let coordinate1 = get_endpoint_position(x, y, i * (petal_degree + petal_gap_degree) + petal_degree + angle, length);
		ctx.lineTo(coordinate1[0], coordinate1[1]);
		ctx.lineTo(x, y);
		if (rainbow == true) {
			ctx.strokeStyle = get_rainbow(i, n, rainbow_transparency);
			ctx.fillStyle = get_rainbow(i, n, rainbow_transparency);
		} else {
			ctx.strokeStyle = color;
			ctx.fillStyle = color;
		}
		ctx.stroke();
		ctx.fill();
		ctx.closePath();
	}
}

function draw_circle_flower(x, y, n, length, angle, color, rainbow, rainbow_transparency) {
	ctx.moveTo(x, y);
	var petal_degree = clamp(360 / n, 180, 1);
	//arc of petals. The total degree of gaps of the arcs will be 360 deg.
	var arc_degree = 360 / n + 180;
	// R = radius of the center circle
	// r = radius of the petals
	// let a = 360-arc_deg (gap of the arc)
	var a = 360 - arc_degree;
	// length = R+r+cos(a/2)*r 
	// 2*pi*r*n*(a/360) = 2*pi*R
	// plugin both equations to solve for r and R
	var r = length / (n * (a / 360) + 1 + Math.cos(deg_to_rad(a / 2)));
	var R = r * n * (a / 360);
	for (var i = 0; i < n; i++) {
		ctx.beginPath();
		let coordinate = get_endpoint_position(x, y, i * petal_degree + angle, R + Math.cos(deg_to_rad((360 - arc_degree) / 2)) *
			r);
		ctx.arc(coordinate[0], coordinate[1], r, deg_to_rad(i * petal_degree + angle + 180 + (360 - arc_degree) / 2),
			deg_to_rad(i * petal_degree + angle + 180 - (360 - arc_degree) / 2));
		if (rainbow == true) {
			ctx.strokeStyle = get_rainbow(i, n, rainbow_transparency);
			ctx.fillStyle = get_rainbow(i, n, rainbow_transparency);
		} else {
			ctx.strokeStyle = color;
			ctx.fillStyle = color;
		}
		ctx.stroke();
		ctx.fill();
		ctx.closePath();
	}
	ctx.moveTo(x, y);
	for (var i = 0; i < 360; i++) {
		ctx.beginPath();
		let coordinate = get_endpoint_position(x, y, i + angle, R);
		ctx.lineTo(coordinate[0], coordinate[1]);
		ctx.arc(x, y, R, deg_to_rad(i + angle), deg_to_rad(i + 1 + angle));
		ctx.lineTo(x, y);
		if (rainbow == true) {
			ctx.strokeStyle = get_rainbow(i, 360, rainbow_transparency);
			ctx.fillStyle = get_rainbow(i, 360, rainbow_transparency);
		} else {
			ctx.strokeStyle = color;
			ctx.fillStyle = color;
		}
		ctx.stroke();
		ctx.fill();
		ctx.closePath();
	}

}

function draw_rectangle_flower(x, y, n, length, angle, color, rainbow, rainbow_transparency) {
	var petal_degree = clamp(360 / n, 180, 1);
	//radius of circle that polygons circumscribed.
	//tan(petal_deg/2)*r*2*2+r = length
	var r = length/(1+4*Math.tan(deg_to_rad(petal_degree/2)));
	//side of the polygons
	var side_length = Math.tan(deg_to_rad(petal_degree/2))*r*2;
	//length of the petals
	var petal_length = side_length*2;
	//from the center to the vertices of the polygon.
	var center_to_vertices = side_length/2/Math.sin(deg_to_rad(petal_degree)/2);
	ctx.moveTo(x, y);
	for (var i = 0; i < n; i++) {
		ctx.beginPath();
		let coordinate = get_endpoint_position(x, y, i * petal_degree + angle, center_to_vertices);
		ctx.lineTo(coordinate[0], coordinate[1]);
		let coordinate1 = get_endpoint_position(coordinate[0], coordinate[1], i * petal_degree + angle + petal_degree/2, petal_length);
		ctx.lineTo(coordinate1[0], coordinate1[1]);
		let coordinate2 = get_endpoint_position(coordinate1[0], coordinate1[1], i * petal_degree + angle + petal_degree/2+90, side_length);
		ctx.lineTo(coordinate2[0], coordinate2[1]);
		let coordinate3 = get_endpoint_position(x, y, (i+1) * petal_degree + angle, center_to_vertices);
		ctx.lineTo(coordinate3[0], coordinate3[1]);
		ctx.lineTo(x, y);
		if (rainbow == true) {
			ctx.strokeStyle = get_rainbow(i, n, rainbow_transparency);
			ctx.fillStyle = get_rainbow(i, n, rainbow_transparency);
		} else {
			ctx.strokeStyle = color;
			ctx.fillStyle = color;
		}
		ctx.stroke();
		ctx.fill();
		ctx.closePath();
	}
	
}


//utility
function get_element(name) {
	return document.getElementById(name);
}

function get_rainbow(part, whole, transparency) {
	var rgb = hsv_to_rgb(part / whole, 1, 1);
	return `rgba(${rgb.r},${rgb.g},${rgb.b},${transparency})`;
}

function save_image(){
	var image = canvas.toDataURL();
	export_ctx.fillStyle = canvas.style.background;
	export_ctx.fillRect(0, 0, export_canvas.width, export_canvas.height);
	var imageObj = new Image();
	imageObj.src = image;
	imageObj.onload = function(){
		export_ctx.drawImage(imageObj, 0, 0, export_canvas.width, export_canvas.height)
		var export_image = export_canvas.toDataURL("image/png").replace("image/png","image/octet-stream");
		var download = get_element("download");
		download.setAttribute('download', 'Art.png');
		download.setAttribute('href', export_image);
		download.click();
		export_ctx.restore();
	}
}
//Math Functions!
function get_endpoint_position(x, y, degree, length) {
	let coordinate = new Array(2);
	//new coordinate[x,y]
	coordinate[0] = x + Math.cos(deg_to_rad(degree)) * length;
	coordinate[1] = y + Math.sin(deg_to_rad(degree)) * length;
	return coordinate;
}

function deg_to_rad(degree) {
	return degree * Math.PI / 180;
}

function clamp(value, max, min) {
	if (max < min) return -1;
	return (value >= min && value <= max ? value : (value > max ? max : min));
}

function get_random_int(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive 
}

function get_random_rgba() {
	var r = get_random_int(0, 255);
	var g = get_random_int(0, 255);
	var b = get_random_int(0, 255);
	var a = get_random_int(20, 100) / 100;
	var rgba = `rgba(${r},${g},${b},${a})`;
	return rgba;
}

function hex_to_rgba(hex, transparency) {
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	var rgba = `rgba(${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)},${transparency})`;
	return rgba;
}

function hsv_to_rgb(h, s, v) {
	var r, g, b, i, f, p, q, t;
	if (arguments.length === 1) {
		s = h.s, v = h.v, h = h.h;
	}
	i = Math.floor(h * 6);
	f = h * 6 - i;
	p = v * (1 - s);
	q = v * (1 - f * s);
	t = v * (1 - (1 - f) * s);
	switch (i % 6) {
		case 0:
			r = v, g = t, b = p;
			break;
		case 1:
			r = q, g = v, b = p;
			break;
		case 2:
			r = p, g = v, b = t;
			break;
		case 3:
			r = p, g = q, b = v;
			break;
		case 4:
			r = t, g = p, b = v;
			break;
		case 5:
			r = v, g = p, b = q;
			break;
	}
	return {
		r: Math.round(r * 255),
		g: Math.round(g * 255),
		b: Math.round(b * 255)
	};
}

//Initialize
window.onload = init;
window.onresize = set_canvas_size;
alert("This project is created by Zavins(Zhi Yuan Wang) "+
"for Applied Computing Monthly Challenge!\n\n"+
"Use: Move the aim/pivot and change the properties(or click 'Generate Random') to make your beautiful flower art!\n"+
"Click 'Export Art' to save your art!"
);
