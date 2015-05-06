prepare = require('./prepare_object');
exports.Bounce = Bounce;

function Bounce(msg) {
  var o = prepare.Prepare();
  o.icon_emoji = ":exclamation:";
  o.username = "Bounce";
  msg.bounce.bouncedRecipients.forEach(function(r) {
    var f = [];
    var a = {
      fallback: "Email bounced from " + r.emailAddress + " at " + msg.bounce.timestamp,
      color: "danger",
      title: "Email bounced from " + r.emailAddress,
      fields: f,
    };
    if (r.action) {
      f.push({
        title: "Status",
        value: r.action,
        short: true,
      });
    }
    if (r.status) {
      f.push({
        title: "Status Code",
        value: r.status,
        short: true,
      });
    }
    if (r.diagnosticCode) {
      f.push({
        title: "Diagnostic Code",
        value: r.diagnosticCode,
        short: true,
      });
    }
    f.push({
      title: "Bounce Type",
      value: msg.bounce.bounceType,
      short: true,
    });
    f.push({
      title: "Bounce Subtype",
      value: msg.bounce.bounceSubType,
      short: true,
    });
    f.push({
      title: "Timestamp",
      value: msg.bounce.timestamp,
      short: true,
    });
    f.push({
      title: "Message ID",
      value: msg.mail.messageId,
      short: true,
    });
    f.push({
      title: "Feedback ID",
      value: msg.bounce.feedbackId,
      short: true,
    });
    f.push({
      title: "From",
      value: msg.mail.source,
      short: true,
    });
    if (msg.bounce.reportingMTA) {
      f.push({
        title: "Reporting MTA",
        value: msg.bounce.reportingMTA,
        short: true,
      });
    }
    o.attachments.push(a);
  });
  return o;
}
