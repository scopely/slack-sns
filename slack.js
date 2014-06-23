var https = require('https');

exports.send = function (opts) {
  var options = {
    host: process.env.SLACK_TEAM + '.slack.com',
    port: 443,
    method: 'POST',
    path: '/services/hooks/incoming-webhook?token=' + encodeURIComponent(process.env.SLACK_TOKEN),
    headers: {'Content-type': 'application/json'},
  };

  var req = https.request(options, function (res) {
    res.on('data', function (data) {
      console.log('Slack said', data);
    }).setEncoding('utf8');
  });

  req.write(JSON.stringify(clean(opts)));
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
