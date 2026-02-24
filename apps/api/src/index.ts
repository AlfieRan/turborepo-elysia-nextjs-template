import { app } from './app.js';
import type { App } from './app.js';
import type { User } from './users/types.js';

app.listen(8000);
console.log(`Server running at ${app.server?.url}`);

export type { App, User };
