export type ID = number;

export interface User {
  id: ID;
  name: string;
  username: string;
  email: string;
}

export interface Post {
  id: ID;
  userId: ID;
  title: string;
  body: string;
}

export interface Comment {
  id: ID;
  postId: ID;
  name: string;
  email: string;
  body: string;
}

export interface Todo {
  id: ID;
  userId: ID;
  title: string;
  completed: boolean;
}
