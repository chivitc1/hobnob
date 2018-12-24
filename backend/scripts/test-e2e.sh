#!/bin/bash
clear
export $(grep -v '^#(.+)$' envs/.env | xargs)
export $(grep -v '^#(.+)$' envs/test.env | xargs)
MONGO_URI=$MONGODB_HOST:$MONGODB_PORT
MONGO_START_DELAY=15
RETRY_INTERVAL=2
MONGO_START_DELAY=15
MONGO_NOT_RUNNING=-1

function check_mongo_up() {
  if curl $MONGO_URI | grep -q 'It looks like'; then
    echo "MongoDb started"
    return 0    
  fi
  echo "MongoDb not started"
  return -1
}

#Make sure the port is not already bound
if ss -lnt | grep -q :$SERVER_PORT; then
  echo "Another process is already listening to port $SERVER_PORT"
  exit 1;
fi

# Check Mongodb up
if ! check_mongo_up; then 
  echo "MongoDb not started, wait until mongodb is ready to respond";

  docker-compose -f ../docker-compose.test.yml up -d
  MONGO_NOT_RUNNING=1

  # Wait until Elasticsearch is ready to respond
  until check_mongo_up
  do
    echo "WAITING $((RETRY_INTERNAL)) s..."
    sleep $RETRY_INTERVAL
  done
  echo "Starting server for test"
fi

# Delay run backend for mongodb is completely started
if [ $MONGO_NOT_RUNNING == 1 ]
then 
  echo "Wait for mongo delay start..."
  sleep $MONGO_START_DELAY
fi

# Run backend in background
npx nodemon -w src --exec yarn run serve &

API_RETRY_INTERVAL=5
until ss -lnt | grep -q :$SERVER_PORT; do
  echo "Waiting api service start..."
  sleep $API_RETRY_INTERVAL
done

# Run e2e test
npx cucumber-js --require-module @babel/register --require spec/cucumber/steps spec/cucumber/features

# Shutdown test mongodb
docker-compose -f ../docker-compose.test.yml down

# Terminate backend processes
kill -15 0