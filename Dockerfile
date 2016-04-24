FROM node:5.6.0

COPY package.json /code/
WORKDIR /code
RUN npm install

COPY . /code

EXPOSE 80
CMD ["npm", "start"]
