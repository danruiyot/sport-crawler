const axios = require('axios');
const cheerio = require('cheerio');
const url = "https://www.zulubet.com/";
const { Worker, isMainThread, parentPort }  = require('worker_threads');

var firebase = require('firebase');


const   firebaseConfig = {
    // #your firebase config
  }

var app = firebase.initializeApp(firebaseConfig);

var database = firebase.database();

var ref = firebase.database().ref('/bets');


fetchData(url).then( (res) => {
    const html = res.data;
    const $ = cheerio.load(html);
    let myData=[];
    let coun = 0;
    const table = $(' table.content_table tr');
       


    table.each(function() {
        // let found = $(this).find('td').text().trim();
        let date = $(this).find('td:nth-of-type(1)').text().trim();
        let homeAway = $(this).find('td:nth-of-type(2)').text().trim();
        let homepred = $(this).find('td:nth-of-type(4)').text().trim();
        let drawpred = $(this).find('td:nth-of-type(5)').text().trim();
        let awaypred = $(this).find('td:nth-of-type(6)').text().trim();
        let tip = $(this).find('td:nth-of-type(7)').text().trim();
        let oddhome = $(this).find('td:nth-of-type(10)').text().trim();
        let odddraw = $(this).find('td:nth-of-type(11)').text().trim();
        let oddaway = $(this).find('td:nth-of-type(12)').text().trim();
        let result = $(this).find('td:nth-of-type(13)').text().trim();
        let color = $(this).attr('bgcolor');

        let homeandaway = homeAway.split(' - ');
        let year = new Date().getFullYear();
        let dateTime = date.slice(0, 12).split(',');
        let time = dateTime[1];
        let res = {
        	
        	"date": dateTime[0]+"-"+year,
        	"time": time,
        	"teams":
        	{
        		"home": homeandaway[0],
        		"away": homeandaway[1]
        	} ,
        	"homePrediction": homepred,
        	"drawPrediction": drawpred,
        	"awayPrediction": awaypred,
        	"tip":tip,
        	"Homeodd":oddhome,
        	"Drawodd":odddraw,
        	"Awyodd":oddaway,
        	"result":result,
        	"color": color
        }

        if (dateTime[0] && time && homeandaway && tip) {

        coun ++;
        // console.log(res);
        myData.push(res);

        }


    });

// var postListRef = firebase.database().ref('posts');
// var newPostRef = postListRef.push();
// newPostRef.set({
//     // ...
// });
        console.log(myData);
  firebase.database().ref('bets/').set(myData);
  
  // ref.push(myData);

})

async function fetchData(url){
    console.log("Crawling data...")
    // make http call to url
    let response = await axios(url).catch((err) => console.log(err));

    if(response.status !== 200){
        console.log("Error occurred while fetching data");
        return;
    }
    return response;
}