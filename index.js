var sugar = require("sugar")
var StoreEngine = require("nolimitid-crawl-storing")
var underscore = require("underscore")
var Counter = require("./libs/Counter")
var BufferStore                 = require("nolimitid-crawl-storing")

var dateStart = process.argv[2]
var dateEnd = process.argv[3]
var socialMedia = process.argv[4]
var socialId = process.argv[5]
var valueStart = parseInt(process.argv[6])
var valueEnd = parseInt(process.argv[7])
var BUFFER_PATH         = process.env.BUFFER_PATH || "/mnt/app/audience-account/buffer_audience/"

var Parser = {
        twitter : function(template,socialId,value){
                template.id_str = socialId
                template.id = socialId
                template.followers_count = value;
                template.object.content = socialId;
                return template;
        },
        facebook : function(template,socialId,value){
                template.id =socialId
                template.likes = value
        template.object.content = socialId;
                return template
        },
        youtube : function(template,socialId,value){
                template.id = socialId
                template.statistics.subscriberCount = value
        template.object.content = socialId;
                return template;
        },
        instagram : function(template,socialId,value){
                template.id = socialId
                template.counts.followed_by = value
        template.object.content = socialId;
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
        BufferStore.setOutputDir(BUFFER_PATH)
        var dataTemplate = require("./data/"+socialMedia+".json")
        var metaData = {
                source : "crawl",
                media : socialMedia,
                type : "user"
        }

        var dateStartObj = Date.create(dateStart)
        var dateEndObj = Date.create(dateEnd).advance({day:1})
        var numberOfDay = getNumberOfDays(dateStartObj,dateEndObj)
        var step = getStep(valueStart,valueEnd,numberOfDay)
        var currentValue = valueStart
        while(dateStartObj.getTime() <= dateEndObj.getTime()){
                currentValue = Counter.getApproximateValue(currentValue,step)
                console.log(currentValue)
                var parsed = Parser.parse(
                        dateStartObj.getTime(),
                        socialMedia,
                        JSON.parse(JSON.stringify(dataTemplate)),
                        socialId,
                        currentValue
                )
                StoreEngine.inject(metaData,parsed)
                dateStartObj.advance({day : 1})
        }
        StoreEngine.flushAll()
        setTimeout(function(){
                process.exit()
        },1000)
}

main()
