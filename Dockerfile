FROM node:14.16.0
WORKDIR /app
COPY package.json /app
RUN npm install --legacy-peer-deps
COPY . /app
RUN npm run build
EXPOSE 5001
CMD ["npm", "run", "start:prod"]
## docker build --no-cache -t ws-alerts-balancer .
## docker run -d -p 5001:5001 -e PORT=5001  --name ws-alerts-balancer-app ws-alerts-balancer
## docker run -d -p 5001:5001 --name ws-alerts-balancer-app ws-alerts-balancer