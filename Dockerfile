#FROM ubuntu
#RUN apt-get update
#RUN apt-get install -y git nodejs npm nodejs-legacy
#RUN git clone git://github.com/DuoSoftware/DVP-Templates.git /usr/local/src/templates
#RUN cd /usr/local/src/templates; npm install
#CMD ["nodejs", "/usr/local/src/templates/app.js"]

#EXPOSE 8875

FROM node:9.9.0
ARG VERSION_TAG
RUN git clone -b $VERSION_TAG https://github.com/DuoSoftware/DVP-Templates.git /usr/local/src/templates
RUN cd /usr/local/src/templates;
WORKDIR /usr/local/src/templates
RUN npm install
EXPOSE 8875
CMD [ "node", "/usr/local/src/templates/app.js" ]
