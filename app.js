var express = require('express')
var cors = require('cors')
var app = express()

var main = require('./modules/main')
var backup = require('./modules/backup')
var new_js = require('./modules/new')
// const dbo = require('./db/db');


const PORT = process.env.PORT || 5000;

app.use(cors())
app.set('view engine', 'ejs');

app.get('/api/all', function (req, res, next) {
    backup.starts().then(function (data) {
        console.log(data);
        res.send(data)
        });
})
//get data from main.js and display in browser as JSON  
app.get("/api/main",function (req,res,next) {
    main.starts().then(function (data) {
        res.send(data)
    })
});

app.get("/api/new",function (req,res,next) {
    new_js.starts().then(function (data) {
        // const dbConnect = dbo.getDb();
        // // insert many
        // dbConnect.collection('new').insertMany(data, function (err, result) {
        //     if (err) {
        //         console.log(err);
        //     } else {
        //         console.log('Inserted %d documents into the "new" collection. The documents inserted with "_id" are:', result.insertedCount, result.insertedIds);
        //     }
        // });

        res.send({time: new Date(),'data':data})
    })
});

app.get('/', function (req, res, next) {
    // send data to the browser
   
    main.starts().then(function (data) {
        res.render('pages/index', {data: data})
    })
    
})

// /new
app.get('/new', function (req, res, next) {
    // send data to the browser
    new_js.starts().then(function (data) {
        res.render('pages/new', {data: data})
    })
})


app.listen(PORT, function () {
  console.log(`listening on port : ${PORT}`)
})
// dbo.connectToServer(function (err) {
//     if (err) {
//       console.error(err);
//       process.exit();
//     }
  
//     // start the Express server
//     app.listen(PORT, () => {
//       console.log(`Server is running on port: ${PORT}`);
//     });
//   });
