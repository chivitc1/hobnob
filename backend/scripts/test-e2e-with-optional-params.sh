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
# export $(grep -v '^#(.+)$' envs/test.env | xargs)

npx cucumber-js --require-module @babel/register --require spec/cucumber/steps $cucumberSpec
