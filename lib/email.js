"use strict";

var dataflow = require("dataflow"),
	aws = require("aws-sdk");

// Configure AWS.
aws.config.update({
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_KEY,
	region: process.env.AWS_REGION
});

module.exports = dataflow.define({
	inputs: ["message"],
	props: {
		address: "",
		subject: ""
	},
	process: function() {
		var inPacket = this.inputs.message.popPacket();
		if (inPacket) {
			var params = {
				Source: process.env.EMAIL_SENDER,
				Destination: {
					ToAddresses: [this.props.address]
				},
				Message: {
					Subject: {
						Data: this.props.subject
					},
					Body: {
						Text: {
							Data: inPacket.data.toString()
						}
					}
				}
			};

			var ses = new aws.SES();
			ses.sendEmail(params, function(err, data) {
				if (err) {
					console.log(err);
				}
			});
		}
	}
});
