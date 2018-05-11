var express = require('express');
var router = express.Router();

var axios = require('axios');

router.get('/', function(req, res, next) {
    res.render('index');
});

router.post('/algo', function(req, res, next) {
    console.log(req.body);
    var nb_total_investi = req.body.price;
    console.log("Investissement initial : " + nb_total_investi);
    var date_first = req.body.date1_submit;
    var date_last = req.body.date2_submit;
    var oneDay = 24*60*60*1000;
    var split_first = date_first.split("-");
    var split_last = date_last.split("-");
    var firstDate = new Date(split_first[0],split_first[1],split_first[2]);
    var secondDate = new Date(split_last[0],split_last[1],split_last[2]);
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

        res.render('index', { invest: nb_total_investi, invest_jour: invest_par_jour, btc: nb_bitcoin_acquis, cours_last: tab_price[nb_jours-1], invest_final: mes_sous});
      })
      .catch(error => {
        console.log(error);
      });
});


module.exports = router;
