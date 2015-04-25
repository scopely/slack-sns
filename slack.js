var https = require('https');

exports.send = function (opts) {
  var options = {
    host: 'hooks.slack.com',
    port: 443,
    method: 'POST',
    path: '/services/' + process.env.SLACK_TOKEN,
    headers: {'Content-type': 'application/json'},
  };

  var req = https.request(options, function (res) {
    res.on('data', function (data) {
      console.log('Slack said', data);
    }).setEncoding('utf8');
  });

  if(!opts.rich) {
    opts = clean(opts);
  }
  req.write(JSON.stringify(opts));
  req.end();
};

function clean (opts) {
  return {
    username: opts.name,
    icon_emoji: opts.icon || ':ghost:',
    text: opts.text,
    channel: opts.chan,
  };
}
