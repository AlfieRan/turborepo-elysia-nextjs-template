import { cors } from '@elysiajs/cors';
import { Elysia } from 'elysia';

import { router as adminRouter } from './admin/routes.js';
import { errorHandler } from './core/middleware/error.js';
import { logging } from './core/middleware/logging.js';
import { router as usersRouter } from './users/routes.js';

const app = new Elysia<'/'>()
	.use(cors())
	.use(logging)
	.use(errorHandler)
	.get('/', (): string => 'OK')
	.get('/health', (): string => 'OK')
	.use(adminRouter)
	.use(usersRouter);

type App = typeof app;

export { app, type App };
