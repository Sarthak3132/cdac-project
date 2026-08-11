FROM node:alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

# Vite bakes these into the JS bundle at build time
ENV VITE_API_URL=http://api.devcompiler.vishalborle.online
ENV VITE_WS_URL=ws://api.devcompiler.vishalborle.online

RUN npm run build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]