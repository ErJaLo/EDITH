# Proyecto EDITH – Backend (Node.js + TypeScript + Express)

Guía rápida para levantar el servidor, desarrollar y ejecutar con Docker.  
Incluye Nginx (reverse proxy) y PostgreSQL vía `docker-compose`.

## Requisitos
- Node.js LTS (18 o 20 recomendado)
- npm / pnpm / yarn (usa uno y sé consistente)
- Docker y Docker Compose
- Git
- Editor con soporte TypeScript (VS Code, etc.)

## Estructura de carpetas sugerida
```
.
├─ src/
│  ├─ api/              # Rutas / handlers Express
│  ├─ config/           # Configuración (db, env, logger)
│  ├─ middleware/
│  ├─ modules/          # Casos de uso / dominio
│  ├─ services/         # Integraciones externas
│  ├─ db/
│  │  ├─ migrations/
│  │  └─ seeders/
│  ├─ utils/
│  ├─ app.ts            # Inicializa Express, middlewares, rutas
│  └─ server.ts         # Arranca servidor HTTP
├─ public/              # Estáticos (si aplica)
├─ docker/              # Configs Docker (nginx.conf, etc.)
├─ test/                # Tests
├─ .github/workflows/   # CI/CD
├─ .env.example
├─ docker-compose.yml
├─ Dockerfile
├─ package.json
├─ tsconfig.json
└─ README.md
```

## Instalación
```bash
npm install          # o pnpm install / yarn install
npm install -D @types/pg  # para tipados de pg
```

## Scripts útiles (ejemplo)
- `npm run dev` — modo desarrollo con recarga (`ts-node-dev`)
- `npm run build` — compilar a `dist/`
- `npm start` — ejecutar compilado (`node dist/server.js`)

Ajusta `package.json` según tu gestor de paquetes.

## Configuración de TypeScript (`tsconfig.json` mínimo)
```jsonc
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "CommonJS",
    "moduleResolution": "Node",
    "rootDir": "src",
    "outDir": "dist",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true
  },
  "include": ["src"]
}
```

## Variables de entorno (`.env.example`)
```
PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://app:app@db:5432/app
```
Copia a `.env` y ajusta credenciales.

## Servidor Express (rutas de prueba)
- `GET /health` → `{ ok: true }`
- `GET /test` → `{ message: "Test OK" }`

Ejemplo mínimo en `src/app.ts`:
```ts
import express from 'express';
const app = express();
app.use(express.json());
app.get('/health', (_req, res) => res.json({ ok: true }));
app.get('/test', (_req, res) => res.json({ message: 'Test OK' }));
export default app;
```

`src/server.ts`:
```ts
import http from 'http';
import app from './app';

const port = process.env.PORT || 3000;
const server = http.createServer(app);

server.listen(port, () => {
  console.log(`API escuchando en http://localhost:${port}`);
});
```

## Docker Compose (API + Postgres + Nginx)
`docker-compose.yml`:
```yaml
version: "3.9"
services:
  api:
    build: .
    command: npm run dev
    ports:
      - "3000:3000"
    env_file: .env
    depends_on:
      - db
    volumes:
      - .:/app
    working_dir: /app

  db:
    image: postgres:16
    restart: unless-stopped
    environment:
      POSTGRES_USER: app
      POSTGRES_PASSWORD: app
      POSTGRES_DB: app
    ports:
      - "5432:5432"
    volumes:
      - db_data:/var/lib/postgresql/data

  nginx:
    image: nginx:1.25
    ports:
      - "80:80"
    volumes:
      - ./docker/nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - api

volumes:
  db_data:
```

Ejemplo `docker/nginx.conf`:
```nginx
events {}
http {
  server {
    listen 80;
    server_name _;
    location / {
      proxy_pass http://api:3000;
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
  }
}
```

### Levantar todo con Docker
```bash
docker-compose up --build
```
- API: http://localhost:3000
- Proxy Nginx: http://localhost:80
- Postgres: localhost:5432 (user/pass/db: app/app/app)

Parar y limpiar:
```bash
docker-compose down        # solo los servicios del compose
# o para todos los contenedores en la máquina:
# docker stop $(docker ps -aq)
# docker rm $(docker ps -aq)
# docker system prune -af   # cuidado: limpia imágenes/volúmenes sin usar
```

## Desarrollo sin Docker
```bash
npm run dev          # levanta API en http://localhost:3000
# en otra terminal, si usas Postgres local, asegúrate de que está corriendo
```

## Notas sobre base de datos
- Cliente: `pg` (`npm install pg`)
- Tipos: `@types/pg` en dev
- Para migrations: escoge tu herramienta (Prisma / TypeORM / Drizzle / Knex) y ubica los archivos en `src/db/migrations/`.

## Testing (sugerido)
- Vitest o Jest + Supertest para endpoints.
- Ruta de smoke test: `GET /health` y `GET /test`.

## CI/CD
- Añade workflows en `.github/workflows` para: lint, test, build, y opcionalmente docker build/push.