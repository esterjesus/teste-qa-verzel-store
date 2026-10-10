# language: pt
Funcionalidade: Finalização do pedido (checkout)

  @CT20 @automatizado
  Cenário: CT20 - Pedido confirmado com cupom
    Dado que tenho no carrinho 1 "Mochila Urbana 20L" com o cupom "BEMVINDO10"
    Quando finalizo a compra com nome "Maria Silva", e-mail "maria@exemplo.com" e CEP "01310-100"
    Então vejo "Pedido confirmado" e um número no formato "VZ-000000"
    E o resumo mostra desconto de R$ 10,00, frete de R$ 19,90 e total de R$ 109,90
    E o carrinho é esvaziado

  @CT21 @automatizado
  Cenário: CT21 - Campos obrigatórios vazios
    Quando clico em "Confirmar pedido" sem preencher os dados
    Então vejo "Informe o nome completo.", "Informe o e-mail." e "Informe o CEP."
    E continuo na página de checkout

  @CT22 @automatizado
  Esquema do Cenário: CT22 - Dados com formato inválido
    Quando informo o <campo> "<valor>" e confirmo o pedido
    Então vejo a mensagem "<mensagem>"

    Exemplos:
      | campo  | valor          | mensagem                       |
      | nome   | Maria          | Informe nome e sobrenome.      |
      | e-mail | maria@exemplo  | Informe um e-mail válido.      |
      | e-mail | mariaexemplo.com | Informe um e-mail válido.    |
      | CEP    | 1234           | Informe um CEP com 8 dígitos.  |
      | CEP    | 013101000      | Informe um CEP com 8 dígitos.  |
      | CEP    | 0131a100       | Informe um CEP com 8 dígitos.  |

  @CT23
  Esquema do Cenário: CT23 - CEP com e sem hífen
    Quando finalizo a compra com o CEP "<cep>"
    Então o pedido é confirmado e o CEP é gravado como "01310100"

    Exemplos:
      | cep       |
      | 01310-100 |
      | 01310100  |

  @CT24 @api @automatizado
  Esquema do Cenário: CT24 - Pedido com cupom inválido ou expirado
    Quando envio POST /api/pedidos com o cupom "<cupom>"
    Então recebo HTTP 422 com o código "<codigo>"
    E na interface vejo a mensagem "<mensagem>" no checkout

    Exemplos:
      | cupom     | codigo          | mensagem         |
      | XPTO      | CUPOM_INVALIDO  | Cupom inválido.  |
      | VERAO2026 | CUPOM_EXPIRADO  | Cupom expirado.  |
