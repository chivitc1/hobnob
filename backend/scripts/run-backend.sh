clear

export $(grep -v '^#(.+)$' envs/.env | xargs)
npx nodemon -w src --exec yarn run serve
