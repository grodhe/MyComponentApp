if [ "$1" = "-f" ]
then
   sudo docker run --rm -p 8080:80 nginx:alpine
   mkdir data
   mkdir logs
   cd logs/
   mkdir backend
   cd /volume1/MyDockerImages/MyComponentApp
   cp   /volume1/MyDockerImages/bck/.env  /volume1/MyDockerImages/MyComponentApp/.env
   rm /volume1/MyDockerImages/MyComponentApp/docker-compose.yml
   ln -s /volume1/MyDockerImages/MyComponentApp/docker-compose-prod.yml /volume1/MyDockerImages/MyComponentApp/docker-compose.yml
elif [ "$1" = "-help" ]
then
    echo "First tim use -f as a parameter!"
else
        echo "Not building"
fi
sudo docker compose down
sudo docker compose -f docker-compose-prod.yml up --build -d
#sudo docker compose up -d

