import { ArgumentMetadata, PipeTransform } from "@nestjs/common";

export class MyPipe1 implements PipeTransform{
    transform(value: any, metadata: ArgumentMetadata){
        console.log({value: value}); // coming req --> body
        console.log({metadata: metadata}); // information about coming req --> body

        return "my pipe 1 , return value test";
    }
}
