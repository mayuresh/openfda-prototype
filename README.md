# Visualizing data for adverse drug reactions by [XYZ Inc.](http://xyz.com)  

See the Live Demo at  http://mayuresh.github.io/openfda-prototype/index2.html


Prototype built using data from https://open.fda.gov 

You can build the application using "gulp build" and run the application in an node.js express server using "gulp serve".

The DockerFile also is able to create all dependencies and run "gulp serve"

Here are the docker commands used on the root folder in the application

    docker build -t openfda-prototype .
    docker run -ti openfda-prototype

To find the IP address of the container

    docker ps => gives the container id 
    docker inspect <container id> | grep IPAddress => gives IP address
    docker exec <container id> /bin/bash => gives the contents in the docker image

test
