#! /bin/bash
DATE=`date +%F`

printf "\t\t****************\n";
printf "\t\tInstagram_account\n";
printf "\t\t****************\n\n";

#TWITTER

pathfile=( `cat "/mnt/app/audience-account/extracontent/jatim-all"` )
saving="/mnt/app/audience-account/buffer_audience"
backup="/mnt/app/audience-account/backup-audience";
submit="/mnt/data/raw/"


rm $saving/*



for id in "${pathfile[@]}"; do
   wget 'https://www.instagram.com/graphql/query/?query_hash=c76146de99bb02f6415203be841dd25a&variables={"id":'$id',"first":"12"}' -O wiwa.json
   cat wiwa.json | jq '.data.user.edge_followed_by.count' > followers    
   count_followers=`cat followers`
   node index.js $DATE $DATE instagram $id $count_followers $count_followers > values.log
   cat values.log
   printf "\n";
done

echo "DONE For instagram";

#for backup
mkdir -p "$backup/Instagram-$DATE"
#just be carefully if path raw delete by hasile hasile makibaou..
mkdir -p $submit

cp $saving/* $submit/
mv $saving/* "$backup/Instagram-$DATE"
