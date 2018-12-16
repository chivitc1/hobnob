clear
if [ ! -z $1 ]
then
  optFeatureFile=$1
else
  optFeatureFile=""
fi

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
##export $cucumberSpec
export SERVER_PROTOCOL=http
export SERVER_HOSTNAME=localhost
export SERVER_PORT=8080
npx cucumber-js --require-module @babel/register --require spec/cucumber/steps $cucumberSpec
