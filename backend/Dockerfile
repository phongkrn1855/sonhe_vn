FROM node:20-slim

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy source code
COPY . .

# The backend runs on 5001
EXPOSE 5001

CMD ["npm", "start"]
