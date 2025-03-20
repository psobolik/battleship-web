# Install
```shell
$ pnpm install
```
# Build & deploy
## pop-os
```shell
$ pnpm build
$ sudo rsync --recursive --mkpath --delete ./dist/battleship/ /var/www/html/battleship/
```
# tilde.team

```shell
$ pnpm build --base=/~padeso/battleship --outDir=dist/tilde.team
$ rsync --recursive --mkpath --delete ./dist/tilde.team/ tilde.team:~/public_html/battleship/
```

