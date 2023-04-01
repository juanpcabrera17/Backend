import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductosModule } from './productos/productos.module';

@Module({
	imports: [
		ProductosModule,
		MongooseModule.forRoot(
			'mongodb+srv://juanpablocabrera:OoXG4Lns64acZsFs@cluster0.sail1ko.mongodb.net/?retryWrites=true&w=majority',
		),
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
