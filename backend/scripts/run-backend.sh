clear

export $(grep -v '^#(.+)$' envs/.env | xargs)
export $(grep -v '^#(.+)$' envs/test.env | xargs)
echo $MONGODB_PORT
echo $MONGODB_HOST
echo $MONGODB_PASSWORD
echo "END"
npx nodemon -w src --exec yarn run serve
