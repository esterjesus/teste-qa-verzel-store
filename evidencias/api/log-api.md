# Log de execução da API

Gerado em 2026-10-10T16:02:36.216Z por `npm run evidencias`.

## CT25 — GET /api/produtos → HTTP 200

Resposta:

```json
[
  {
    "id": "P001",
    "nome": "Camiseta Essencial",
    "descricao": "Algodão penteado e corte reto.",
    "categoria": "Vestuário",
    "preco": 59.9
  },
  {
    "id": "P002",
    "nome": "Calça Jeans Slim",
    "descricao": "Jeans com elastano e lavagem escura.",
    "categoria": "Vestuário",
    "preco": 139.9
  },
  {
    "id": "P003",
    "nome": "Tênis Casual Urbano",
    "descricao": "Solado de borracha e cabedal em lona.",
    "categoria": "Calçados",
    "preco": 189.9
  },
  {
    "id": "P004",
    "nome": "Boné Aba Curva",
    "descricao": "Ajuste traseiro com fivela metálica.",
    "categoria": "Acessórios",
    "preco": 49.9
  },
  {
    "id": "P005",
    "nome": "Mochila Urbana 20L",
    "descricao": "Compartimento acolchoado para notebook.",
    "categoria": "Acessórios",
    "preco": 100
  },
  {
    "id": "P006",
    "nome": "Kit 3 Pares de Meias",
    "descricao": "Cano médio, algodão com reforço no calcanhar.",
    "categoria": "Vestuário",
    "preco": 29.9
  },
  {
    "id": "P007",
    "nome": "Jaqueta Corta-Vento",
    "descricao": "Tecido leve e repelente à água.",
    "categoria": "Vestuário",
    "preco": 229.9
  },
  {
    "id": "P008",
    "nome": "Garrafa Térmica 750ml",
    "descricao": "Mantém a temperatura por até 12 horas.",
    "categoria": "Acessórios",
    "preco": 50
  }
]
```

## CT25 — GET /api/produtos/P001 → HTTP 200

Resposta:

```json
{
  "id": "P001",
  "nome": "Camiseta Essencial",
  "descricao": "Algodão penteado e corte reto.",
  "categoria": "Vestuário",
  "preco": 59.9
}
```

## CT25 — GET /api/produtos/P999 → HTTP 404

Resposta:

```json
{
  "erro": {
    "codigo": "PRODUTO_NAO_ENCONTRADO",
    "mensagem": "Produto P999 não encontrado."
  }
}
```

## CT01 — POST /api/carrinho/calcular → HTTP 200

Requisição:

```json
{
  "itens": [
    {
      "produtoId": "P002",
      "quantidade": 1
    },
    {
      "produtoId": "P004",
      "quantidade": 2
    }
  ],
  "cupom": "BEMVINDO10"
}
```

Resposta:

```json
{
  "itens": [
    {
      "produtoId": "P002",
      "nome": "Calça Jeans Slim",
      "precoUnitario": 139.9,
      "quantidade": 1,
      "total": 139.9
    },
    {
      "produtoId": "P004",
      "nome": "Boné Aba Curva",
      "precoUnitario": 49.9,
      "quantidade": 2,
      "total": 99.8
    }
  ],
  "subtotal": 239.7,
  "desconto": 23.97,
  "frete": 0,
  "freteGratis": true,
  "valorFaltanteFreteGratis": 0,
  "total": 215.73,
  "cupom": {
    "codigo": "BEMVINDO10",
    "aplicado": true,
    "mensagem": "Cupom aplicado: 10% de desconto nos produtos."
  }
}
```

## CT02 — POST /api/carrinho/calcular → HTTP 200

Requisição:

```json
{
  "itens": [
    {
      "produtoId": "P001",
      "quantidade": 1
    }
  ],
  "cupom": "bemvindo10"
}
```

Resposta:

```json
{
  "itens": [
    {
      "produtoId": "P001",
      "nome": "Camiseta Essencial",
      "precoUnitario": 59.9,
      "quantidade": 1,
      "total": 59.9
    }
  ],
  "subtotal": 59.9,
  "desconto": 5.99,
  "frete": 19.9,
  "freteGratis": false,
  "valorFaltanteFreteGratis": 140.1,
  "total": 73.81,
  "cupom": {
    "codigo": "BEMVINDO10",
    "aplicado": true,
    "mensagem": "Cupom aplicado: 10% de desconto nos produtos."
  }
}
```

## CT03 — POST /api/carrinho/calcular → HTTP 200

Requisição:

```json
{
  "itens": [
    {
      "produtoId": "P001",
      "quantidade": 1
    }
  ],
  "cupom": "  BEMVINDO10  "
}
```

Resposta:

```json
{
  "itens": [
    {
      "produtoId": "P001",
      "nome": "Camiseta Essencial",
      "precoUnitario": 59.9,
      "quantidade": 1,
      "total": 59.9
    }
  ],
  "subtotal": 59.9,
  "desconto": 5.99,
  "frete": 19.9,
  "freteGratis": false,
  "valorFaltanteFreteGratis": 140.1,
  "total": 73.81,
  "cupom": {
    "codigo": "BEMVINDO10",
    "aplicado": true,
    "mensagem": "Cupom aplicado: 10% de desconto nos produtos."
  }
}
```

## CT04/CT27 — POST /api/carrinho/calcular → HTTP 200

Requisição:

```json
{
  "itens": [
    {
      "produtoId": "P001",
      "quantidade": 1
    }
  ],
  "cupom": "XPTO"
}
```

Resposta:

```json
{
  "itens": [
    {
      "produtoId": "P001",
      "nome": "Camiseta Essencial",
      "precoUnitario": 59.9,
      "quantidade": 1,
      "total": 59.9
    }
  ],
  "subtotal": 59.9,
  "desconto": 0,
  "frete": 19.9,
  "freteGratis": false,
  "valorFaltanteFreteGratis": 140.1,
  "total": 79.8,
  "cupom": {
    "codigo": "XPTO",
    "aplicado": false,
    "mensagem": "Cupom inválido."
  }
}
```

## CT05/CT27 — POST /api/carrinho/calcular → HTTP 200

Requisição:

```json
{
  "itens": [
    {
      "produtoId": "P001",
      "quantidade": 1
    }
  ],
  "cupom": "VERAO2026"
}
```

Resposta:

```json
{
  "itens": [
    {
      "produtoId": "P001",
      "nome": "Camiseta Essencial",
      "precoUnitario": 59.9,
      "quantidade": 1,
      "total": 59.9
    }
  ],
  "subtotal": 59.9,
  "desconto": 0,
  "frete": 19.9,
  "freteGratis": false,
  "valorFaltanteFreteGratis": 140.1,
  "total": 79.8,
  "cupom": {
    "codigo": "VERAO2026",
    "aplicado": false,
    "mensagem": "Cupom expirado."
  }
}
```

## CT09 — POST /api/carrinho/calcular → HTTP 200

Requisição:

```json
{
  "itens": [
    {
      "produtoId": "P002",
      "quantidade": 1
    },
    {
      "produtoId": "P001",
      "quantidade": 1
    }
  ]
}
```

Resposta:

```json
{
  "itens": [
    {
      "produtoId": "P002",
      "nome": "Calça Jeans Slim",
      "precoUnitario": 139.9,
      "quantidade": 1,
      "total": 139.9
    },
    {
      "produtoId": "P001",
      "nome": "Camiseta Essencial",
      "precoUnitario": 59.9,
      "quantidade": 1,
      "total": 59.9
    }
  ],
  "subtotal": 199.8,
  "desconto": 0,
  "frete": 19.9,
  "freteGratis": false,
  "valorFaltanteFreteGratis": 0.2,
  "total": 219.7,
  "cupom": null
}
```

## CT10 / BUG-01 — POST /api/carrinho/calcular → HTTP 200

Requisição:

```json
{
  "itens": [
    {
      "produtoId": "P005",
      "quantidade": 2
    }
  ]
}
```

Resposta:

```json
{
  "itens": [
    {
      "produtoId": "P005",
      "nome": "Mochila Urbana 20L",
      "precoUnitario": 100,
      "quantidade": 2,
      "total": 200
    }
  ],
  "subtotal": 200,
  "desconto": 0,
  "frete": 19.9,
  "freteGratis": false,
  "valorFaltanteFreteGratis": 0,
  "total": 219.9,
  "cupom": null
}
```

## CT10 / BUG-01 — POST /api/carrinho/calcular → HTTP 200

Requisição:

```json
{
  "itens": [
    {
      "produtoId": "P008",
      "quantidade": 4
    }
  ],
  "cupom": "BEMVINDO10"
}
```

Resposta:

```json
{
  "itens": [
    {
      "produtoId": "P008",
      "nome": "Garrafa Térmica 750ml",
      "precoUnitario": 50,
      "quantidade": 4,
      "total": 200
    }
  ],
  "subtotal": 200,
  "desconto": 20,
  "frete": 19.9,
  "freteGratis": false,
  "valorFaltanteFreteGratis": 0,
  "total": 199.9,
  "cupom": {
    "codigo": "BEMVINDO10",
    "aplicado": true,
    "mensagem": "Cupom aplicado: 10% de desconto nos produtos."
  }
}
```

## CT11 — POST /api/carrinho/calcular → HTTP 200

Requisição:

```json
{
  "itens": [
    {
      "produtoId": "P007",
      "quantidade": 1
    }
  ]
}
```

Resposta:

```json
{
  "itens": [
    {
      "produtoId": "P007",
      "nome": "Jaqueta Corta-Vento",
      "precoUnitario": 229.9,
      "quantidade": 1,
      "total": 229.9
    }
  ],
  "subtotal": 229.9,
  "desconto": 0,
  "frete": 0,
  "freteGratis": true,
  "valorFaltanteFreteGratis": 0,
  "total": 229.9,
  "cupom": null
}
```

## CT12 — POST /api/carrinho/calcular → HTTP 200

Requisição:

```json
{
  "itens": [
    {
      "produtoId": "P006",
      "quantidade": 5
    },
    {
      "produtoId": "P001",
      "quantidade": 1
    }
  ],
  "cupom": "BEMVINDO10"
}
```

Resposta:

```json
{
  "itens": [
    {
      "produtoId": "P006",
      "nome": "Kit 3 Pares de Meias",
      "precoUnitario": 29.9,
      "quantidade": 5,
      "total": 149.5
    },
    {
      "produtoId": "P001",
      "nome": "Camiseta Essencial",
      "precoUnitario": 59.9,
      "quantidade": 1,
      "total": 59.9
    }
  ],
  "subtotal": 209.4,
  "desconto": 20.94,
  "frete": 0,
  "freteGratis": true,
  "valorFaltanteFreteGratis": 0,
  "total": 188.46,
  "cupom": {
    "codigo": "BEMVINDO10",
    "aplicado": true,
    "mensagem": "Cupom aplicado: 10% de desconto nos produtos."
  }
}
```

## CT15 / BUG-02 — POST /api/carrinho/calcular → HTTP 200

Requisição:

```json
{
  "itens": [
    {
      "produtoId": "P001",
      "quantidade": 5
    }
  ]
}
```

Resposta:

```json
{
  "itens": [
    {
      "produtoId": "P001",
      "nome": "Camiseta Essencial",
      "precoUnitario": 59.9,
      "quantidade": 5,
      "total": 299.5
    }
  ],
  "subtotal": 299.5,
  "desconto": 0,
  "frete": 0,
  "freteGratis": true,
  "valorFaltanteFreteGratis": 0,
  "total": 299.5,
  "cupom": null
}
```

## CT15 / BUG-02 — POST /api/carrinho/calcular → HTTP 200

Requisição:

```json
{
  "itens": [
    {
      "produtoId": "P001",
      "quantidade": 6
    }
  ]
}
```

Resposta:

```json
{
  "itens": [
    {
      "produtoId": "P001",
      "nome": "Camiseta Essencial",
      "precoUnitario": 59.9,
      "quantidade": 6,
      "total": 359.4
    }
  ],
  "subtotal": 359.4,
  "desconto": 0,
  "frete": 0,
  "freteGratis": true,
  "valorFaltanteFreteGratis": 0,
  "total": 359.4,
  "cupom": null
}
```

## CT15 / BUG-02 — POST /api/carrinho/calcular → HTTP 200

Requisição:

```json
{
  "itens": [
    {
      "produtoId": "P001",
      "quantidade": 100
    }
  ]
}
```

Resposta:

```json
{
  "itens": [
    {
      "produtoId": "P001",
      "nome": "Camiseta Essencial",
      "precoUnitario": 59.9,
      "quantidade": 100,
      "total": 5990
    }
  ],
  "subtotal": 5990,
  "desconto": 0,
  "frete": 0,
  "freteGratis": true,
  "valorFaltanteFreteGratis": 0,
  "total": 5990,
  "cupom": null
}
```

## CT17 — POST /api/carrinho/calcular → HTTP 422

Requisição:

```json
{
  "itens": [
    {
      "produtoId": "P001",
      "quantidade": 0
    }
  ]
}
```

Resposta:

```json
{
  "erro": {
    "codigo": "QUANTIDADE_INVALIDA",
    "mensagem": "A quantidade deve ser um número inteiro maior ou igual a 1.",
    "campo": "itens[0].quantidade"
  }
}
```

## CT17 — POST /api/carrinho/calcular → HTTP 422

Requisição:

```json
{
  "itens": [
    {
      "produtoId": "P001",
      "quantidade": 1.5
    }
  ]
}
```

Resposta:

```json
{
  "erro": {
    "codigo": "QUANTIDADE_INVALIDA",
    "mensagem": "A quantidade deve ser um número inteiro maior ou igual a 1.",
    "campo": "itens[0].quantidade"
  }
}
```

## CT17 — POST /api/carrinho/calcular → HTTP 422

Requisição:

```json
{
  "itens": [
    {
      "produtoId": "P001",
      "quantidade": "2"
    }
  ]
}
```

Resposta:

```json
{
  "erro": {
    "codigo": "QUANTIDADE_INVALIDA",
    "mensagem": "A quantidade deve ser um número inteiro maior ou igual a 1.",
    "campo": "itens[0].quantidade"
  }
}
```

## CT26 — POST /api/carrinho/calcular → HTTP 422

Requisição:

```json
{
  "itens": []
}
```

Resposta:

```json
{
  "erro": {
    "codigo": "ITENS_OBRIGATORIOS",
    "mensagem": "Informe ao menos um item.",
    "campo": "itens"
  }
}
```

## CT26 — POST /api/carrinho/calcular → HTTP 422

Requisição:

```json
{
  "itens": [
    "P001"
  ]
}
```

Resposta:

```json
{
  "erro": {
    "codigo": "ITEM_INVALIDO",
    "mensagem": "Cada item deve ser um objeto com produtoId e quantidade.",
    "campo": "itens[0]"
  }
}
```

## CT26 — POST /api/carrinho/calcular → HTTP 422

Requisição:

```json
{
  "itens": [
    {
      "produtoId": "P999",
      "quantidade": 1
    }
  ]
}
```

Resposta:

```json
{
  "erro": {
    "codigo": "PRODUTO_NAO_ENCONTRADO",
    "mensagem": "Produto P999 não encontrado.",
    "campo": "itens[0].produtoId"
  }
}
```

## CT26 — POST /api/carrinho/calcular → HTTP 422

Requisição:

```json
{
  "itens": [
    {
      "produtoId": "P001",
      "quantidade": 1
    },
    {
      "produtoId": "P001",
      "quantidade": 2
    }
  ]
}
```

Resposta:

```json
{
  "erro": {
    "codigo": "ITEM_DUPLICADO",
    "mensagem": "O produto P001 aparece mais de uma vez.",
    "campo": "itens[1].produtoId"
  }
}
```

## CT26 — POST /api/carrinho/calcular → HTTP 400

Requisição:

```json
texto que não é JSON
```

Resposta:

```json
{
  "erro": {
    "codigo": "JSON_INVALIDO",
    "mensagem": "O corpo da requisição deve ser um objeto JSON válido."
  }
}
```

## CT26 — GET /api/carrinho/calcular → HTTP 405

Resposta:

```json
{
  "erro": {
    "codigo": "METODO_NAO_PERMITIDO",
    "mensagem": "O método GET não é permitido nesta rota."
  }
}
```

## CT26 — GET /api/rota-que-nao-existe → HTTP 404

Resposta:

```json
{
  "erro": {
    "codigo": "ROTA_NAO_ENCONTRADA",
    "mensagem": "Rota não encontrada."
  }
}
```

## CT20 — POST /api/pedidos → HTTP 201

Requisição:

```json
{
  "cliente": {
    "nome": "Maria Silva",
    "email": "maria@exemplo.com",
    "cep": "01310-100"
  },
  "itens": [
    {
      "produtoId": "P005",
      "quantidade": 1
    }
  ],
  "cupom": "BEMVINDO10"
}
```

Resposta:

```json
{
  "numero": "VZ-953376",
  "criadoEm": "2026-10-10T16:02:37.083Z",
  "cliente": {
    "nome": "Maria Silva",
    "email": "maria@exemplo.com",
    "cep": "01310100"
  },
  "itens": [
    {
      "produtoId": "P005",
      "nome": "Mochila Urbana 20L",
      "precoUnitario": 100,
      "quantidade": 1,
      "total": 100
    }
  ],
  "subtotal": 100,
  "desconto": 10,
  "frete": 19.9,
  "freteGratis": false,
  "valorFaltanteFreteGratis": 100,
  "total": 109.9,
  "cupom": {
    "codigo": "BEMVINDO10",
    "aplicado": true,
    "mensagem": "Cupom aplicado: 10% de desconto nos produtos."
  }
}
```

## CT10 / BUG-01 — POST /api/pedidos → HTTP 201

Requisição:

```json
{
  "cliente": {
    "nome": "Maria Silva",
    "email": "maria@exemplo.com",
    "cep": "01310-100"
  },
  "itens": [
    {
      "produtoId": "P005",
      "quantidade": 2
    }
  ]
}
```

Resposta:

```json
{
  "numero": "VZ-451283",
  "criadoEm": "2026-10-10T16:02:37.094Z",
  "cliente": {
    "nome": "Maria Silva",
    "email": "maria@exemplo.com",
    "cep": "01310100"
  },
  "itens": [
    {
      "produtoId": "P005",
      "nome": "Mochila Urbana 20L",
      "precoUnitario": 100,
      "quantidade": 2,
      "total": 200
    }
  ],
  "subtotal": 200,
  "desconto": 0,
  "frete": 19.9,
  "freteGratis": false,
  "valorFaltanteFreteGratis": 0,
  "total": 219.9,
  "cupom": null
}
```

## CT16 / BUG-02 — POST /api/pedidos → HTTP 201

Requisição:

```json
{
  "cliente": {
    "nome": "Maria Silva",
    "email": "maria@exemplo.com",
    "cep": "01310-100"
  },
  "itens": [
    {
      "produtoId": "P005",
      "quantidade": 6
    }
  ]
}
```

Resposta:

```json
{
  "numero": "VZ-290233",
  "criadoEm": "2026-10-10T16:02:37.115Z",
  "cliente": {
    "nome": "Maria Silva",
    "email": "maria@exemplo.com",
    "cep": "01310100"
  },
  "itens": [
    {
      "produtoId": "P005",
      "nome": "Mochila Urbana 20L",
      "precoUnitario": 100,
      "quantidade": 6,
      "total": 600
    }
  ],
  "subtotal": 600,
  "desconto": 0,
  "frete": 0,
  "freteGratis": true,
  "valorFaltanteFreteGratis": 0,
  "total": 600,
  "cupom": null
}
```

## CT24 — POST /api/pedidos → HTTP 422

Requisição:

```json
{
  "cliente": {
    "nome": "Maria Silva",
    "email": "maria@exemplo.com",
    "cep": "01310-100"
  },
  "itens": [
    {
      "produtoId": "P005",
      "quantidade": 1
    }
  ],
  "cupom": "XPTO"
}
```

Resposta:

```json
{
  "erro": {
    "codigo": "CUPOM_INVALIDO",
    "mensagem": "Cupom inválido.",
    "campo": "cupom"
  }
}
```

## CT24 — POST /api/pedidos → HTTP 422

Requisição:

```json
{
  "cliente": {
    "nome": "Maria Silva",
    "email": "maria@exemplo.com",
    "cep": "01310-100"
  },
  "itens": [
    {
      "produtoId": "P005",
      "quantidade": 1
    }
  ],
  "cupom": "VERAO2026"
}
```

Resposta:

```json
{
  "erro": {
    "codigo": "CUPOM_EXPIRADO",
    "mensagem": "Cupom expirado.",
    "campo": "cupom"
  }
}
```

## CT21 — POST /api/pedidos → HTTP 422

Requisição:

```json
{
  "cliente": {
    "nome": "",
    "email": "",
    "cep": ""
  },
  "itens": [
    {
      "produtoId": "P005",
      "quantidade": 1
    }
  ]
}
```

Resposta:

```json
{
  "erro": {
    "codigo": "DADOS_INVALIDOS",
    "mensagem": "Existem campos inválidos no pedido.",
    "campos": [
      {
        "campo": "cliente.nome",
        "mensagem": "Informe o nome completo."
      },
      {
        "campo": "cliente.email",
        "mensagem": "Informe o e-mail."
      },
      {
        "campo": "cliente.cep",
        "mensagem": "Informe o CEP."
      }
    ]
  }
}
```

## CT22 — POST /api/pedidos → HTTP 422

Requisição:

```json
{
  "cliente": {
    "nome": "Maria",
    "email": "maria@exemplo",
    "cep": "0131010"
  },
  "itens": [
    {
      "produtoId": "P005",
      "quantidade": 1
    }
  ]
}
```

Resposta:

```json
{
  "erro": {
    "codigo": "DADOS_INVALIDOS",
    "mensagem": "Existem campos inválidos no pedido.",
    "campos": [
      {
        "campo": "cliente.nome",
        "mensagem": "Informe nome e sobrenome."
      },
      {
        "campo": "cliente.email",
        "mensagem": "Informe um e-mail válido."
      },
      {
        "campo": "cliente.cep",
        "mensagem": "Informe um CEP com 8 dígitos."
      }
    ]
  }
}
```

## CT23 — POST /api/pedidos → HTTP 201

Requisição:

```json
{
  "cliente": {
    "nome": "Maria Silva",
    "email": "maria@exemplo.com",
    "cep": "01310100"
  },
  "itens": [
    {
      "produtoId": "P005",
      "quantidade": 1
    }
  ]
}
```

Resposta:

```json
{
  "numero": "VZ-917849",
  "criadoEm": "2026-10-10T16:02:37.192Z",
  "cliente": {
    "nome": "Maria Silva",
    "email": "maria@exemplo.com",
    "cep": "01310100"
  },
  "itens": [
    {
      "produtoId": "P005",
      "nome": "Mochila Urbana 20L",
      "precoUnitario": 100,
      "quantidade": 1,
      "total": 100
    }
  ],
  "subtotal": 100,
  "desconto": 0,
  "frete": 19.9,
  "freteGratis": false,
  "valorFaltanteFreteGratis": 100,
  "total": 119.9,
  "cupom": null
}
```

