# openfda-prototype

Demo at http://mayuresh.github.io/openfda-prototype/index.html

Prototype built using data from https://open.fda.gov 

** Steps to build the app
`
npm install
gulp build
`

** Steps to run the app
`
gulp serve
`

** Steps to create Docker container and run application in Docker container

The DockerFile also is able to create all dependencies and run "gulp serve"

Here are the docker commands used on the root folder in the application

1. Build the docker image
    => docker build -t openfda-prototype .
2. Run the docker image    
    => docker run -d -p 8000:8000 openfda-prototype 
3. Find out the name of the docker container
    => docker ps
4. Use the docker container name and check logs to see if the server started successfully. Replace <container_name> with the actual value.
    => docker logs -f <<container_name>>
5. Find the IP address of the docker linux virtual VM
    => boot2docker ip 
6. Browse the the contents in the docker image      
    => docker exec -ti <<container id>> /bin/bash
    
You can now browse the application at http://<<ip returned by boot2docker ip>>:8000/index.html    
