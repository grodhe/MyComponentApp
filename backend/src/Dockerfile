FROM node:22-alpine

WORKDIR /app

# postgresql-client provides pg_dump, used by the /api/backup endpoint to
# generate a downloadable database backup. Without this, that endpoint
# will fail with "pg_dump is not available" -- see backupService.js.
# RUN apk add --no-cache postgresql-client

COPY package*.json ./

RUN npm install --omit=dev

COPY . .

EXPOSE 3001

CMD ["node","src/server.js"]
