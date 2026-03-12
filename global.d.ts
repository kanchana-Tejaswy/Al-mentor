// shim ambient declarations for modules without types (development convenience)
// install the real @types packages in production for better type safety.

// basic node builtins
declare module "fs";
declare module "path";
declare module "url";
declare module "child_process";
declare module "esbuild";

declare module "http" {
  export type Server = any;
}

// express minimal types
declare namespace Express {
  interface Request { [key: string]: any; }
  interface Response {
    [key: string]: any;
    headersSent?: boolean;
    status?: any;
    json?: any;
  }
  interface NextFunction { (err?: any): void; }
}
declare module "express" {
  function express(): any;
  namespace express {
    function json(options?: any): any;
    function urlencoded(options?: any): any;
  }
  export = express;
  export type { Request, Response, NextFunction };
}

// other modules
declare module "vite";
declare module "vite/client";
declare module "@vitejs/plugin-react";
declare module "@replit/vite-plugin-runtime-error-modal";
declare module "@replit/vite-plugin-cartographer";
declare module "@replit/vite-plugin-dev-banner";
declare module "nanoid";
declare module "express-session";
declare module "passport";
declare module "serverless-http";
declare module "react";
declare module "react-dom";
declare module "lucide-react";
declare module "framer-motion";
declare module "react-markdown";
declare module "date-fns";
declare module "@/lib/utils";

declare module "react";
declare module "react-dom";
declare module "lucide-react";
declare module "framer-motion";
declare module "react-markdown";
declare module "date-fns";
declare module "@/lib/utils";

// database/drizzle/zod
declare module "drizzle-orm" {
  export const sql: any;
}
declare module "drizzle-orm/pg-core" {
  export const pgTable: any;
  export const text: any;
  export const varchar: any;
}
declare module "drizzle-orm/node-postgres" {
  export function drizzle(pool: any): any;
}
declare module "drizzle-zod" {
  export function createInsertSchema(arg: any): any;
}
declare module "zod" {
  export const z: any;
  export type infer<T> = any;
}
declare module "pg" {
  export class Pool { constructor(opts?: any); }
}

// React namespace helpers

declare namespace React {
  type FormEvent = any;
  type KeyboardEvent<T = any> = any;
  type MouseEvent = any;
  type ChangeEvent<T = any> = any;
}

// JSX support for arbitrary tags

declare namespace JSX {
  interface IntrinsicElements { [elem: string]: any; }
  interface ElementAttributesProperty { props: any; }
}

// generic process shim
declare var process: {
  env: { [key: string]: string | undefined };
  exit(code?: number): never;
};
