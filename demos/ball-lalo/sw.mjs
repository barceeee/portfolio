// Runs the Ball-Lalo PHP app inside the browser: PHP 8.2 (WebAssembly) + SQLite in a service worker.
// Requests under /demos/ball-lalo/app/ are executed by PHP; the app's files live in /www,
// and the demo database is kept in /persist (saved in the browser's IndexedDB).
import { PhpCgiWebBase } from './runtime/PhpCgiWebBase.mjs';
import Php82 from './runtime/php8.2-cgi-worker.mjs';
import FILES from './www-files.mjs';

const here = (path) => new URL(path, self.location).href;
const BASE = new URL('./', self.location).pathname; // "/demos/ball-lalo/"

const php = new PhpCgiWebBase(Promise.resolve({ default: Php82 }), {
	version: '8.2',
	prefix: BASE + 'app/',
	docroot: '/www',
	// Images are served as plain static files (copied there by the build), not through PHP.
	exclude: [BASE + 'app/assets/images/'],
	files: FILES.map((file) => {
		const slash = file.lastIndexOf('/');
		return {
			url: here('./www/' + file),
			parent: '/www/' + (slash >= 0 ? file.slice(0, slash + 1) : ''),
			name: slash >= 0 ? file.slice(slash + 1) : file,
		};
	}),
	sharedLibs: [
		{ name: 'php8.2-sqlite.so', url: here('./runtime/php8.2-sqlite.so'), ini: true },
		{ name: 'libsqlite3.so', url: here('./runtime/libsqlite3.so') },
	],
	ini: [
		'date.timezone = Asia/Manila',
		'session.save_path = /persist',
		'display_errors = Off',
		'log_errors = Off',
		'error_reporting = E_ALL & ~E_DEPRECATED & ~E_NOTICE & ~E_WARNING',
	].join('\n'),
	types: {
		css: 'text/css', js: 'text/javascript', png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg',
		gif: 'image/gif', svg: 'image/svg+xml', txt: 'text/plain', json: 'application/json',
	},
});

self.addEventListener('install', (event) => php.handleInstallEvent(event));
self.addEventListener('activate', (event) => php.handleActivateEvent(event));
self.addEventListener('fetch', (event) => php.handleFetchEvent(event));
self.addEventListener('message', (event) => php.handleMessageEvent(event));
