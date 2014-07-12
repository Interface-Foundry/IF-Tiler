
var fs = require('fs');
var im = require('imagemagick'); //must also install imagemagick package on server /!\
var async = require('async');
var moment = require('moment');
var morgan = require('morgan');
var connectBusboy = require('connect-busboy');

var bodyParser = require('body-parser');

var express = require('express'),
    app = module.exports.app = express();

    app.use(express.static(__dirname + '/app'));


    //===== PASSPORT =====//
    // set up our express application
    app.use(morgan('dev')); // log every request to the console
    // app.use(cookieParser()); // read cookies (needed for auth)

    // app.use(bodyParser.urlencoded({
    //   extended: true
    // })); // get information from html forms

    // app.use(bodyParser.json({
    //   extended: true
    // })); // get information from html forms




   
    //===================//

app.use(connectBusboy());




// var parameters = [''];

// var express = require('express'); 
// var app = express();
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
var tempVRT = './maps/newtesting9.vrt';
var tempVRT2 = './maps/newtesting10.vrt';

var exec = require('child_process').exec;

app.post('/api/upload', function (req, res) {
	

	buildMap();

	function buildMap(req,res){


		saveImage(req, gotImageID);


		var gotImageID = function(data) {
		  console.log('got data: '+data);

		  //SEND BACK TO IF-root

			// //build VRT file from image pixels && location coordinates
			// exec('gdal_translate -of VRT -a_srs EPSG:4326 -gcp '+ nw_pixel_lng +' '+ nw_pixel_lat +' '+ nw_loc_lng +' '+ nw_loc_lat +' -gcp '+ sw_pixel_lng +' '+ sw_pixel_lat +' '+ sw_loc_lng +' '+ sw_loc_lat +' -gcp '+ ne_pixel_lng +' '+ ne_pixel_lat +' '+ ne_loc_lng +' '+ ne_loc_lat +' -gcp '+ se_pixel_lng +' '+ se_pixel_lat +' '+ se_loc_lng +' '+ se_loc_lat +' '+ tempIMG +' '+ tempVRT + '', function(err, stdout, stderr) {
			// 	// React to callback
			// 	console.log(stderr);
			// 	console.log(stdout);

			// 	//warp VRT to earth curvature
			// 	exec('gdalwarp -of VRT -t_srs EPSG:4326 '+tempVRT+' '+tempVRT2+'', function(err2, stdout2, stderr2) { 

			// 		console.log(stderr2);
			// 		console.log(stdout2);

			// 		//build tiles from warped VRT 

			// 		//add in -w none
			// 		exec('gdal2tiles.py -k -n '+tempVRT2+'', function(err3, stdout3, stderr3) {

			// 			console.log(stderr3);
			// 			console.log(stdout3);

			// 			//delete temp img and vrt

			// 		});

			// 	});
			// });  


		};



	}

}








    //disabled Max image upload size for NOW << enable later...
   // if (req.files.files[0].size <= 5242880){

	// SET FILE SIZE LIMIT HERE 
	//FILTER ANYTHING BUT GIF JPG PNG




function saveImage(req, callback){

      var fstream;
        req.pipe(req.busboy);

        req.busboy.on('file', function (fieldname, file, filename) {

            var fileName = filename.substr(0, filename.lastIndexOf('.')) || filename;
            var fileType = filename.split('.').pop();

            while (1) {

                var fileNumber = Math.floor((Math.random()*100000000)+1); //generate random file name
                var fileNumber_str = fileNumber.toString(); 
                var current = fileNumber_str + '.' + fileType;

                //checking for existing file, if unique, write to dir
                if (fs.existsSync("temp_img_uploads/" + current)) {
                    continue; //if there are max # of files in the dir this will infinite loop...
                } 
                else {

                    var newPath = "temp_img_uploads/" + current;

                    fstream = fs.createWriteStream(newPath);
                    file.pipe(fstream);
                    fstream.on('close', function () {
                         im.crop({
                          srcPath: newPath,
                          dstPath: newPath,
                          width: 100,
                          height: 100,
                          quality: 85,
                          gravity: "Center"
                        }, function(err, stdout, stderr){

                            //res.send("uploads/"+current);
                            callback(current);

                        });                       
                    });

                    break;
                }
            }

        });

}
  






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