FROM node:14
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
RUN npm run build
EXPOSE 40325
CMD ["npm", "run", "start:prod"]
## docker build -t ws-alerts-balancer .
## docker run -d -p 40325:40325 -e PORT=40325  --name ws-alerts-balancer-app ws-alerts-balancer