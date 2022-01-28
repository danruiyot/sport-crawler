const axios = require('axios');
const cheerio = require('cheerio');
const url = "https://mybet.tips/";
const { Worker, isMainThread, parentPort }  = require('worker_threads');


function starts(){
    return fetchData(url).then( (res) => {
        const html = res.data;
        const $ = cheerio.load(html);
        let myData=[];
        let coun = 0;
        const table = $('table.table-standings > tbody >tr');
          // console.log(table.text());
    
        table.each(function() {
            tip = "";
            color = "";
            let status = $(this).find('td:nth-of-type(1)').text().trim();
            let playing = $(this).find('.playing').text().trim();
            let home = $(this).find('td:nth-of-type(2)').text().trim();
            let results = $(this).find('td:nth-of-type(3)').text().trim();
            let away = $(this).find('td:nth-of-type(4)').text().trim();
            let tips = $(this).find('td.pred').text().trim();
            let tipwin = $(this).find('td.pred_succes').text().trim();
            let tiploss = $(this).find('td.pred_error').text().trim();
    
            if (playing) {
                status = playing;
            }
            if (tips) {
                tip = tips;
                results = "";
                
            }else{
                if (tipwin) {
                    tip = tipwin;
                    color = "green";
                }else{
                    tip = tiploss;
                    color = "red";
                }
            }
    
    
           
    
            let res = {
                "status":status,
                "teams":
                {
                    "home": home,
                    "away": away
                } ,
                "tip":tip,
                "color": color,
                "result" : results
            }
    
            if (home && tip && away) {
            // coun ++;
            // console.log(res);
            myData.push( res);
    
            }
    
    
        });
    
            console.log(myData);
      return myData;
    
    })
}

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
module.exports = {
    starts,
};
