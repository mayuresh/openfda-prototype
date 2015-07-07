# openfda-prototype
Prototype available at public URL

http://162.243.149.238/index.html

Prototype built using data from https://open.fda.gov 

** Steps to build the app
`
npm install
bower install
gulp build
`
** Steps to run the app
gulp serve
`

** Steps to create Docker container and run application in Docker container

The DockerFile also is able to create all dependencies and run "gulp serve"

Here are the docker commands used on the root folder in the application

1. Build the docker image <br>
    => docker build -t openfda-prototype .
2. Run the docker image by mapping the container port 8000 on which the express server is running to port 80 on the linux local VM. <br>  
    => docker run -d -p 80:8000 openfda-prototype
3. Find out the name of the docker container <br>
    => docker ps
4. Use the docker container name and check logs to see if the server started successfully. Replace <container_name> with the actual value.<br>
    => docker logs -f &lt;container_name&gt;
5. Find the IP address of the docker linux virtual VM <br>
    => boot2docker ip 
6. Browse the the contents in the docker image <br>     
    => docker exec -ti &lt;container_name&gt; /bin/bash
    
You can now browse the application at http://&lt;ip returned by boot2docker ip&gt;:80/index.html    
