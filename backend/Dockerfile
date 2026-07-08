FROM node:22

# Install Python
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        python3 \
        python3-pip \
        python3-venv && \
    ln -sf /usr/bin/python3 /usr/bin/python && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Node dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy application
COPY . .

# Install Python dependencies
RUN pip3 install --no-cache-dir --break-system-packages edge_tts

ENV NODE_ENV=production

EXPOSE 5000

CMD ["npm", "run", "start"]