FROM node:14
WORKDIR /app
COPY package.json package-lock.json /app/
RUN npm install
COPY . /app
RUN npm run build
CMD ["npx", "serve", "-s", "build", "-l", "3000"]
