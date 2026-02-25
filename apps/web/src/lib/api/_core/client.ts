import { Treaty, treaty } from '@elysiajs/eden';
import { type App } from '@repo/api';

import { env } from '@/lib/env';

import type { Session } from '../session';

const api: Treaty.Create<App, Session> = treaty<App>(env.API_URL);

export { api };
