var bart = require('working-bart').createClient({interval: 0});
var _ = require('underscore');

var handler = function(data, ferd) {

  var stations = {
    '12th' : '12th St. Oakland City Center',
    '16th' : '16th St. Mission',
    '19th' : '19th St. Oakland',
    '24th' : '24th St. Mission',
    'ashb' : 'Ashby',
    'balb' : 'Balboa Park',
    'bayf' : 'Bay Fair',
    'cast' : 'Castro Valley',
    'civc' : 'Civic Center',
    'cols' : 'Coliseum/Oakland Airport',
    'colm' : 'Colma',
    'conc' : 'Concord',
    'daly' : 'Daly City',
    'dbrk' : 'Downtown Berkeley',
    'dubl' : 'Dublin/Pleasanton',
    'deln' : 'El Cerrito del Norte',
    'plza' : 'El Cerrito Plaza',
    'embr' : 'Embarcadero',
    'frmt' : 'Fremont',
    'ftvl' : 'Fruitvale',
    'glen' : 'Glen Park',
    'hayw' : 'Hayward',
    'lafy' : 'Lafayette',
    'lake' : 'Lake Merritt',
    'mcar' : 'MacArthur',
    'mlbr' : 'Millbrae',
    'mont' : 'Montgomery St.',
    'nbrk' : 'North Berkeley',
    'ncon' : 'North Concord/Martinez',
    'orin' : 'Orinda',
    'pitt' : 'Pittsburg/Bay Point',
    'phil' : 'Pleasant Hill',
    'powl' : 'Powell St.',
    'rich' : 'Richmond',
    'rock' : 'Rockridge',
    'sbrn' : 'San Bruno',
    'sfia' : 'San Francisco Intl Airport',
    'sanl' : 'San Leandro',
    'shay' : 'South Hayward',
    'ssan' : 'South San Francisco',
    'ucty' : 'Union City',
    'wcrk' : 'Walnut Creek',
    'wdub' : 'West Dublin',
    'woak' : 'West Oakland'
  };

  if(data.ferd.text === 'map' || data.ferd.text === '') {

    var bartMap = [{
          "fallback": 'BART abbreviations',
          "text": "Usage: `ferd bart` *`powl`* with one of these station codes: ",
          "color": '#ffffff',
          "image_url": "http://i.imgur.com/WM9ROJJ.png",
          "mrkdwn_in": ["text"]
        }];
    ferd.sendMessage({
      channel: data.channel,
      as_user: false,
      username: 'Ferd',
      unfurl_media: true,
      icon_url: 'http://i.imgur.com/2rSS5KP.jpg',
      attachments: JSON.stringify(bartMap),
      mrkdwn: true
    });
  } else {
    var station = data.ferd.text;
    if (stations[station]) {
      var leadingText = 'From *' + stations[station] + '* station:\n\n';
  
      bart.on(station, function (estimates) {

        // collapse trains for the same destination
        var collapse = function (trains) {
          return _.chain(trains)
            .groupBy(function (train) {
              return train.destination;
            })
            .sortBy(function (train) {
              return train.destination;
            });
        };
        
        var lines = collapse(estimates);

        var attachments = _(lines).reduce(function (memo, line) {
              var dest = line[0].destination,
                  times = _(line).reduce(function (memo, train) {
                    return memo.concat('`'+train.minutes+'`');
                    }, []).join(', ');
              var attachment = {
                    "fallback": dest + ' in ' + times + ' minutes.',
                    "text": '*' + dest + '* in ' + times + ' minutes.',
                    "color": line[0].hexcolor,
                    "mrkdwn_in": ["text"]
                  };
              return memo.concat(attachment);
            }, []);
          
        ferd.sendMessage({
          channel: data.channel,
          as_user: false,
          username: 'Ferd',
          icon_url: 'http://i.imgur.com/2rSS5KP.jpg',
          text: leadingText,
          mrkdwn: true,
          attachments: JSON.stringify(attachments)
        });

      });

    } else {
      ferd.sendMessage({
        channel: data.channel,
        as_user: true,
        text: 'There is no Bart station with that station code. Type `ferd bart help` to list Bart station codes.',
        mrkdwn: true
      });
    }
  }
};

module.exports = function(data, ferd) {
  handler(data, ferd);
};