FROM node:4.3.2

RUN useradd --user-group --create-home --shell /bin/false app &&\
  npm install --global npm@3.7.5

ENV HOME=/home/app

COPY package.json npm-shrinkwrap.json $HOME/hello/
RUN chown -R app:app $HOME/*

USER app
WORKDIR $HOME/hello
RUN npm install

USER root
COPY . $HOME/hello
RUN chown -R app:app $HOME/*
USER app

CMD [ "npm", "start" ]
