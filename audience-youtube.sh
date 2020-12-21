#! /bin/bash
#DATE=`date +%F --date="1 hours ago"`
DATE=`date +%F`

printf "\t\t****************\n";
printf "\t\tYT_account\n";
printf "\t\t****************\n\n";

#TWITTER

pathfile=( `cat "/mnt/app/audience-account/extracontent/youtube-all"` )
saving="/mnt/app/audience-account/buffer_audience"
backup="/mnt/app/audience-account/backup-audience";
submit="/mnt/data/raw/"
token="EAACNojg9j1YBAP48MG3WncZAh3MPjgNKa62x54zeZBW8etUK4lxv8KEmPrmEfuasv4Aouo4k529E1lPT1rkI6eDxkIvkI95FAyVm43OxRIMfg6P5vm0vHX3chalgoJcYQvHCtiayw7ULhKfBfWnJ2FO0AwJChyoFjzTI6X77wHpEY6ZCyHx"

rm $saving/*

for id in "${pathfile[@]}"; do
	wget 'https://www.googleapis.com/youtube/v3/channels?part=statistics&id='$id'&fields=items/statistics/subscriberCount&key=AIzaSyAzqUUyNa0qFTK3z21qtSOIaDjMLmO5f8Y' -O yt-allaccount.json
	#wget 'https://www.googleapis.com/youtube/v3/channels?part=statistics&id='$id'&fields=items/statistics/subscriberCount&key=AIzaSyA2PrTZkF8YsbO7ijIY59UiL5n0w8_SJ1Q' -O yt-allaccount.json
	grep -Po '"subscriberCount": *"\K[^"]*' yt-allaccount.json > result
	file1=`cat result`
	node index.js $DATE $DATE youtube $id $file1 $file1 > values.log
	cat values.log
    printf "\n";
done

echo "DONE For youtube";

#for backup
mkdir -p "$backup/Youtube-$DATE"
#just be carefully if path raw delete by hasile hasile makibaou..
mkdir -p $submit

cp $saving/youtube* $submit/
mv $saving/youtube* "$backup/Youtube-$DATE"


