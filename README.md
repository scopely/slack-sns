Slack/SNS Bridge
================
This [Heroku](https://heroku.com/)-targetted Node.JS app handles receiving
various [Amazon SNS](http://aws.amazon.com/sns/) messages from services like
Cloudwatch, autoscaling, and Stackdriver. Each message is converted into a rich
[Slack](https://slack.com/) message and sent to the specified channel.

Deployment
----------
Deploy the code to Heroku under your own app. This should be as easy as cloning,
running `heroku apps:create <NAME>`, and pushing.

To authorize your application with Slack, go to the
[new integration](https://slack.com/services/new) page and create an Incoming
Webhook. You'll get a url in the format of 
`https://hooks.slack.com/services/TOKEN`. Take note of this token 
and give the Heroku app your Slack information:

```
$ heroku config:set SLACK_TOKEN=yourintegrationtoken
```

(Note that Slack lets you customize your integration's image and name. This
bridge generally overrides the image and name dynamically, so you don't need
to customize the integration for `slack-sns`.)

Once this is set, you just need to add the bridge to your SNS topics. Use the
URL format `https://<slack-sns>.herokuapp.com/channel/noise` to send messages
to the `#noise` channel on Slack.

Creating Handlers
-----------------
Handlers are small functions which take a message in and format it for Slack.

They are defined in `handlers.js` and referenced from `web.js` in the `message`
function. When creating a handler the most important thing to do is return an
object with a `text` field. All other fields are optional. For inspiration and
help making a new handler, check out the existing ones!

License
-------
Apache 2.0. Check out `LICENSE.txt`

Copyright (c) 2014 Scopely
