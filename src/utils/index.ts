import { Router, Request, Response, NextFunction } from "express";

type Wrapper = (router: Router) => void;

export type Handler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void> | void;

export type Route = {
  path: string;
  method: string;
  handler: Handler | Handler[];
};

export const applyMiddleware = (
  middlewareWrappers: Wrapper | Wrapper[],
  router: Router
): void => {
  const wrapperArray = Array.isArray(middlewareWrappers)
    ? middlewareWrappers
    : [middlewareWrappers];
  for (const wrapper of wrapperArray) {
    wrapper(router);
  }
};

export const applyRoutes = (routes: any, router: Router): void => {
  console.log("____________________routes____________________", routes);
  console.log("____________________routes____________________", routes);
  const routesArray = Array.isArray(routes) ? routes : [routes];

  for (const route of routesArray) {
    const { method, path, handler } = route;
    const handleArray = Array.isArray(handler) ? handler : [handler];
    (router as any)[method](
      path,
      handleArray.map(
        (handler): Handler => async (req, res, next): Promise<void> => {
          try {
            await handler(req, res, next);
          } catch (error) {
            next(error);
          }
        }
      )
    );
  }
};
