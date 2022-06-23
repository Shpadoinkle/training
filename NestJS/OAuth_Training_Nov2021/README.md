## TypeORM and postgres setup
https://docs.nestjs.com/techniques/database

## Authentication setup
- JWT: https://docs.nestjs.com/security/authentication
###
Completed section code
https://github.com/nestjs/nest/tree/master/sample/19-auth-jwt

## OAuth2 in NestJS
https://javascript.plainenglish.io/oauth2-in-nestjs-for-social-login-google-facebook-twitter-etc-8b405d570fd2

### passport-google-oauth2 vs passport-google-oauth20 packages
https://stackoverflow.com/questions/55777037/passport-google-oauth2-vs-passport-google-oauth20-packages









## Local Ubuntu postgres server

### Initial setup --> or after a docker purge
docker run -d --name dev-postgres -e POSTGRES_PASSWORD=123 -v ${HOME}/postgres-data/:/var/lib/postgresql/data -p 5432:5432 postgres

docker run -p 80:80 -e 'PGADMIN_DEFAULT_EMAIL=user@domain.local' -e 'PGADMIN_DEFAULT_PASSWORD=SuperSecret' --name dev-pgadmin -d dpage/pgadmin4


go to http://localhost:80

address to local postgres is 172.17.0.2
username postgres


NOTE - If dev-postgres image reports that it its initialised version is incompatable.. delete the postgres folder in home 


^^^ If above address doesnt work, get IPAddress from this command
docker inspect dev-pgadmin -f "{{json .NetworkSettings.Networks }}"

### Second spin up - if no docker purge
- start DockStation and run it that way