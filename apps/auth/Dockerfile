FROM node:alpine AS development

ARG NODE_ENV=dev
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package.json ./
COPY package-lock.json ./
COPY tsconfig.json tsconfig.json

RUN npm install

COPY apps/auth apps/auth
COPY libs libs

RUN npm run build

FROM node:alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package.json ./
COPY package-lock.json ./

RUN npm install --omit=dev

COPY --from=development /usr/src/app/dist ./dist

CMD [ "node", "dist/apps/auth/main" ]