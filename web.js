var express = require('express');
var bodyParser = require('body-parser')
var logfmt = require('logfmt');
var https = require('https');

var slack = require('./slack');
var handlers = require('./handlers');

var app = express();
app.use(logfmt.requestLogger());
app.use(bodyParser.json({ type: 'text/plain' })); // because SNS doesn't type

app.post('/channel/:channel', function(req, res) {
  if (!req.body) {
    console.warn('[WARN] no body received');
    res.send('no body...?');

  } else if (req.body.SubscribeURL) {
    subscribe(req.body, res, '#' + req.params.channel);

  } else if (req.body.Message) {
    message(req.body, res, '#' + req.params.channel);

  } else {
    console.warn('[WARN] meaningless body received.', Object.keys(req.body));
    res.send('wut?');
  }
});

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log('Listening on', port);
});


function subscribe (body, res, channel) {
  var subUrl = body.SubscribeURL;
  console.log('Got subscription request, visiting', subUrl);

  https.get(subUrl, function (result) {
    console.log('Subscribed with ', result.statusCode);
    slack.send({text: 'FYI: I was subscribed to ' + body.TopicArn, chan: channel});
    res.send('i gotcha, amazon');

  }).on('error', function (e) {
    console.log('Error while subscribing:', e.message);
    res.send('sub error!?');
  });
}

function message (body, res, channel) {
  console.log('Got', body.Type, 'via', body.TopicArn, 'timestamped', body.Timestamp,
              'with', body.Message.length, 'bytes');

  var msg = {text: body.Message};
  try {
    var msg = JSON.parse(body.Message);
  } catch (ex) {}

  var opts;
  if (msg.incident) {
    opts = handlers.stackdriver(msg);
  } else if (msg.AlarmName) {
    opts = handlers.cloudwatch(msg);
  } else if (msg.AutoScalingGroupName) {
    opts = handlers.autoscaling(msg);
  } else if (msg.type) {
    opts = handlers.alarm(msg);
    opts.channel = channel;
  } else if (msg.text) {
    opts = handlers.plaintext(msg);
  } else {
    opts = {
      icon: ':interrobang:',
      text: 'Unrecognized SNS message ```' + body.Message + '```',
    };
  }

  if (!opts) {
    console.info('Dropping message on behalf of handler');
    res.send('skipped');
    return;
  }

  if (!opts.name && !opts.rich) {
    opts.name = body.Subject || 'Amazon SNS bridge';
  }

  if (!opts.chan) {
    opts.chan = channel;
  }

  slack.send(opts);
  res.send('thanks for the heads-up');
}
