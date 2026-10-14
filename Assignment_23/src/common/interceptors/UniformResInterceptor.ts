import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { map, Observable } from "rxjs";


// map
@Injectable()
export class UniformResInterceptor implements NestInterceptor{
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any>{
        console.log("interceptor start");
        console.log("before handler");

        const start = Date.now()


        return next
            .handle()
            .pipe(
                map((res)=>{
                    const {data, message = "success", staus = 200} = res
                    return {
                        message,
                        data,
                        staus,
                    }
                })
            )
    }
}
