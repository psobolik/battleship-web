### Deploy on web server

```
$ pnpm install
$ pnpm build --base=/battleship --outDir=dist/battleship
$ sudo rsync --recursive --mkpath ./dist/battleship/ /var/www/html/battleship/
$ sudo systemctl restart apache2
```
