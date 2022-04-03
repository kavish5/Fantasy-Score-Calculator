yarn install --frozen-lockfile 
yarn build
pm2 restart app.yaml --env=$1
