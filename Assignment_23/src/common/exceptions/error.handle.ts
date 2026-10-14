import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from "@nestjs/common"
import { Response } from "express"

 @Catch(HttpException)
export class AppError implements ExceptionFilter {
    catch(excption: HttpException, host:ArgumentsHost){
        const http = host.switchToHttp()
        const req = http.getRequest()
        const res: Response = http.getResponse()
        const status = excption.getStatus()

        Logger.error(excption.stack)

        res.status(status).json({
            errMsg: excption.message, 
            statusCode: status, 
            timeStamp: new Date(Date.now()),
        })
    }
}
