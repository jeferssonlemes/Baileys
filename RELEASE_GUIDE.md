# 🚀 Guia de Release Automático - Baileys

Este guia explica como funciona o sistema de versionamento e publicação automática do projeto Baileys.

## 📋 Visão Geral do Sistema

O projeto utiliza um sistema de release em duas etapas:
1. **Manual Release**: Cria a versão e tag
2. **Publish Release**: Publica automaticamente no NPM

## 🔧 Ferramentas Utilizadas

- **release-it**: Gerenciamento de versões e tags
- **GitHub Actions**: Automação de CI/CD
- **conventional-changelog**: Geração automática de changelog
- **NPM**: Publicação do pacote

## 📁 Arquivos Importantes

```
.github/workflows/
├── manual-release.yml      # Workflow para criar versões manualmente
├── publish-release.yml     # Workflow para publicar no NPM
└── update-nightly.yml      # Workflow para versões nightly

.release-it.yml             # Configuração do release-it
package.json               # Scripts e configurações
```

## 🚀 Processo Passo a Passo

### Etapa 1: Preparação do Release Manual

#### 1.1 Acesse o GitHub Actions
1. Vá para o repositório no GitHub
2. Clique na aba **Actions**
3. Procure pelo workflow **"Manual Release"**

#### 1.2 Execute o Workflow Manual
1. Clique em **"Run workflow"**
2. Selecione a branch (geralmente `master` ou `main`)
3. Escolha o tipo de incremento:
   - `patch`: Para correções (1.0.0 → 1.0.1)
   - `minor`: Para novas funcionalidades (1.0.0 → 1.1.0)
   - `major`: Para mudanças breaking (1.0.0 → 2.0.0)
   - `prerelease`: Para versões beta/alpha
   - Versão específica: ex: `1.2.3`

#### 1.3 O que acontece internamente:
```bash
# O workflow executa:
npx release-it --increment <tipo_escolhido>
```

#### 1.4 Ações do release-it:
1. ✅ Incrementa a versão no `package.json`
2. ✅ Cria commit: `chore(release): v<nova_versão>`
3. ✅ Cria tag: `v<nova_versão>`
4. ✅ Atualiza o `CHANGELOG.md`
5. ✅ Faz push do commit e tag

### Etapa 2: Publicação Automática

#### 2.1 Trigger Automático
Quando a tag `v*` é criada, o workflow **"Publish Release"** é acionado automaticamente.

#### 2.2 Processo de Publicação:
1. ✅ **Checkout**: Baixa o código
2. ✅ **Setup Node**: Configura Node.js 20.x
3. ✅ **Install Dependencies**: Instala dependências com yarn
4. ✅ **Build**: Compila o TypeScript (`tsc`)
5. ✅ **Publish NPM**: Publica como `@allchats/baileys`
6. ✅ **Generate Changelog**: Gera changelog da versão
7. ✅ **Create Package**: Cria arquivo `.tgz`
8. ✅ **Create GitHub Release**: Cria release no GitHub

## 🔍 Verificação do Processo

### Como verificar se funcionou:

#### 1. Verificar no GitHub:
- ✅ Nova tag criada em **Tags**
- ✅ Nova release em **Releases**
- ✅ Commit de release no histórico

#### 2. Verificar no NPM:
```bash
npm view @allchats/baileys version
```

#### 3. Verificar logs do GitHub Actions:
- Acesse **Actions** > **Publish Release**
- Verifique se todos os steps passaram

## ⚠️ Problemas Comuns e Soluções

### 1. **Erro: "NPM_TOKEN not found"**
**Solução**: Verificar se o secret `NPM_TOKEN` está configurado no repositório:
- Settings > Secrets and variables > Actions > Repository secrets

### 2. **Erro: "Permission denied"**
**Solução**: Verificar se o `PERSONAL_TOKEN` tem permissões adequadas:
- Deve ter acesso a: `repo`, `write:packages`

### 3. **Erro: "Tag already exists"**
**Solução**: 
```bash
# Deletar tag local e remota
git tag -d v<versão>
git push origin :refs/tags/v<versão>
```

### 4. **Versão não incrementou**
**Verificação**:
```bash
# Verificar se o package.json foi atualizado
git log --oneline -n 5
# Deve ter commit: "chore(release): v<nova_versão>"
```

## 🛠️ Comandos Úteis para Debug

### Verificar status atual:
```bash
# Versão atual
npm version

# Tags existentes
git tag -l

# Último commit
git log --oneline -n 1

# Status do repositório
git status
```

### Testar release-it localmente:
```bash
# Dry run (não faz alterações)
npx release-it --dry-run

# Testar com incremento específico
npx release-it --increment patch --dry-run
```

## 📝 Configuração Atual

### package.json (scripts relevantes):
```json
{
  "scripts": {
    "release": "release-it",
    "changelog:update": "conventional-changelog -p angular -i CHANGELOG.md -s -r 0",
    "prepack": "tsc",
    "prepare": "tsc"
  }
}
```

### .release-it.yml:
```yaml
git:
  commitMessage: "chore(release): v${version}"
  tagAnnotation: "chore(release): v${version}"
  tagName: "v${version}"

hooks:
  after:bump:
    - "npm run changelog:update"

npm:
  publish: false  # Publicação via GitHub Actions
```

## 🎯 Resumo Rápido

Para fazer um release:

1. **GitHub** → **Actions** → **Manual Release** → **Run workflow**
2. Escolher tipo de incremento (`patch`, `minor`, `major`)
3. Aguardar conclusão (cria tag)
4. **Publish Release** executa automaticamente
5. Verificar publicação no NPM

## 📞 Troubleshooting

Se algo der errado:

1. ✅ Verificar logs no GitHub Actions
2. ✅ Verificar secrets configurados
3. ✅ Verificar permissões do token
4. ✅ Verificar se não há conflitos de tag
5. ✅ Testar release-it localmente com `--dry-run`

---

**Versão atual**: 25.2.6  
**Última atualização**: $(date) 

# 🚀 Guia de Release Rápido - Baileys

Este guia rápido explica como gerar um novo release utilizando o comando `npx release-it`.

## 💡 Comando Principal

Para gerar uma nova versão (ex: `patch`, `minor`, `major`), utilize o seguinte comando no terminal:

```bash
npx release-it --increment patch
```

- **`--increment patch`**: Incrementa a versão seguindo a convenção semântica (e.g., `1.0.0` para `1.0.1`). Você pode substituir `patch` por `minor`, `major` ou uma versão específica (ex: `1.2.3`).

## 🔄 O que este comando faz:

1.  **Incrementa a versão**: Atualiza a versão no `package.json`.
2.  **Cria um commit**: Gera um commit com a mensagem padrão `chore(release): v<nova_versão>`.
3.  **Cria uma tag**: Cria uma tag Git no formato `v<nova_versão>` (ex: `v25.2.7`).
4.  **Atualiza o Changelog**: O `CHANGELOG.md` será atualizado automaticamente (configurado no `.release-it.yml`).
5.  **Faz push**: Envia o commit e a tag para o repositório remoto.

## 🚀 Automação do GitHub Actions

Após o push da tag, o workflow do GitHub Actions chamado **"Publish Release"** (definido em `.github/workflows/publish-release.yml`) será automaticamente acionado. Este workflow é responsável por:

-   Publicar o pacote no NPM.
-   Criar uma nova release no GitHub com o changelog gerado.

## ✅ Verificação

Para verificar se o release foi bem-sucedido:

1.  **No GitHub**: Verifique se uma nova tag e release foram criadas.
2.  **No NPM**: Execute `npm view @allchats/baileys version` para confirmar a nova versão.

---

**Observação**: Este é o método recomendado para gerar releases, pois ele automatiza todas as etapas necessárias para que a publicação no NPM e no GitHub ocorra corretamente. 