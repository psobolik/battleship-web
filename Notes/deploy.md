# Setup:
```bash
$ pnpm install
```
# Build:
```bash
$ pnpm build
```
# Deploy:
```bash
# Optional; make a backup of the deployed files
$ zip -r backup.zip /var/www/html/battleship/*
# This is not necessary the first time
$ sudo rm /var/www/html/battleship/assets/*
$ sudo rsync --recursive --mkpath ./dist/battleship/ /var/www/html/battleship/
```
