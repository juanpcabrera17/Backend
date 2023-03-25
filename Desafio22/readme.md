# Desafio22

## GraphQL

Modifiqué el ejemplo de persona dado para hacer un CRUD de productos con persistencia en memoria. <br/>

**Queries:**

```
query todos {
  getProductos {
    _id
    name
    price
    thumbnail
    stock
    category
    timestamp
  }
}

query unProducto {
  getById(_id: "378c06666e8ab1f7f020") {
    _id
    name
  }
}

##Ejemplo de filtro por categoria
query categoria{
  getProductos(campo:"category", valor: "antenas"){
    _id
    name
  }
}
```

**Mutaciones:**

```
mutation crear {
  save(datos: {
    name: "Antena Parabolica",
    price: 200,
    stock: 10,
    thumbnail: "https://i.ibb.co/ZSRj4nw/antena-1.png",
		category: "antenas"
  	})
  {
  _id
  name
  }
}

mutation updateProducto{
  replace(_id: "50823db9fca00a9ca349", datos:{
   name: "Antena Parabolica",
    price: 500,
    stock: 10,
    thumbnail: "https://i.ibb.co/ZSRj4nw/antena-1.png",
		category: "antenas"
  	}
  ){
    _id
    name
    price
    thumbnail
    stock
    category
    timestamp
  }
}

mutation eliminarProducto{
  deleteById(_id:"99580564e449c03f9a6c"){
    _id
    name
  }
}
```
