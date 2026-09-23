# Ideia para prompt no Gemini.

Oi, Gemini. Quero um sistema web, utilizando Supabase como base de dados, api de DB e autenticação, GitHub Pages com múltiplas páginas e Bootstrap de CSS, com os seguintes requisitos:

O sistema servirá para a conferência de material carga de alguns setores onde trabalho. O material será carregado via arquivo .csv.

No momento, preciso das seguintes tabelas:

- Tabela de usuário
Para cadastro dos usuários
ID
Nome de Guerra
Nome Completo
Posto / Graduação
Perfil
Usuário
Senha
E-Mail
Data de Criação
Data de Modificação

- Tabela de Conferência
Para cadastro da conferência de material carga
ID
Nome da Conferência
Descrição da Conferência
Situação
Data de Criação
Data de Modifição
Criado Por
Alterado Por

- Tabela de Material
Para o cadastro dos itens de cada conferência
ID
ID da Conferência
BMP
Descrição
Situação
Detalhes
Foto
Data de Criação
Data de Modificação
Criado Por
Alterado Por

Quando tiver duas conferências ou mais, preciso também criar um método de comparação entre duas conferências.

## Requisitos:
- Tela de Login
- Tela de Cadastro de Usuário
- Tela de Configuração de Usuário
- Tela de Cadastro de Conferência de Material Carga
- Tela de Carregamento de Material Carga (arquivo .csv)
- Tela de Conferência de Material Carga
- Tela de Extratos
- Tela de Relatórios de Material Carga.

## Descrição das Telas
### Tela de login
Tela responsiva com login e senha.

### Tela de Cadastro de Usuário
Acessível somente aos usuários com perfil Administrador
- Permite cadastrar um e-mail e uma senha, com requisito mínimo de segurança.
- Permite listar os usuários cadastrados.
- Permite alterar a senha de qualquer usuário.
- Permite excluir ou desativar outros usuários.

### Tela de Configuração de Usuário
Acessível por todos os perfis.
- Permite alterar a senha cadastrada, com requisito mínimo de segurança.

### Tela de Cadastro de Conferência de Material Carga
Acessível somente aos usuários com perfil Administrador ou Chefe
- Permite cadastrar a Conferência Anual
- Permite listar as Conferências cadastradas
- Permite alterar a situação das Conferências cadastradas.

### Tela de Carregamento de Material Carga
Acessível somente aos usuários com perfil Administrador ou Chefe
- Permite listar e selecionar a Conferência Anual já cadastrada
- Para a conferência selecionada,se não estiver arquivada ou concluída, permite realizar upload de arquivo .csv

### Tela de Conferência de Material Carga
Acessível para todos os perfis
- Permite selecionar a Conferência Ativa e listar seus itens
- Permite selecionar o item e alterar situação
- Permite incluir detalhes e documentos
- Permite incluir foto

### Tela de Extrato
Acessível para todos os perfis
- Mostra as conferências existentes e suas situações
- Ao selecionar uma conferência, mostra o quantitativo absoluto e proporcional de cada situação de item

### Tela de Relatório de Material Carga
Acessível para todos os perfis
- Ao selecionar uma conferência, permite gerar um relatório de cada situação, tanto em .pdf quanto em .csv
