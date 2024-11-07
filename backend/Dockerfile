# Node.js bazaviy imidjidan foydalanamiz
FROM node:18-alpine

# Ilova katalogini yaratamiz va unga o'tamiz
WORKDIR /app

# Bog'liqliklarni ko'chirib o'rnatish uchun package*.json fayllarini nusxalash
COPY package*.json ./

# Bog'liqliklarni o'rnatamiz
RUN npm install

# Barcha qolgan ilova fayllarini ko'chiramiz
COPY . .

# TypeScript kodini JavaScript-ga transpile qilamiz
RUN npm run build

# Ilovani 3000 portda ishga tushirish uchun ochamiz
EXPOSE 3000

# Ilovani ishga tushiramiz
CMD ["npm", "run", "start:prod"]