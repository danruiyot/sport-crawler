const axios = require("axios");
const cheerio = require("cheerio");
const url = "https://m.forebet.com/en/football-tips-and-predictions-for-today";
const { Worker, isMainThread, parentPort } = require("worker_threads");

function starts(){
  return fetchData(url).then((res) => {
 
  const html = res.data;
  const $ = cheerio.load(html);
  let myData = [];
  let coun = 0;
  const table = $(" table.tblen> tbody >tr");
  // console.log(table.text());

  table.each(function () {
    //date_bah
    let teams = $(this).find(".tnms a").text().trim();
    let dates = $(this).find(".date_bah").text().trim();
    let tip = $(this).find("td>span.forepr").text().trim();
    let avgGoals = $(this).find("td:nth-of-type(7)").text().trim();
    if (avgGoals > 4.5) {
      avg = 4.5;
    } else if (avgGoals <= 4.5 && avgGoals >= 3.5) {
      avg = 3.5;
    } else if (avgGoals <= 3.5 && avgGoals >= 2.5) {
      avg = 2.5;
    } else if (avgGoals <= 2.5 && avgGoals >= 1.5) {
      avg = 1.5;
    } else if (avgGoals <= 1.5 && avgGoals >= 0.5) {
      avg = 0.5;
    } else {
      avg = 0;
    }
    let result = $(this).find("td>span.lscrsp").text().trim();

    let homeandaway = teams.split(/\n/);
    let res = {
      date: dates,
      teams: {
        home: homeandaway[0],
        away: homeandaway[1],
      },
      results: result,
      avg: avg,
      tip: tip,
    };

    if (dates) {
      // coun ++;
      // // console.log(res);
      myData.push(res);
    }
  });

  console.log(myData);
  return myData;
});
}
async function fetchData(url) {
  console.log("Crawling data..."); 
  let response = await axios(url).catch((err) => console.log(err));

  if (response.status !== 200) {
    console.log("Error occurred while fetching data");
    return;
  }
  return response;
}
module.exports = {
    starts,
};
