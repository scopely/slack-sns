var handlers = require('./default');
var mail = require('./mail');
exports.handle = function handle(msg) {
  if (msg.incident) {
    return handlers.stackdriver(msg);
  } else if (msg.AlarmName) {
    return handlers.cloudwatch(msg);
  } else if (msg.AutoScalingGroupName) {
    return handlers.autoscaling(msg);
  } else if (msg.mail) {
    return mail.mail(msg);
  } else if (msg.type) {
    var opts = handlers.alarm(msg);
    opts.channel = channel;
    return opts;
  } else if (msg.text) {
    return handlers.plaintext(msg);
  } else {
    return {
      icon: ':interrobang:',
      text: 'Unrecognized SNS message ```' + msg + '```',
    };
  }
}
