# Используем официальный Node.js
FROM node:20

# Создаём рабочую директорию
WORKDIR /usr/src/app

# Копируем зависимости
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем весь проект
COPY . .

# Собираем приложение
RUN npm run build

# Открываем порт
EXPOSE 3000

# Запускаем прод
CMD ["npm", "run", "start:prod"]
