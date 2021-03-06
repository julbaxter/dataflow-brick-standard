"use strict";

var dataflow = require("dataflow"),
	lodash = require("lodash");

module.exports = dataflow.define({
	inputs: ["input"],
	outputs: ["output"],
	props: {
		text: ""
	},
	process: function() {
		var inPacket = this.inputs.input.popPacket();
		if (inPacket) {
			var result = lodash.template(this.props.text, inPacket.data);
			this.outputs.output.pushPacket(inPacket.clone(result));
		}
	}
});
