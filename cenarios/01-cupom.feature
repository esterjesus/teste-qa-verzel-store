# language: pt
Funcionalidade: Cupom de desconto no carrinho
  Como cliente da Verzel Store
  Quero aplicar um cupom de desconto
  Para pagar menos nas minhas compras

  Contexto:
    Dado que tenho no carrinho 1 "Camiseta Essencial" de R$ 59,90

  @CA01 @CA09 @CT01 @automatizado
  Cenário: CT01 - Aplicar o cupom BEMVINDO10
    Quando aplico o cupom "BEMVINDO10"
    Então vejo a mensagem "Cupom BEMVINDO10 aplicado."
    E o desconto é de R$ 5,99
    E o frete continua R$ 19,90
    E o total é R$ 73,81

  @CA02 @CT02 @CT03 @automatizado
  Esquema do Cenário: CT02/CT03 - Cupom ignora maiúsculas/minúsculas e espaços nas pontas
    Quando aplico o cupom "<codigo>"
    Então o cupom "BEMVINDO10" é aplicado com desconto de R$ 5,99

    Exemplos:
      | codigo           |
      | bemvindo10       |
      | BemVindo10       |
      | "  BEMVINDO10  " |

  @CA03 @CT04 @automatizado
  Cenário: CT04 - Cupom inexistente
    Quando aplico o cupom "XPTO123"
    Então vejo a mensagem "Cupom inválido."
    E o desconto é de R$ 0,00

  @CA04 @CT05 @automatizado
  Cenário: CT05 - Cupom expirado
    Quando aplico o cupom "VERAO2026"
    Então vejo a mensagem "Cupom expirado."
    E o desconto é de R$ 0,00

  @CT06
  Cenário: CT06 - Aplicar cupom com o campo vazio
    Quando clico em "Aplicar cupom" sem informar um código
    Então vejo a mensagem "Informe um cupom."
    E nenhuma requisição de cupom é enviada para a API

  @CA05 @CT07 @automatizado
  Cenário: CT07 - Apenas um cupom por vez
    Dado que apliquei o cupom "BEMVINDO10"
    Então o campo de cupom não fica disponível para um segundo código
    Quando clico em "Remover cupom"
    E aplico o cupom "VERAO2026"
    Então vejo a mensagem "Cupom expirado."
    E o desconto é de R$ 0,00
