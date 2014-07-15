
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

	
	//console.log('asdf334');

	// buildMap();

	// function buildMap(){


		//saveImage(req, gotImageID);
		saveImage(req, res);


		// var gotImageID = function(data) {
		//   console.log('got data: '+data);

		//  SEND BACK TO IF-root



		// }
	

});




function saveImage(req, res){

	  //console.log(req.body);

      var fstream;
        req.pipe(req.busboy);

        req.busboy.on('file', function (fieldname, file, filename) {

        	// fieldname = fieldname.replace(/%22/g, '"'); //fixing weird angular %22 for " thing
        	// var coordinates = JSON.parse(fieldname); //incoming box coordinates

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
                	console.log('writing new path');
                    var newPath = "temp_img_uploads/" + current;

                    fstream = fs.createWriteStream(newPath);
                    file.pipe(fstream);
                    fstream.on('close', function () {
                            
                        console.log('saved image as ' + current);

                        console.log(fieldname);
                        processImage(current, res, fieldname);   
                        
           
                    });

                    break;
                }
            }

        });
}

function processImage(id, res, coordinates){



	im.identify('temp_img_uploads/' + id, function(err, features){
	  if (err) throw err
	  buildTiles(id,res,coordinates,features)
	  // { format: 'JPEG', width: 3904, height: 2622, depth: 8 }
	})
	 



	// IF MAP DIR ALREADY EXISTS, then DELETE AND REWRITE WITH NEW ONE



}

function buildTiles(id,res,coordinatesString,size){

	console.log('building tiles');

	var tempVRT = './maps/newtesting9.vrt';
var tempVRT2 = './maps/newtesting10.vrt';

   	coordinatesString = coordinatesString.replace(/%22/g, '"'); //fixing weird angular %22 for " thing
	var coordinates = JSON.parse(coordinatesString); //incoming box coordinates


	console.log(coordinates);

	var mapImage = 'temp_img_uploads/' + id;

	var worldMapVRT = './maps/'+coordinates.worldID+'.vrt';
	var	worldMapVRT2 ='./maps/'+coordinates.worldID + '_warped.vrt';

	var nw_pixel_lng = 0;
	var nw_pixel_lat = 0;
	var nw_loc_lng = coordinates.nw_loc_lng;
	var nw_loc_lat = coordinates.nw_loc_lat;

	var sw_pixel_lng = 0;
	var sw_pixel_lat = size.height;
	var sw_loc_lng = coordinates.sw_loc_lng;
	var sw_loc_lat = coordinates.sw_loc_lat;

	var ne_pixel_lng = size.width;
	var ne_pixel_lat = 0;
	var ne_loc_lng = coordinates.ne_loc_lng;
	var ne_loc_lat = coordinates.ne_loc_lat;

	var se_pixel_lng = size.width;
	var se_pixel_lat = size.height;
	var se_loc_lng = coordinates.se_loc_lng;
	var se_loc_lat = coordinates.se_loc_lat;

	//console.log('process '+id);



//console.log('gdal_translate -of VRT -a_srs EPSG:4326 -gcp '+ nw_pixel_lng +' '+ nw_pixel_lat +' '+ nw_loc_lng +' '+ nw_loc_lat +' -gcp '+ sw_pixel_lng +' '+ sw_pixel_lat +' '+ sw_loc_lng +' '+ sw_loc_lat +' -gcp '+ ne_pixel_lng +' '+ ne_pixel_lat +' '+ ne_loc_lng +' '+ ne_loc_lat +' -gcp '+ se_pixel_lng +' '+ se_pixel_lat +' '+ se_loc_lng +' '+ se_loc_lat +' '+ mapImage +' '+ worldMapVRT + '');
	
	//build VRT file from image pixels && location coordinates
	exec('gdal_translate -of VRT -a_srs EPSG:4326 -gcp '+ nw_pixel_lng +' '+ nw_pixel_lat +' '+ nw_loc_lng +' '+ nw_loc_lat +' -gcp '+ sw_pixel_lng +' '+ sw_pixel_lat +' '+ sw_loc_lng +' '+ sw_loc_lat +' -gcp '+ ne_pixel_lng +' '+ ne_pixel_lat +' '+ ne_loc_lng +' '+ ne_loc_lat +' -gcp '+ se_pixel_lng +' '+ se_pixel_lat +' '+ se_loc_lng +' '+ se_loc_lat +' '+ mapImage +' '+ worldMapVRT + '', function(err, stdout, stderr) {
		// React to callback
		console.log(stderr);
		console.log(stdout);

		//warp VRT to earth curvature
		exec('gdalwarp -of VRT -t_srs EPSG:4326 '+worldMapVRT+' '+worldMapVRT2+'', function(err2, stdout2, stderr2) { 

			console.log(stderr2);
			console.log(stdout2);

			//build tiles from warped VRT 

			//add in -w none
			exec('gdal2tiles.py -k -n -w none '+worldMapVRT2+'', function(err3, stdout3, stderr3) {

				console.log(stderr3);
				console.log(stdout3);
				res.send('map '+id+' built');
				//delete temp img and vrt

				//remove temp map file
				fs.unlink(__dirname + '/temp_img_uploads/' + id, function (err) {
			      if (err) throw err;
			      console.log('successfully deleted '+__dirname + '/temp_img_uploads/' + id);
			    });

			});

		});
	}); 

	// res.send('asdf');



}


app.listen(3000, function() {
    console.log("Illya casting tile build! on 3000 ~ ~ ♡");
});








