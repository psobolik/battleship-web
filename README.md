# Battleship
A non-competitive version of the old Battleship game. <i>You can't lose!</i>

### Command line
<dl>
<dt><b>yarn dev</b></dt><dd>Serve site in dev mode, using <b>Vite.</b></dd>
<dt><b>yarn build</b></dt><dd>Compile TypeScript with <b>tsc</b>, then build package with <b>Vite</b> in <b>dist</b> folder.</dd>
<dt><b>yarn preview</b></dt><dd>Serve site from <b>dist</b> folder, using <b>Vite</b>.</dd>
</dl>

### Note
To build for deployment in a subfolder named `battleship` (like we will do on Marconi) use the following command: 

`$ yarn build --base=/battleship --outDir=dist/battleship`

Vite will rewrite the JavaScript and CSS links using that location, and write them into `dist/battleship`. 

To view that build

`$ yarn vite preview --base=/battleship --outDir=dist/battleship`

### Deploy on Marconi

```
$ git clone http://marconi/gitea/psobolik/battleship-web.git battleship
$ cd battleship/
$ yarn
$ yarn build --base=/battleship --outDir=dist/battleship
$ sudo -u jenkins rsync --recursive ./dist/battleship/ /usr/local/www/battleship/
$ sudo systemctl restart apache2
```
