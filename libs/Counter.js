var Module = {
	spinValue : function(val,boundary){
		boundary = boundary || 0.5
		var rand = Math.random()
		if(rand > boundary) return val;
		return  0 - val;
	},
	getApproximateValue : function(baseValue,step,jitter){
		jitter = jitter || (step / 2)
		var realJitter = Math.random() * jitter
		var realValue = baseValue + step + this.spinValue(realJitter,0.7)
		return parseInt(realValue.toFixed(0))
	}
}

module.exports = Module