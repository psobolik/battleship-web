### Command line
<dl>
<dt><b>pnpm dev</b></dt><dd>Serve site in dev mode, using <b>Vite.</b></dd>
<dt><b>pnpm build (see note)</b></dt><dd>Compile TypeScript with <b>tsc</b>, then build package with <b>Vite</b> in <b>dist</b> folder.</dd>
<dt><b>pnpm preview</b></dt><dd>Serve site from <b>dist</b> folder, using <b>Vite</b>.</dd>
</dl>

### Note
To build for deployment in a subfolder named `battleship` (like we will do on Marconi) use the following command:

`$ pnpm build --base=/battleship --outDir=dist/battleship`

Vite will rewrite the JavaScript and CSS links using that location, and write them into `dist/battleship`.

To view that build

`$ pnpm vite preview --base=/battleship --outDir=dist/battleship`

