#! /bin/bash
DATE=`date +%F`

printf "\t\t****************\n";
printf "\t\tFB_account\n";
printf "\t\t****************\n\n";

#TWITTER

pathfile=( `cat "/mnt/app/audience-account/extracontent/facebook-all"` )
saving="/mnt/app/audience-account/buffer_audience"
backup="/mnt/app/audience-account/backup-audience";
submit="/mnt/data/raw/"
#token="EAACNojg9j1YBAP48MG3WncZAh3MPjgNKa62x54zeZBW8etUK4lxv8KEmPrmEfuasv4Aouo4k529E1lPT1rkI6eDxkIvkI95FAyVm43OxRIMfg6P5vm0vHX3chalgoJcYQvHCtiayw7ULhKfBfWnJ2FO0AwJChyoFjzTI6X77wHpEY6ZCyHx"
#token="EAACNojg9j1YBAIfMZCN5sOmOJdwBikKqNg0u1HnwvAPZCwAYJBIcjPxlKCrJJG12Yw7gPp0BzDQDd2ASFtQwOQV4YBYstSo7teKwZCFaPHRdkjZA4OnZA5QQxxRFVUUQMaXriRv5KuTf8Ad3ldYvJRTNyD7GhYZCavoNGm66Sq7gZDZD"
token="EAACNojg9j1YBABIqVgdBZAVRHeRkWMpRxKfX7mysHtnuZBQ3I4vU7AE1BQZCJB1g1XZAyyfZBiknYEDZCsBpBmDhQC0zJUFrGmLZASO9PN2sgx7pv9zZAbkWUXKFM8omJf0FQwIKRTzXWlG6A8cVwfmTmebF2GpKrjKbvrWzOwzP2wZDZD"

rm $saving/*

for id in "${pathfile[@]}"; do
    wget 'https://graph.facebook.com/'$id'/?fields=fan_count&access_token='$token'' -O fb-allaccount.json
	grep -Po '"fan_count": *\K[^"]*(?=,)' fb-allaccount.json > result
	file1=`cat result`
	node index.js $DATE $DATE facebook $id $file1 $file1 > values.log
	cat values.log
    printf "\n";
done

echo "DONE For facebook";

#for backup
mkdir -p "$backup/Facebook-$DATE"
#just be carefully if path raw delete by hasile hasile makibaou..
mkdir -p $submit

cp $saving/facebook* $submit/
mv $saving/facebook* "$backup/Facebook-$DATE"



