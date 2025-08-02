
# 1️⃣ Copy Required Assets
After building, run:
```bash
npm run build
cp -r .next/static .next/standalone/.next/
cp -r public .next/standalone/
```
then start
```bash
node .next/standalone/server.js
```