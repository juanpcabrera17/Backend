import { ApiProperty } from '@nestjs/swagger';

export class CreateProductosDto {
	@ApiProperty()
	readonly name: string;
	@ApiProperty()
	readonly price: number;
	@ApiProperty()
	readonly stock: number;
	@ApiProperty()
	readonly thumbnail: string;
	@ApiProperty()
	readonly category: string;
}
