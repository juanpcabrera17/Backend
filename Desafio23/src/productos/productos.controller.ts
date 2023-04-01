import {
	Body,
	Controller,
	Get,
	Post,
	Put,
	Param,
	Delete,
} from '@nestjs/common';
import { Render } from '@nestjs/common/decorators';
import { CreateProductosDto } from 'src/dto/create-productos.dto';
import { Producto } from 'src/interfaces/productos/productos.interface';
import { ProductosService } from './productos.service';

@Controller('productos')
export class ProductosController {
	constructor(private readonly productosService: ProductosService) {}

	@Post()
	async create(@Body() createProductosDto: CreateProductosDto) {
		const { name, price, stock, thumbnail, category } = createProductosDto;
		const producto = await this.productosService.save(
			name,
			price,
			stock,
			thumbnail,
			category,
		);
		console.log(producto);
		return producto;
	}

	@Get()
	async getAllProducts(): Promise<Producto[]> {
		const products = await this.productosService.getAll();
		console.log(products);
		return products;
	}

	@Get(':id')
	async getProduct(@Param('id') id: string) {
		return this.productosService.getById(id);
	}

	@Put(':id')
	async update(
		@Param('id') id: string,
		@Body() createProductosDto: CreateProductosDto,
	) {
		return this.productosService.updateProduct(id, createProductosDto);
	}

	@Delete(':id')
	async deleteById(@Param('id') id: string) {
		this.productosService.deleteById(id);
	}
}
