var express = require('express');
var router = express.Router();
global.fetch = require('node-fetch');
var cc = require('cryptocompare');
var axios = require('axios');



/* GET home page. */
router.get('/', function(req, res, next) {

    var nb_total_investi = 100000;
    console.log("Investissement initial : " + nb_total_investi);
    var date_first = '2017-12-19';
    var date_last = '2018-02-05';
    var oneDay = 24*60*60*1000;
    var firstDate = new Date(2017,12,19);
    var secondDate = new Date(2018,02,05);
    var nb_jours = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)));
    console.log('Nombre de jours : ' + nb_jours);
    var invest_par_jour = nb_total_investi / nb_jours ;
    console.log('Investissement par jour : ' + invest_par_jour);
    var tab_price = [];

    axios.get('https://api.coindesk.com/v1/bpi/historical/close.json?start='+date_first+'&end='+date_last)
      .then(response => {
        //console.log(response.data);
        //console.log(response.data.bpi);
        var value_string = JSON.stringify(response.data.bpi);
        var new_value = value_string.substr(0);
        var new_json = JSON.parse(new_value);
        tab_price = Object.values(new_json);

        var nb_bitcoin_acquis = 0;
        for (var i = 0; i < nb_jours ; i ++ ) {
            nb_bitcoin_acquis += invest_par_jour * 1 / tab_price[i];
        }

        var mes_sous = nb_bitcoin_acquis * tab_price[nb_jours-1];
        console.log("Bitcoin possédé : " + nb_bitcoin_acquis);
        console.log("Cours du bitcoin le dernier jour : " + tab_price[nb_jours-1]);
        console.log("Investissement final : " + mes_sous);
      })
      .catch(error => {
        console.log(error);
      });

    // Basic Usage:
    /*cc.priceHistorical('BTC', ['USD', 'EUR'], new Date('2017-01-01'))
    .then(prices => {
      console.log(prices)
    })
    .catch(console.error)*/
  res.render('index', { title: 'Express' });
});

module.exports = router;
