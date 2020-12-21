var sugar = require("sugar")
var StoreEngine = require("nolimitid-crawl-storing")
var underscore = require("underscore")
var Counter = require("./libs/Counter")
var Excel = require("excel-wrapper")


var socialMedia = process.argv[2]
var socialId = process.argv[3]
var inputPath = process.argv[4]

var Parser = {
	twitter : function(template,socialId,value){
		template.id_str = socialId
		template.id = socialId
		template.followers_count = value;
		return template;
	},
	facebook : function(template,socialId,value){
		template.id =socialId
		template.likes = value
		return template
	},
	youtube : function(template,socialId,value){
		template.id = socialId
		template.statistics.subscriberCount = value
		return template;
	},
	instagram : function(template,socialId,value){
		template.id = socialId
		template.counts.followed_by = value
		return template;
	},
	parse : function(timestamp,socialMedia,template,socialId,value){
		var realData = this[socialMedia](template,socialId,value)
		realData.timestamp = timestamp - 1
		return realData
	}
}

function getStep(before,after,num){
	return (after - before) / num
}

function getNumberOfDays(dateStart,dateEnd){
	return (dateEnd.getTime() - dateStart.getTime()) / (24 * 1000 * 60 * 60)
 }

function main(){

	var dataTemplate = require("./data/"+socialMedia+".json")
	var metaData = {
		source : "crawl",
		media : socialMedia,
		type : "user"
	}

	var excelData = Excel.read(inputPath)
	underscore.each(excelData, function( row ) {
		var name = row.name
		var value = row.value
		var parsed = Parser.parse(
			Date.create(name).getTime(),
			socialMedia,
			JSON.parse(JSON.stringify(dataTemplate)),
			socialId,
			parseInt(value)
		)
		StoreEngine.inject(metaData,parsed)
	})
	StoreEngine.flushAll()
	setTimeout(function(){
		process.exit()
	},1000)
}

main()
