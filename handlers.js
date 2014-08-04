exports.stackdriver = function (msg) {
  var event = msg.incident;

  return {
    name: event.resource_name + ' incident ' + event.state,
    icon: (event.state == 'open') ? ':cloud:' : ':sunny:',
    text: event.summary + ' [<' + event.url + '|info>]',
  };
};

var cwIcons = {
  INSUFFICIENT_DATA: ':open_hands:',
  OK:                ':ok_hand:',
  ALARM:             ':wave:',
};
exports.cloudwatch = function (msg) {
  if (msg.OldStateValue == 'INSUFFICIENT_DATA' && msg.NewStateValue == 'OK') {
    return null; // drop state changes that aren't useful/notable
  }

  return {
    icon: cwIcons[msg.NewStateValue],
    text: 'Description: ' + msg.AlarmDescription + '\r\n>' + msg.NewStateReason,
  };
};

var asIcons = {
  EC2_INSTANCE_TERMINATE:       ':heavy_minus_sign:',
  EC2_INSTANCE_LAUNCH:          ':heavy_plus_sign:',
  EC2_INSTANCE_TERMINATE_ERROR: ':no_entry:',
  EC2_INSTANCE_LAUNCH_ERROR:    ':no_entry:',
};
exports.autoscaling = function (msg) {
  var text = msg.Description;

  if (msg.Details && msg.Details['Availability Zone']) {
    var zone = msg.Details['Availability Zone'];
    text += ' (zone ' + zone + ')';
  }

  if (msg.Cause) {
    text += '\r\n>' + msg.Cause;
  }

  return {
    icon: asIcons[msg.Event.split(':')[1]],
    text: text,
  };
};

exports.plaintext = function (msg) {
  var text = msg.text;
  var icon;

  if (text.match(/(Writes|Reads): UP from/)) {
    icon = ':point_up_2:';
  } else if (text.match(/(Writes|Reads): DOWN from/)) {
    icon = ':point_down:';
  } else if (text.match(/Consumed (Write|Read) Capacity (\d+)% was greater than/)) {
    icon = ':information_desk_person:';
  }

  return {
    icon: icon || ':interrobang:',
    text: text,
  };
}
