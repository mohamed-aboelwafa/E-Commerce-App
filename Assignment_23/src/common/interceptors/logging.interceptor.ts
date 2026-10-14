import { CallHandler, ExecutionContext, Injectable, NestInterceptor  } from "@nestjs/common"
import { Observable, tap } from "rxjs"


// tap
@Injectable()
export class LoggingInterceptor implements NestInterceptor{
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any>{
        console.log("interceptor start");
        console.log("before handler");

        const start = Date.now()

        return next
            .handle()
            .pipe(
                tap((res)=>{
                    console.log("after handler")
                    console.log(Date.now() - start)
                    console.log(res)
                })
            )
    }
}
