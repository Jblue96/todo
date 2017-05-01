var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var port = process.env.PORT || 3007;
var pg = require('pg');

var config = {
  database: 'todolist',
  host: 'localhost',
  port: 5432,
  max: 17
};

app.use(express.static('public/views')); //allow public dir
app.use('/scripts', express.static(__dirname + '/public/scripts')); // redir
app.use('/vendors', express.static(__dirname + '/public/vendors')); // allow these, need these
var urlEncodedParser = bodyParser.urlencoded({extended: true});


//postgres connect
var connectStr = 'postgres://localhost:5432/todolist';


app.listen(port, function(req, res){
  console.log('listening on', port);
});//end start webserver

//base page
app.get('/', function(req, res){
  console.log('base page hit');
  res.sendFile(path.resolve('public/views/index.html'));
});//end base page

app.delete( '/delete', urlEncodedParser, function( req, res ){
  console.log( 'deleteTask hit' );
  pg.connect(connectStr, function(err, client, done){
    if(err){
      console.log(err);
    } else {
      console.log('I have returned from db');
      client.query('DELETE FROM tasks WHERE id=$1',[req.body.id]);
      done();
      res.send('all gone');
    }
  });// pgres connection
});// End deleteTask

app.get('/retrieveTasks', function(req, res){
  console.log('retTasks url has been hit!');
  pg.connect(connectStr, function(err, client, done){
    if(err){
      console.log(err);
    }else{
      console.log('connected to db in retTasks');
      var query = client.query('SELECT * from tasks');
      var roundUp = [];
      query.on('row', function(row){
        roundUp.push(row);
      });
  query.on('end', function(){
    // done();
    console.log(roundUp);
    res.send(roundUp);
    done();
      });
    }
  });//end connection to db
});//End Retrieve

app.post('/addToList', urlEncodedParser, function(req, res){
  console.log('addToList req.body...',  req.body);
  pg.connect(connectStr, function(err, client, done){
    if(err){
      console.log(err);
    } else {
      console.log('connected to db');
      client.query('INSERT INTO tasks(task, completed) values ($1, $2)', [req.body.task, req.body.status]);
      done();
      res.send('holla');
    }//end if else statement
  });//end connection to database
});//end app.post /addToList

app.put('/completed', urlEncodedParser, function(req, res){
  console.log('updating...', req.body);
  pg.connect(connectStr, function (err, client, done){
    if (err){
      console.log('put');
    } else {
      var query = client.query('UPDATE tasks SET completed = TRUE WHERE id = $1', [req.body.id]);
      done();
      res.send('Finished w/PUT completed tasks');
    }
  });
});//End Complete Tasks
