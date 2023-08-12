# Use a Node base image
FROM node:19

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app to the working directory
COPY . .

# Generate prisma schema
RUN npx prisma generate

# Expose the port the app runs on
EXPOSE 5173
EXPOSE 24678

# Command to run the app using Node
CMD ["npm", "run", "dev"]