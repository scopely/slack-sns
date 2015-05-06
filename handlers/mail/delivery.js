prepare = require('./prepare_object');
exports.Delivery = Delivery;

function Delivery(msg) {
  var o = prepare.Prepare();
  o.icon_emoji = ":white_check_mark:";
  o.username = "Deliveried";
  o.attachments.push({
    fallback: "Email delivered to " + msg.delivery.recipients.join(', ') + " at " + msg.delivery.timestamp,
    color: "good",
    title: "Email delivered to " + msg.delivery.recipients.join(', '),
    fields: [{
      title: "Timestamp",
      value: msg.delivery.timestamp,
      short: true,
    }, {
      title: "From",
      value: msg.mail.source,
      short: true,
    }, {
      title: "Message ID",
      value: msg.mail.messageId,
      short: true,
    }, {
      title: "Processing Time",
      value: msg.delivery.processingTimeMillis + "ms",
      short: true,
    }, {
      title: "SMTP Response",
      value: msg.delivery.smtpResponse,
      short: true,
    }, {
      title: "Reporting MTA",
      value: msg.delivery.reportingMTA,
      short: true,
    }, ],
  });
  return o;
}
