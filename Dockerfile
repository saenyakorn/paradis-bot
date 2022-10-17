FROM node:18-alpine As build
# Create app directory
WORKDIR /usr/src/app
COPY --chown=node:node package.json yarn.lock ./
# Install dependencies
RUN yarn install --fronzen-lockfile
# Bundle app source
COPY --chown=node:node . .
# Use the node user from the image (instead of the root user)
RUN yarn build

FROM node:18-alpine As prod-dependencies
# Create app directory
WORKDIR /usr/src/app
COPY --chown=node:node package.json yarn.lock ./
# Install production dependencies
RUN yarn install --fronzen-lockfile --production

FROM node:18-alpine As production

# Copy the bundled code from the build stage to the production image
COPY --chown=node:node package.json yarn.lock ./
COPY --chown=node:node prisma ./
COPY --chown=node:node --from=prod-dependencies /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist
# Generate Prisma Client
RUN yarn prisma generate
# Start the server using the production build
CMD ["yarn", "docker-start"]
