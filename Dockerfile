FROM node:lts

WORKDIR /dc

COPY package*.json ./

RUN npm install --only=production

COPY . .

RUN npm install pm2 -g

EXPOSE 8080

CMD ["pm2-runtime", "start", "index.js"]
