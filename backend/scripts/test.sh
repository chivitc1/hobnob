#!/bin/bash
# Make sure your backend started already!
clear
echo "-----------------------START TEST------------------------"
export $(grep -v '^#(.+)$' envs/.env | xargs)

# e2e test
optFeatureFile=$1
optLineNumParam=$2
cucumberSpec="$optFeatureFile:$optLineNumParam"

function check_optional_params() {
  # No params => default test all features
  if [ -z $optFeatureFile ]; then
    cucumberSpec="spec/cucumber/features"
  else
    # No Second param => test all scenarios in the feature file
    if [ -z $optLineNumParam ]; then
      cucumberSpec=$optFeatureFile    
    fi
  fi
}

check_optional_params
echo "Spec: $cucumberSpec"
npx cucumber-js --require-module @babel/register --require spec/cucumber/steps $cucumberSpec

echo "-----------------------END TEST------------------------"