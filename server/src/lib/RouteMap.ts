import { RequestHandler, Router } from 'express';

type Method = 'get' | 'post' | 'put' | 'patch' | 'delete';
type Action = RequestHandler[];
type Routes = {
  [path: string]: Record<Method, Action>;
};

class RouteMap {
  public routes: Routes;

  constructor(routes: Routes) {
    this.routes = routes;
  }

  public router(): Router {
    const newRouter = Router();
    const paths = this.getPaths();
    const methods = this.getMethods();

    return newRouter;
  }

  private getPaths(): string[] {
    return Object.keys(this.routes);
  }

  private getMethods(): string[] {
    const methods: string[] = [];
    const paths = this.getPaths();
    paths.forEach((path) => {
      const route = this.routes[path];
      const methodsFromRoutes = Object.keys(route);
      methodsFromRoutes.forEach((method) => {
        if (!methods.includes(method)) {
          methods.push(method);
        }
      });
    });

    return methods;
  }
}

export default RouteMap;
