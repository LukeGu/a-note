import {
  ExecutionContext,
  Injectable,
  Logger,
  CallHandler,
  NestInterceptor,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const start = Date.now();

    if (request) {
      const method = request.method;
      const url = request.url;
      return next
        .handle()
        .pipe(
          tap(() =>
            Logger.log(
              `${method} ${url} ${Date.now() - start}ms`,
              context.getClass().name,
            ),
          ),
        );
    } else {
      const cxt: any = GqlExecutionContext.create(context);
      const resolverName = cxt.constructorRef.name;
      const info = cxt.getInfo();
      return next
        .handle()
        .pipe(
          tap(() =>
            Logger.log(
              `${info.parentType} ${info.fieldName} ${Date.now() - start}ms`,
              resolverName,
            ),
          ),
        );
    }
  }
}
