exports.mail = handle;
var Delivery = require('./delivery')
var Bounce = require('./bounce')
var Complaint = require('./complaint')
function handle(msg) {
  switch (msg.notificationType) {
    case "Delivery":
      return Delivery.Delivery(msg);
    case "Bounce":
      return Bounce.Bounce(msg);
    case "Complaint":
      return Complaint.Complaint(msg);
    default:
      return Default(msg);
  }
};

function Default(msg) {
  var o = {
    icon: ":question:",
    name: "Unrecognized",
    text: 'Unrecognized SNS SES message ```' + JSON.stringify(msg, null, 2) + '```',
  };
  return o;
}
