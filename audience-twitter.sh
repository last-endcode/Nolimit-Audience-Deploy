#! /bin/bash
DATE=`date +%F`

printf "\t\t****************\n";
printf "\t\tTW_account\n";
printf "\t\t****************\n\n";

#TWITTER

pathfile=( `cat "/mnt/app/audience-account/extracontent/twitter-all"` )
saving="/mnt/app/audience-account/buffer_audience"
backup="/mnt/app/audience-account/backup-audience";
submit="/mnt/data/raw/"

rm $saving/*

for id in "${pathfile[@]}"; do
    wget -O tw-allaccount.json https://cdn.syndication.twimg.com/widgets/followbutton/info.json?user_ids=$id
	grep -Po '"followers_count": *\K[^"]*(?=,)' tw-allaccount.json > result
	file1=`cat result`
	node index.js $DATE $DATE twitter $id $file1 $file1 > values.log
	cat values.log
    printf "\n";
done

echo "DONE For twitter";

#for backup
mkdir -p "$backup/Twitter-$DATE"
#just be carefully if path raw delete by hasile hasile makibaou..
mkdir -p $submit

cp $saving/twitter* $submit/
mv $saving/twitter* "$backup/Twitter-$DATE"

