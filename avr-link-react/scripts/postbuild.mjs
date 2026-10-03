// GitHub Pages serves plain files, so a deep link like /support would 404.
// Copying index.html to 404.html makes unknown URLs load the app, which then
// routes itself. (support.html / privacy.html now live in public/.)
import { copyFileSync } from 'node:fs';

copyFileSync('docs/index.html', 'docs/404.html');
console.log('postbuild: wrote 404.html');
