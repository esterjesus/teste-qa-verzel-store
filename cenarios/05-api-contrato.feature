# language: pt
Funcionalidade: Contrato da API

  @CT25 @api
  Cenário: CT25 - Consulta de produtos
    Quando envio GET /api/produtos
    Então recebo HTTP 200 com os 8 produtos e preços da documentação
    Quando envio GET /api/produtos/P001
    Então recebo HTTP 200 com a "Camiseta Essencial"
    Quando envio GET /api/produtos/P999
    Então recebo HTTP 404 com o código "PRODUTO_NAO_ENCONTRADO"

  @CT26 @api @automatizado
  Esquema do Cenário: CT26 - Erros seguem o formato documentado
    Quando envio <metodo> <rota> com o corpo <corpo>
    Então recebo HTTP <status> com o código "<codigo>"

    Exemplos:
      | metodo | rota                    | corpo                                   | status | codigo                 |
      | POST   | /api/carrinho/calcular  | texto que não é JSON                    | 400    | JSON_INVALIDO          |
      | GET    | /api/rota-inexistente   | -                                       | 404    | ROTA_NAO_ENCONTRADA    |
      | GET    | /api/carrinho/calcular  | -                                       | 405    | METODO_NAO_PERMITIDO   |
      | POST   | /api/carrinho/calcular  | {"itens": []}                           | 422    | ITENS_OBRIGATORIOS     |
      | POST   | /api/carrinho/calcular  | {"itens": ["P001"]}                     | 422    | ITEM_INVALIDO          |
      | POST   | /api/carrinho/calcular  | item com produtoId "P999"               | 422    | PRODUTO_NAO_ENCONTRADO |
      | POST   | /api/carrinho/calcular  | "P001" duas vezes                       | 422    | ITEM_DUPLICADO         |

  @CT27 @api @automatizado
  Cenário: CT27 - Cálculo com cupom inválido não gera erro
    Quando envio POST /api/carrinho/calcular com o cupom "NAOEXISTE"
    Então recebo HTTP 200 com desconto 0
    E cupom.aplicado = false e cupom.mensagem = "Cupom inválido."
