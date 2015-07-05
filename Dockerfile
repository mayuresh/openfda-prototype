# Pull base image.
FROM node:0.12

MAINTAINER Anil Allewar <anilallewar@yahoo.co.in>

# Install Bower & Gulp
RUN npm install -g bower gulp

# Define working directory.
WORKDIR /home/openfda

# Add the required files
ADD package.json /home/openfda/package.json
ADD bower.json /home/openfda/bower.json
ADD gulpfile.js /home/openfda/gulpfile.js

# Note that we need all the packages 
ADD ./dist /home/openfda/dist

# Allow bower to run as root; else the dependecies won't be pulled
RUN echo '{ "allow_root": true }' > /root/.bowerrc

# Run npm and bower dependecies
RUN npm install
RUN bower install

# currently only works for development
ENV NODE_ENV development

# Port 8000 for server
EXPOSE 8000 

# Define default task to be used for ["gulp"]; you could specify ["gulp","serve"] if you wanted to use specific task.
CMD ["gulp","serve"]
