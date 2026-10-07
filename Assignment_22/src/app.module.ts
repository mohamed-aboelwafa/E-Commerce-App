import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { UserModule } from './User/user.module.js';
// import Joi from 'joi';
// import { ConfigModule } from '@nestjs/config';
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from '@nestjs/mongoose';
import { SecurityModule } from './common/security/security.module.js';
import { HashService } from './common/security/hash.service.js';
import { EncryptionService } from './common/security/encryption.service.js';
import { buildSchema } from './common/models/user.model.js';
import {CacheModule} from '@nestjs/cache-manager';
import {Keyv, KeyvCacheableMemory } from 'cacheable';
import {createKeyv} from '@keyv/redis';


export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    UserModule,
    ConfigModule.forRoot({isGlobal: true,}),
    // MongooseModule.forRoot(
    //   "mongodb://localhost:27017/localdb2", 
    //   {
    //     onConnectionCreate:(connection)=>{
    //         connection.on("connected",()=>{console.log('DB connected successfully')});
    //         connection.on("open",()=>{console.log('open')});
            
    //         return connection;
    //     },
    //     serverSelectionTimeoutMS: 5000
    // }),
    MongooseModule.forRootAsync({
        imports: [SecurityModule],
        inject: [ConfigService, HashService, EncryptionService],
        useFactory: (
          configService: ConfigService,
          hashService: HashService, 
          encryptionService: EncryptionService
        )=>{
            buildSchema(hashService, encryptionService)
            return {
              uri: configService.get<string>('DB_URL'),
              onConnectionCreate:(connection)=>{
                  connection.on("connected",()=>{console.log('DB connected successfully')});
                  connection.on("open",()=>{console.log('open')});
                  
                  return connection;
              },
              serverSelectionTimeoutMS: 5000,
            }
        },
    }),
    SecurityModule,
    CacheModule.registerAsync({
      isGlobal:true,
      useFactory:async()=>{
        return {
          stores: [
            createKeyv('redis://127.0.0.1:6379'),
            new Keyv({
              store: new KeyvCacheableMemory({ttl: 60000, lruSize: 5000}),
            }),
          ]
        }
      }
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
