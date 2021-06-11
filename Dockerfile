FROM node:14-alpine
ENV NODE_ENV PRODUCT
ENV PORT 3000
EXPOSE 3000:3000
WORKDIR /app
COPY . .
RUN  npm i --registry=https://registry.npm.taobao.org
CMD["node", "dist/main.js"]
