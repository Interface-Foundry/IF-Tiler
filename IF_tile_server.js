// var zerorpc = require("zerorpc");

// var client = new zerorpc.Client();
// client.connect("tcp://127.0.0.1:4242");

// client.invoke("streaming_range", 10, 20, 2, function(error, res, more) {
//     console.log(res);
// });

var parameters = [''];

var express = require('express'); 
var app = express();
// app.use(express.logger('dev'));
// app.use(express.bodyParser());
// app.use(app.router);


var sys = require('sys')
var exec = require('child_process').exec;

// function puts(error, stdout, stderr) { sys.puts(stdout) }
// exec("gdal_translate -of VRT -a_srs EPSG:4326 -gcp 0 0 -73.99749 40.75683 -gcp 0 10000 -73.99749 40.7428 -gcp 9529 0 -73.98472 40.75683 -gcp 9529 10000 -73.98472 40.7428 ./tilers_tools/map_to_tiles2.png ./map_vrts/newtesting2.vrt", puts, function(res){
// 	console.log(res);


// });

// pull in image with coordinates
// measure image size
// plugin here:

var copyright = 'Interface Foundry PBC';
var mapName = 'incoming';

var nw_pixel_lng = 0;
var nw_pixel_lat = 0;
var nw_loc_lng = -73.99749;
var nw_loc_lat = 40.75683;

var sw_pixel_lng = 0;
var sw_pixel_lat = 10000;
var sw_loc_lng = -73.99749;
var sw_loc_lat = 40.7428;

var ne_pixel_lng = 9529;
var ne_pixel_lat = 0;
var ne_loc_lng = -73.98472;
var ne_loc_lat = 40.75683;

var se_pixel_lng = 9529;
var se_pixel_lat = 10000;
var se_loc_lng = -73.98472;
var se_loc_lat = 40.7428;

//generate unique temp image path hash
var tempIMG = './tilers_tools/map_to_tiles2.png';

//use same name for vrt
var tempVRT = './map_vrts/newtesting7.vrt';
var tempVRT2 = './map_vrts/newtesting8.vrt';

var exec = require('child_process').exec;
exec('gdal_translate -of VRT -a_srs EPSG:4326 -gcp '+ nw_pixel_lng +' '+ nw_pixel_lat +' '+ nw_loc_lng +' '+ nw_loc_lat +' -gcp '+ sw_pixel_lng +' '+ sw_pixel_lat +' '+ sw_loc_lng +' '+ sw_loc_lat +' -gcp '+ ne_pixel_lng +' '+ ne_pixel_lat +' '+ ne_loc_lng +' '+ ne_loc_lat +' -gcp '+ se_pixel_lng +' '+ se_pixel_lat +' '+ se_loc_lng +' '+ se_loc_lat +' '+ tempIMG +' '+ tempVRT + '', function(err, stdout, stderr) {
	// React to callback
	console.log(stderr);
	console.log(stdout);

	exec('gdalwarp -of VRT -t_srs EPSG:4326 '+tempVRT+' '+tempVRT2+'', function(err2, stdout2, stderr2) {

		console.log(stderr2);
		console.log(stdout2);


		exec('gdal2tiles.py -k -n -t '+tempVRT2+'', function(err3, stdout3, stderr3) {

			console.log(stderr3);
			console.log(stdout3);

		});

	});
});




// app.post('/upload', function(req, res){
   // if(req.files.myUpload){
//      var python = require('child_process').spawn(
// 	     'python',
// 	     // second argument is array of parameters, e.g.:
// 	     ["/home/me/pythonScript.py", parameters]
//      );
//      var output = "";
//      python.stdout.on('data', function(){ output += data });
//      python.on('close', function(code){ 
//        if (code !== 0) {  return 
//        	//res.send(500, code); 
//        	console.log(code);
//        }
//        return res.send(200, output)
//      });
// //    } else { res.send(500, 'No file found') }
// // });

require('http').createServer(app).listen(3000, function(){
  console.log('Listening on 3000');
});

     // var python = require('child_process').spawn(
     // 'python',
     // // second argument is array of parameters, e.g.:
     // ["/home/me/pythonScript.py"
     // , req.files.myUpload.path
     // , req.files.myUpload.type]
     // );
     // var output = "";
     // python.stdout.on('data', function(){ output += data });
     // python.on('close', function(code){ 
     //   if (code !== 0) {  return res.send(500, code); }
     //   return res.send(200, output)
     // });