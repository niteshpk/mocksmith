import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
  extendZodWithOpenApi,
} from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

const registry = new OpenAPIRegistry();

/** ---------- Schemas ---------- */
const _ErrorResponse = registry.register(
  'ErrorResponse',
  z.object({
    error: z.string().openapi({ example: 'BadRequest' }),
    message: z.string().openapi({ example: 'Invalid input' }),
    details: z.any().optional(),
  }),
);

const _User = registry.register(
  'User',
  z.object({
    id: z.number().int().openapi({ example: 1 }),
    name: z.string().openapi({ example: 'Leanne Graham' }),
    username: z.string().openapi({ example: 'Bret' }),
    email: z.string().email().openapi({ example: 'lea@example.com' }),
  }),
);

const CreateUserBody = z.object({
  name: z.string(),
  username: z.string(),
  email: z.string().email(),
});
const UpdateUserBody = CreateUserBody.partial();

const _Post = registry.register(
  'Post',
  z.object({
    id: z.number().int().openapi({ example: 1 }),
    userId: z.number().int().openapi({ example: 1 }),
    title: z.string().openapi({ example: 'Hello' }),
    body: z.string().openapi({ example: 'World' }),
  }),
);

const CreatePostBody = z.object({
  userId: z.number().int(),
  title: z.string(),
  body: z.string(),
});
const UpdatePostBody = CreatePostBody.partial();

const _Comment = registry.register(
  'Comment',
  z.object({
    id: z.number().int().openapi({ example: 1 }),
    postId: z.number().int().openapi({ example: 1 }),
    name: z.string(),
    email: z.string().email(),
    body: z.string(),
  }),
);

const CreateCommentBody = z.object({
  postId: z.number().int(),
  name: z.string(),
  email: z.string().email(),
  body: z.string(),
});
const UpdateCommentBody = CreateCommentBody.partial();

const _Todo = registry.register(
  'Todo',
  z.object({
    id: z.number().int().openapi({ example: 1 }),
    userId: z.number().int().openapi({ example: 1 }),
    title: z.string(),
    completed: z.boolean().openapi({ example: false }),
  }),
);

const CreateTodoBody = z.object({
  userId: z.number().int(),
  title: z.string(),
  completed: z.boolean().default(false),
});
const UpdateTodoBody = CreateTodoBody.partial();

/** ---------- helpers for $ref SchemaObjects ---------- */
const ref = (name: string) => ({ $ref: `#/components/schemas/${name}` }) as const;
const refArray = (name: string) =>
  ({ type: 'array', items: { $ref: `#/components/schemas/${name}` } }) as const;

/** ---------- Paths (use $ref in responses to satisfy types) ---------- */
function registerCrudPaths(resource: {
  base: string;
  name: 'User' | 'Post' | 'Comment' | 'Todo';
  createBody: z.ZodTypeAny;
  updateBody: z.ZodTypeAny;
  listQuery?: z.ZodTypeAny;
}) {
  const { base, name, createBody, updateBody, listQuery } = resource;

  // List
  registry.registerPath({
    method: 'get',
    path: base,
    summary: `List ${name}s`,
    request: {
      query: listQuery
        ? (listQuery.openapi({}) as never)
        : (z
            .object({
              _page: z.coerce.number().int().min(1).default(1).openapi({ example: 1 }),
              _limit: z.coerce.number().int().min(1).max(100).default(10).openapi({ example: 10 }),
            })
            .openapi({}) as never),
    },
    responses: {
      200: {
        description: `Array of ${name}`,
        content: { 'application/json': { schema: refArray(name) } },
      },
      400: {
        description: 'Bad Request',
        content: { 'application/json': { schema: ref('ErrorResponse') } },
      },
    },
  });

  // Get by id
  registry.registerPath({
    method: 'get',
    path: `${base}/{id}`,
    summary: `Get ${name} by id`,
    request: { params: z.object({ id: z.coerce.number().int() }) },
    responses: {
      200: {
        description: name,
        content: { 'application/json': { schema: ref(name) } },
      },
      404: {
        description: 'Not Found',
        content: { 'application/json': { schema: ref('ErrorResponse') } },
      },
    },
  });

  // Create
  registry.registerPath({
    method: 'post',
    path: base,
    summary: `Create ${name}`,
    request: {
      body: {
        content: { 'application/json': { schema: createBody } }, // Zod is OK in request
      },
    },
    responses: {
      201: {
        description: `${name} created`,
        content: { 'application/json': { schema: ref(name) } },
      },
      400: {
        description: 'Bad Request',
        content: { 'application/json': { schema: ref('ErrorResponse') } },
      },
    },
  });

  // Update
  registry.registerPath({
    method: 'put',
    path: `${base}/{id}`,
    summary: `Update ${name}`,
    request: {
      params: z.object({ id: z.coerce.number().int() }),
      body: { content: { 'application/json': { schema: updateBody } } },
    },
    responses: {
      200: {
        description: name,
        content: { 'application/json': { schema: ref(name) } },
      },
      400: {
        description: 'Bad Request',
        content: { 'application/json': { schema: ref('ErrorResponse') } },
      },
      404: {
        description: 'Not Found',
        content: { 'application/json': { schema: ref('ErrorResponse') } },
      },
    },
  });

  // Delete
  registry.registerPath({
    method: 'delete',
    path: `${base}/{id}`,
    summary: `Delete ${name}`,
    request: { params: z.object({ id: z.coerce.number().int() }) },
    responses: {
      204: { description: 'No Content' },
      404: {
        description: 'Not Found',
        content: { 'application/json': { schema: ref('ErrorResponse') } },
      },
    },
  });
}

// Users (list can be filtered/paginated)
registerCrudPaths({
  base: '/api/users',
  name: 'User',
  createBody: CreateUserBody,
  updateBody: UpdateUserBody,
});

// Posts (allow filter by userId)
registerCrudPaths({
  base: '/api/posts',
  name: 'Post',
  createBody: CreatePostBody,
  updateBody: UpdatePostBody,
  listQuery: z.object({
    userId: z.coerce.number().int().optional().openapi({ example: 1 }),
    _page: z.coerce.number().int().min(1).default(1),
    _limit: z.coerce.number().int().min(1).max(100).default(10),
  }),
});

// Comments (allow filter by postId)
registerCrudPaths({
  base: '/api/comments',
  name: 'Comment',
  createBody: CreateCommentBody,
  updateBody: UpdateCommentBody,
  listQuery: z.object({
    postId: z.coerce.number().int().optional().openapi({ example: 1 }),
    _page: z.coerce.number().int().min(1).default(1),
    _limit: z.coerce.number().int().min(1).max(100).default(10),
  }),
});

// Todos (allow filter by userId)
registerCrudPaths({
  base: '/api/todos',
  name: 'Todo',
  createBody: CreateTodoBody,
  updateBody: UpdateTodoBody,
  listQuery: z.object({
    userId: z.coerce.number().int().optional().openapi({ example: 1 }),
    _page: z.coerce.number().int().min(1).default(1),
    _limit: z.coerce.number().int().min(1).max(100).default(10),
  }),
});

/** ---------- Export generator ---------- */
export function getOpenApiDocument() {
  const generator = new OpenApiGeneratorV3(registry.definitions);
  return generator.generateDocument({
    openapi: '3.0.0',
    info: {
      title: 'MockSmith API',
      version: '1.0.0',
      description:
        'A MockSmith API built with Express + TypeScript + Zod. Pagination via `_page` & `_limit`.',
    },
    servers: [{ url: '/' }],
  });
}
