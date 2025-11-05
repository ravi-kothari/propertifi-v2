/**
 * MSW Server Setup for Node (Jest Tests)
 */

import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);
