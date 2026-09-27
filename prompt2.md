# Solicitação: Sistema Web de Conferência de Material Carga (Patrimônio)

Olá, Gemini. Preciso de um sistema web modular (HTML, JavaScript moderno desacoplado e Bootstrap 5), com backend serverless e autenticação via Supabase, hospedável no GitHub Pages. O sistema servirá para conferência de Bens Móveis Patrimoniais (BMP) de setores operacionais a partir de arquivos `.csv`.

---

## 1. Banco de Dados e Segurança (Supabase + PostgreSQL)

### A. Tabela: perfis_usuarios (Vinculada ao auth.users)
- `id` (UUID, PK, references `auth.users(id)` on delete cascade)
- `nome_de_guerra` (TEXT)
- `nome_completo` (TEXT)
- `posto_graduacao` (TEXT)
- `perfil` (ENUM: 'admin', 'chefe', 'tecnico')
- `email` (TEXT)
- `created_at` (TIMESTAMPTZ, default now())
- `updated_at` (TIMESTAMPTZ, default now())

### B. Tabela: conferencias
- `id` (UUID, PK, default gen_random_uuid())
- `titulo` (TEXT, Ex: "Inventário Geral 2026")
- `descricao` (TEXT)
- `conferencia_anterior_id` (UUID, references `conferencias(id)` on delete set null - Aponta para a conferência base anterior)
- `situacao` (TEXT, default 'aberta' - valores: 'aberta', 'concluida', 'arquivada')
- `criado_por` (UUID, references `auth.users(id)`)
- `alterado_por` (UUID, references `auth.users(id)`)
- `created_at` (TIMESTAMPTZ, default now())
- `updated_at` (TIMESTAMPTZ, default now())

### C. Tabela: materiais_conferencia
- `id` (UUID, PK, default gen_random_uuid())
- `conferencia_id` (UUID, references `conferencias(id)` on delete cascade)
- `id_patrimonio` (TEXT, not null - Número BMP)
- `descricao` (TEXT)
- `unidade_setor` (TEXT)
- `dependencia` (TEXT)
- `situacao` (TEXT, default 'nao_encontrado' - valores: 'nao_encontrado', 'encontrado', 'descarregar', 'movimentado')
- `documento_tramitacao` (TEXT - quando preenchido em 'descarregar' vira 'Descarregado'; em 'movimentado' vira 'Movimentado')
- `foto_url` (TEXT - link público da imagem no bucket fotos_patrimonio)
- `detalhes` (TEXT)
- `criado_por` (UUID, references `auth.users(id)`)
- `conferido_por` (UUID, references `auth.users(id)`)
- `created_at` (TIMESTAMPTZ, default now())
- `updated_at` (TIMESTAMPTZ, default now())
- **Restrição:** `UNIQUE(conferencia_id, id_patrimonio)` (garante BMP único dentro da mesma conferência)

*Políticas RLS:* Aplicar Row Level Security para proteger chamadas da API Supabase de acordo com o papel do usuário (`auth.uid()`).

---

## 2. Regras de Negócio e Funcionalidades Específicas

1. **Uploads Múltiplos e Incrementais (Conferência Aberta):**
   - Enquanto a conferência estiver com status `'aberta'`, o chefe/admin pode subir novos arquivos `.csv` a qualquer momento.
   - O sistema deve processar o arquivo ignorando os itens cujo `id_patrimonio` já exista na conferência ativa, inserindo apenas os registros inéditos (estratégia `INSERT ... ON CONFLICT (conferencia_id, id_patrimonio) DO NOTHING`).
   - A interface deve exibir um resumo da importação (ex: "X novos itens adicionados, Y itens repetidos ignorados").

2. **Herança e Correlação Operacional com a Conferência Anterior:**
   - Ao vincular uma conferência anterior de referência, qualquer item presente na nova conferência que possua histórico no ciclo anterior (ex: documento de tramitação de descarga ou movimentação registrado) deve exibir uma indicação/alerta de badge visual (ex: ⚠️ *Histórico: Descarregado no Doc XXXX*).
   - O operador deve ter a opção de carregar esses dados históricos previamente preenchidos ou validá-los de forma imediata.

3. **Leitor de QR Code & Compressão de Imagens:**
   - Modal com leitor imersivo em proporção 1:1 (Html5-Qrcode).
   - Botão para envio de arquivo/imagem da galeria (`scanFileV2`), simulando o leitor de QR Code Pix.
   - Extração do BMP via Regex (`/bmp\s*[:\.]?\s*(\d+)/i` ou dígitos diretos).
   - Fotos capturadas devem ser redimensionadas via Canvas no frontend (máx. 1024px, JPEG 70%) antes do envio ao Supabase Storage.

---

## 3. Telas da Aplicação

1. **Tela de Login:**
   - Autenticação e-mail/senha via `supabase.auth.signInWithPassword`.

2. **Tela de Gestão de Usuários (Apenas Administrador):**
   - Criação de novos acessos e definição de perfil (`admin`, `chefe`, `tecnico`).
   - Redefinição de senha e alteração de status cadastral.

3. **Tela de Minha Conta (Todos os Perfis):**
   - Atualização de senha e dados militares básicos.

4. **Tela de Gestão de Conferências (Admin e Chefe):**
   - Abertura de novos ciclos de conferência, com seleção opcional da conferência base anterior para correlação.
   - Encerramento ou arquivamento da conferência (bloqueando novas edições).

5. **Tela de Carga de Dados (CSV):**
   - Seleção da conferência ativa.
   - Upload do `.csv` com pré-visualização e carga incremental sem duplicação.

6. **Tela Operacional de Conferência (Estilo E-commerce):**
   - **Layout Responsivo:**
     - **Coluna Lateral Esquerda (Filtros e Ações):**
       - Campo de busca textual (BMP, descrição, documento) com botão para limpar pesquisa (✕).
       - Botão de acionamento do Scanner QR Code.
       - Filtros rápidos por situação ("Não Encontrados", "Encontrados", "Descarga", "Movimento") com badges de contadores numéricos coloridos.
       - Filtro por Dependência e Setor.
     - **Área Central (Grade de Vitrine):**
       - Grade de cards no formato de vitrine de produtos.
       - Topo de cada card: foto do item em destaque (ou placeholder caso não haja imagem).
       - Corpo do card: Número BMP em destaque, descrição curta, etiquetas de situação e documento associado, além do alerta se houver histórico da conferência anterior.
       - Clique no card abre o modal para conferência, alteração de situação, inclusão de documento e captura/envio da foto.

7. **Tela de Extratos e Auditoria:**
   - Painel analítico com quantitativo absoluto e percentual de cada situação da conferência.

8. **Tela de Relatórios e Cruzamento Histórico:**
   - Exportação em `.csv` e `.pdf`.
   - Comparativo lado a lado entre a conferência ativa e a anterior (Itens que permaneceram, bens baixados e novos bens ingressantes).

---

## 4. Entregáveis Esperados

- Script SQL estruturado para o PostgreSQL do Supabase (DDL com tabelas, índices, enums, trigger para herança de histórico e RLS).
- Estrutura de frontend (HTML5, Bootstrap 5 CSS, scripts modulares em JS) pronta para hospedagem estática no GitHub Pages.
