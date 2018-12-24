clear

# First command param: optional cucumber feature file to test
if [ ! -z $1 ]
then
  optFeatureFile=$1
else
  optFeatureFile=""
fi

# Second command param: optional Scenario line number in cucumber feature file to test
if [ ! -z $2 ] 
then 
    optLineNumParam=":$2"
else
    optLineNumParam=""
fi

if [ ! -z $optFeatureFile ]
then
  cucumberSpec=$optFeatureFile$optLineNumParam
else
  cucumberSpec='spec/cucumber/features'
fi

echo $cucumberSpec
export $(grep -v '^#(.+)$' envs/.env | xargs)
export $(grep -v '^#(.+)$' envs/test.env | xargs)
echo $MONGODB_PORT
echo $MONGODB_HOST
echo $MONGODB_PASSWORD
echo $SERVER_PORT

API_RETRY_INTERVAL=5
until ss -lnt | grep -q :$SERVER_PORT; do
  echo "Waiting api service start..."
  sleep $API_RETRY_INTERVAL
done

npx cucumber-js --require-module @babel/register --require spec/cucumber/steps $cucumberSpec
