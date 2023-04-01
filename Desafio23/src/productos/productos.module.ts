import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductosController } from './productos.controller';
import { ProductosService } from './productos.service';
import { ProductSchema } from 'src/interfaces/productos/productos.interface';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: 'Producto', schema: ProductSchema }]),
	],
	controllers: [ProductosController],
	providers: [ProductosService],
})
export class ProductosModule {}
