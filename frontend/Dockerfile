FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN echo "=== .env.development at build time ===" && cat .env.development || echo "FILE NOT FOUND"

ARG VITE_MODE=production

RUN npm run build -- --mode ${VITE_MODE}

RUN npm install -g serve

EXPOSE 3000

CMD ["serve","-s","dist","-l","3000"]
