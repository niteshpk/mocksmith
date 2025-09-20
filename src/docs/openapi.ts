import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
  extendZodWithOpenApi,
} from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { userCreateSchema, userResponseSchema, userUpdateSchema } from '../schemas/user.schema';
import { postCreateSchema, postResponseSchema, postUpdateSchema } from '../schemas/post.schema';
import {
  commentCreateSchema,
  commentResponseSchema,
  commentUpdateSchema,
} from '../schemas/comment.schema';
import { todoCreateSchema, todoResponseSchema, todoUpdateSchema } from '../schemas/todo.schema';

extendZodWithOpenApi(z);

const registry = new OpenAPIRegistry();

// Error component
const ErrorResponse = z.object({
  error: z.string(),
  message: z.string(),
  details: z.any().optional(),
});
registry.registerComponent('schemas', 'ErrorResponse', ErrorResponse);

// List query schemas
const basePage = z.object({
  _page: z.number().int().positive().optional(),
  _limit: z.number().int().positive().max(100).optional(),
});
const usersListQuery = basePage;
const postsListQuery = basePage.extend({ userId: z.number().int().positive().optional() });
const commentsListQuery = basePage.extend({ postId: z.number().int().positive().optional() });
const todosListQuery = basePage.extend({ userId: z.number().int().positive().optional() });

function crudPaths(
  resource: string,
  createSchema: z.ZodTypeAny,
  updateSchema: z.ZodTypeAny,
  responseSchema: z.ZodTypeAny,
  listQuery?: z.ZodTypeAny,
) {
  registry.registerPath({
    method: 'get',
    path: `/api/${resource}`,
    request: listQuery ? { query: listQuery } : undefined,
    responses: {
      200: {
        description: 'List',
        headers: {
          'X-Total-Count': {
            schema: { type: 'string' },
            description: 'Total items for the query (for pagination)',
          },
        },
        content: { 'application/json': { schema: z.array(responseSchema) } },
      },
    },
  });

  registry.registerPath({
    method: 'get',
    path: `/api/${resource}/{id}`,
    request: { params: z.object({ id: z.number() }) },
    responses: {
      200: { description: 'Item', content: { 'application/json': { schema: responseSchema } } },
      404: {
        description: 'Not found',
        content: { 'application/json': { schema: ErrorResponse } },
      },
    },
  });

  registry.registerPath({
    method: 'post',
    path: `/api/${resource}`,
    request: { body: { content: { 'application/json': { schema: createSchema } } } },
    responses: {
      201: { description: 'Created', content: { 'application/json': { schema: responseSchema } } },
    },
  });

  registry.registerPath({
    method: 'put',
    path: `/api/${resource}/{id}`,
    request: {
      params: z.object({ id: z.number() }),
      body: { content: { 'application/json': { schema: updateSchema } } },
    },
    responses: {
      200: { description: 'Updated', content: { 'application/json': { schema: responseSchema } } },
      404: {
        description: 'Not found',
        content: { 'application/json': { schema: ErrorResponse } },
      },
    },
  });

  registry.registerPath({
    method: 'delete',
    path: `/api/${resource}/{id}`,
    request: { params: z.object({ id: z.number() }) },
    responses: {
      204: { description: 'Deleted' },
      404: {
        description: 'Not found',
        content: { 'application/json': { schema: ErrorResponse } },
      },
    },
  });
}

crudPaths('users', userCreateSchema, userUpdateSchema, userResponseSchema, usersListQuery);
crudPaths('posts', postCreateSchema, postUpdateSchema, postResponseSchema, postsListQuery);
crudPaths(
  'comments',
  commentCreateSchema,
  commentUpdateSchema,
  commentResponseSchema,
  commentsListQuery,
);
crudPaths('todos', todoCreateSchema, todoUpdateSchema, todoResponseSchema, todosListQuery);

// API health (unchanged)
const HealthResponse = z.object({
  status: z.string(),
  uptime: z.number(),
  timestamp: z.string(),
  version: z.string(),
  db: z.object({
    ok: z.boolean(),
    quickCheck: z.string(),
  }),
});
registry.registerPath({
  method: 'get',
  path: '/api/health',
  responses: {
    200: {
      description: 'Service health status',
      content: { 'application/json': { schema: HealthResponse } },
    },
  },
});

export function getOpenApiSpec() {
  const generator = new OpenApiGeneratorV3(registry.definitions);
  return generator.generateDocument({
    openapi: '3.0.0',
    info: { title: 'JSONPlaceholder-style API', version: '1.0.0' },
    servers: [{ url: 'http://localhost:3000' }],
  });
}
