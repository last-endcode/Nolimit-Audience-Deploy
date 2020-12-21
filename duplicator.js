var fs = require("fs")
var BufferStore = require("nolimitid-crawl-storing")
var underscore = require("underscore")
var Promise = require("bluebird")
var Sugar = require("sugar")
var ThrottleEngine = require("throttle-exec")
var ThrottleInstance = new ThrottleEngine(10)

var inputPath = process.argv[2]
var outputPath = process.argv[3]
var fromDate = process.argv[4]
var toDate = process.argv[5]
var delta = process.argv[6] || 3
if(!fromDate || !toDate){
	throw new Error("Please specify [fromDate] and [toDate]")
}

function clone(data){
	return JSON.parse(JSON.stringify(data))
}

function randomTimestamp(max){
	return Math.floor(Math.random() * max)
}

function createModifiedStream(streamList,fromDate,toDate){
	// var timestampStart = Date.create(fromDate)
	// var timestartEnd = Date.create(toDate)
	var result = []
	// while(timestampStart.getTime() < timestartEnd.getTime()){
		// console.log(timestampStart)
		// var timestamp = timestampStart.getTime()
		underscore.each(streamList,function(stream){
			var clonedData = clone(stream)
			clonedData.timestamp = clonedData.timestamp + randomTimestamp(delta * 1000 * 24 * 60)
			result.push(clonedData)
		})
		// timestampStart.advance({day:delta})
	// }
	return result;
}

function bufferReader(fileName){
	return new Promise(function(resolve,reject){
		fs.readFile(fileName,function(err,data){
			if ( err ) {
				reject(err)
			} else {
				var rawBuffer = data.toString()
				var lines = rawBuffer.split("\r\n")
				var meta = JSON.parse(lines[0])
				var stream = JSON.parse(lines[1])
				resolve({
					metadata : meta,
					stream : stream
				})
			}
		})
	})
}

var performDataModifying = ThrottleInstance.wrap(function(filePath){
	return new Promise(function(resolve){
		bufferReader(filePath).then(function(result){
			console.log("Get",result.stream.length,"stream from",filePath)
			var metadata = result.metadata
			var streamList = result.stream
			var modifiedStreamList = createModifiedStream(streamList,fromDate,toDate)
			console.log("Modified stream from",inputPath,modifiedStreamList.length,"stream")
			underscore.each(modifiedStreamList,function(stream){
				BufferStore.inject(metadata,stream)
			})
			resolve()
		})
	})
})

function main(){
	BufferStore.setBufferSize(10)
	BufferStore.setOutputDir(outputPath+"/")
	try{
		fs.statSync(outputPath)
	}catch(e){
		fs.mkdirSync(outputPath)
	}
	fs.readdir(inputPath,function(err,files){
		console.log("Begin modifying",files.length,"files")
		underscore.each(files,function(fileName){
			var filePath = [inputPath,fileName].join("/")
			return performDataModifying(filePath)			
		})
	})
}

main()