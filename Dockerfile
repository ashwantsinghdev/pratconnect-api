FROM node:lts

WORKDIR /dc

COPY package*.json ./

RUN npm install 

COPY . .

RUN npm run build

RUN npm install pm2 -g


EXPOSE 8080

CMD ["pm2-runtime", "dist/index.js"]
