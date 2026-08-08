if [ "$1" = "-f" ]
then
   sudo docker run --rm -p 8080:80 nginx:alpine
   mkdir data
   mkdir logs
   cd logs/
   mkdir backend
elif [ "$1" = "-help" ]
then
    echo "First tim use -f as a parameter!"
else
        echo "Not"
fi
sudo docker compose down
sudo docker compose -f docker-compose-prod.yml up --build
sudo docker compose up -d

