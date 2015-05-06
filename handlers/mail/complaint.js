exports.Complaint = Complaint;

function Complaint(msg) {
  var o = {
    name: "Complaint",
    icon: ':interrobang:',
    text: 'Unsupported SNS SES Complaint message ```' + JSON.stringify(msg, null, 2)  + '```',
  };
  return o;
}
