import { Module } from '@nestjs/common';
import { HashService } from './hash.service.js';
import { EncryptionService } from './encryption.service.js';

@Module({
    providers:[
        HashService,
        EncryptionService
    ],
    exports:[
        HashService,
        EncryptionService        
    ]
})
export class SecurityModule {}
