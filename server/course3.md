# deploy

add .env
```
DATABASE_URL = mysql://mysql:mysql@localhost:5432/kacoro
REDIS_URL = 127.0.0.1:6379
POST = 4000
```


gen env types and example
```
npx gen-env-types .env -o src/types/env.d.ts -e .
```


```
npx typeorm migration:generate -n Initial
```

