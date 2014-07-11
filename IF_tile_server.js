// var zerorpc = require("zerorpc");

// var client = new zerorpc.Client();
// client.connect("tcp://127.0.0.1:4242");

// client.invoke("streaming_range", 10, 20, 2, function(error, res, more) {
//     console.log(res);
// });

var parameters = [''];

var express = require('express'); 
var app = express();
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(app.router);


var sys = require('sys')
var exec = require('child_process').exec;
function puts(error, stdout, stderr) { sys.puts(stdout) }
exec("ls -la", puts, function(res){
	console.log(res);
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