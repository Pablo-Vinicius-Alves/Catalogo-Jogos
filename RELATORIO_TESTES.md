# Relatório de testes

Ambiente: Node.js 22, MariaDB 10.11 (compatível com MySQL), HTTP real contra a API + banco real.
Saídas completas em `testes/resultado-testes.txt` e `testes/resultado-bruno.txt`.

## 1. Testes automatizados (`npm test`) — 38/38 aprovados

| Recurso | Cenários testados | Resultado |
|---|---|---|
| Estúdios | criar (201); sem país (400); nome só com espaços (400); JSON inválido (400); listar (200); buscar por id (200); id inexistente (404); id `abc` (400); id `0` (400); atualizar e conferir alteração (200); atualizar inexistente (404); atualizar com corpo inválido (400); excluir (200); excluir inexistente (404) | 14/14 |
| Desenvolvedores | criar (201); nickname repetido (409); estúdio inexistente (400); `estudio_id` como texto (400); listar com nome do estúdio (200); buscar (200); inexistente (404); atualizar (200); atualizar inexistente (404); excluir estúdio com vínculo (409); excluir (200); excluir inexistente (404) | 12/12 |
| Jogos | criar (201); ano inválido (400); estúdio inexistente (400); sem título (400); listar com nome do estúdio (200); buscar (200); inexistente (404); atualizar e conferir (200); atualizar inexistente (404); excluir (200); excluir inexistente (404) | 11/11 |
| Geral | rota inexistente (404) | 1/1 |

## 2. Coleção do Bruno (CLI, ambiente Local) — 15/15 requests, 15/15 asserts

| Pasta | Criar | Listar | Buscar | Atualizar | Excluir |
|---|---|---|---|---|---|
| Estudios | 201 ✓ | 200 ✓ | 200 ✓ | 200 ✓ | 200 ✓ |
| Desenvolvedores | 201 ✓ | 200 ✓ | 200 ✓ | 200 ✓ | 200 ✓ |
| Jogos | 201 ✓ | 200 ✓ | 200 ✓ | 200 ✓ | 200 ✓ |

## 3. Correção encontrada durante os testes

`estudioController.excluir` chamava `estudioModel.excluir`, mas o model exportava `deletar`.
O `DELETE /estudios/:id` falharia com `TypeError`. Corrigido renomeando a função do model para `excluir`
(padrão adotado também nos models de desenvolvedores e jogos).
