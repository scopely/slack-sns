var handlers = require('./default');
exports.stackdriver = function (msg) {
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
}
