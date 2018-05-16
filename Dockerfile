FROM node:carbon
RUN mkdir -p /code
WORKDIR /code
ADD . /code
RUN npm install -g -s --no-progress
RUN yarn
RUN yarn build
RUN yarn cache clean
CMD [ "yarn", "start" ]
EXPOSE 3001
EXPOSE 3002
