# language: pt
Funcionalidade: Limite de quantidade e manutenção do carrinho

  @CA10 @CT14 @automatizado
  Cenário: CT14 - Interface limita cada produto a 5 unidades
    Dado que estou na vitrine
    Quando clico 5 vezes em "Adicionar ao carrinho" do "Boné Aba Curva"
    Então o botão "Adicionar ao carrinho" fica desabilitado
    E vejo "Limite de 5 unidades atingido."
    E no carrinho o botão "+" do produto fica desabilitado

  @CA10 @CT15 @api @automatizado @bug @BUG-02
  Cenário: CT15 - API de cálculo rejeita mais de 5 unidades
    Quando envio POST /api/carrinho/calcular com 6 unidades de "P001"
    Então recebo HTTP 422 com o código "QUANTIDADE_MAXIMA_EXCEDIDA"

  @CA10 @CT16 @api @automatizado @bug @BUG-02
  Cenário: CT16 - API de pedidos rejeita mais de 5 unidades
    Quando envio POST /api/pedidos com 6 unidades de "P005" e cliente válido
    Então recebo HTTP 422 com o código "QUANTIDADE_MAXIMA_EXCEDIDA"
    E nenhum número de pedido é gerado

  @CT17 @api
  Esquema do Cenário: CT17 - Quantidade inválida
    Quando envio POST /api/carrinho/calcular com quantidade <quantidade>
    Então recebo HTTP 422 com o código "QUANTIDADE_INVALIDA"

    Exemplos:
      | quantidade |
      | 0          |
      | -1         |
      | 1.5        |
      | "2"        |
      | null       |

  @CT19
  Cenário: CT19 - Remover item e esvaziar o carrinho
    Dado que tenho 2 produtos no carrinho e o cupom "BEMVINDO10" aplicado
    Quando removo um dos produtos
    Então o resumo é recalculado só com o produto restante
    Quando clico em "Esvaziar carrinho"
    Então vejo "Seu carrinho está vazio"
    E o contador do cabeçalho mostra 0
