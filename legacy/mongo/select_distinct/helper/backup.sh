   # user local system defines
   ADMINPATH=~/dat
   MONGO_DBNAME=sgmc_dev
   DAY=`/bin/date +%Y%m%d_%H%M%S`
   echo "Creating MONGO DUMP: mongo_$DAY.tar"
   mongodump --db $MONGO_DBNAME --out $ADMINPATH/mongo_$DAY
   cd $ADMINPATH/mongo_$DAY/
   tar -cvzf "$ADMINPATH/mongo_$DAY.tar" $MONGO_DBNAME/
   echo "file written to $ADMINPATH"