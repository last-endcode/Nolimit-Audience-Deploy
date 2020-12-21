#! /bin/bash
DATE=`date +%F`

printf "\t\t****************\n";
printf "\t\tall_account\n";
printf "\t\t****************\n\n";


backup="/mnt/app/audience-account/backup-audience";
submit="/mnt/data/raw/"
submit2="/mnt/data/exec/"

cp $backup/Twitter-$DATE/* $submit/
cp $backup/Youtube-$DATE/* $submit/
cp $backup/Instagram-$DATE/* $submit/
cp $backup/Facebook-$DATE/* $submit/

cp $backup/Twitter-$DATE/* $submit2/
cp $backup/Youtube-$DATE/* $submit2/
cp $backup/Instagram-$DATE/* $submit2/
cp $backup/Facebook-$DATE/* $submit2/


