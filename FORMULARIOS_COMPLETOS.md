# FORMULÁRIOS COMPLETOS - SISTEMA DE GESTÃO DE PROPRIEDADE INTELECTUAL
## Universidade de Pernambuco (UPE) - Projeto Crush

---

## ÍNDICE DE FORMULÁRIOS

### FASE 2: SUBMISSÃO (Portão de Entrada)
1. **Formulário de Patente Padrão (PI/MU)**
2. **Formulário de Software CII**
3. **Formulário de Registro de Programa de Computador (RPC)**

### FASE 1: ANEXOS (Golden Kit)
4. **Anexo A - Relatório de Busca de Anterioridade**
5. **Anexo B - Matriz de Problema x Solução**
6. **Anexo C - Memorial Descritivo**
7. **Anexo F - Qualificação de Inventores**

### FASE 4: FORMALIZAÇÃO
8. **Termo de Cessão de Direitos**
9. **Declaração de Inventor**
10. **Autorização para Depósito no INPI**

---

## 1. FORMULÁRIO DE PATENTE PADRÃO (PI/MU)

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Formulário de Patente - UPE</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 900px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .form-container {
            background-color: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
            background: linear-gradient(135deg, #2196F3, #1976D2);
            color: white;
            padding: 20px;
            border-radius: 8px 8px 0 0;
            margin: -30px -30px 30px -30px;
        }
        .section {
            margin-bottom: 30px;
            padding: 20px;
            background-color: #f9f9f9;
            border-left: 4px solid #2196F3;
            border-radius: 4px;
        }
        .section-title {
            color: #1976D2;
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 15px;
            border-bottom: 2px solid #2196F3;
            padding-bottom: 10px;
        }
        label {
            display: block;
            margin-bottom: 8px;
            font-weight: bold;
            color: #333;
        }
        input[type="text"],
        input[type="email"],
        input[type="number"],
        textarea,
        select {
            width: 100%;
            padding: 12px;
            margin-bottom: 15px;
            border: 2px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
            box-sizing: border-box;
            transition: border-color 0.3s;
        }
        input:focus,
        textarea:focus,
        select:focus {
            border-color: #2196F3;
            outline: none;
        }
        .char-count {
            font-size: 12px;
            color: #666;
            text-align: right;
            margin-top: -10px;
            margin-bottom: 15px;
        }
        .char-count.warning {
            color: #FF9800;
        }
        .char-count.error {
            color: #f44336;
        }
        .radio-group {
            margin-bottom: 15px;
        }
        .radio-option {
            display: inline-block;
            margin-right: 20px;
            padding: 10px;
            background-color: white;
            border: 2px solid #ddd;
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.3s;
        }
        .radio-option:hover {
            border-color: #2196F3;
        }
        .radio-option.selected {
            background-color: #2196F3;
            color: white;
            border-color: #2196F3;
        }
        .required {
            color: #f44336;
        }
        .submit-btn {
            background-color: #4CAF50;
            color: white;
            padding: 15px 30px;
            border: none;
            border-radius: 4px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            width: 100%;
            transition: background-color 0.3s;
        }
        .submit-btn:hover {
            background-color: #45a049;
        }
        .info-box {
            background-color: #E3F2FD;
            border-left: 4px solid #2196F3;
            padding: 15px;
            margin-bottom: 15px;
            border-radius: 4px;
        }
        .info-box-title {
            font-weight: bold;
            color: #1976D2;
            margin-bottom: 5px;
        }
    </style>
</head>
<body>
    <div class="form-container">
        <div class="header">
            <h1>📋 FORMULÁRIO DE PATENTE</h1>
            <h2>Universidade de Pernambuco (UPE) - NIT</h2>
        </div>

        <!-- SEÇÃO 1: TIPO DE PATENTE -->
        <div class="section">
            <div class="section-title">1. Tipo de Patente</div>
            <div class="info-box">
                <div class="info-box-title">💡 Informação Importante</div>
                Selecione o tipo adequado de patente. Dúvidas? Consulte o <a href="#">Guia de Tipos de Patente</a>
            </div>
            <label>Tipo de Patente <span class="required">*</span></label>
            <div class="radio-group">
                <label class="radio-option">
                    <input type="radio" name="tipo" value="PI" required>
                    🔵 PI - Patente de Invenção (20 anos)
                </label>
                <label class="radio-option">
                    <input type="radio" name="tipo" value="MU">
                    🟡 MU - Modelo de Utilidade (15 anos)
                </label>
            </div>
        </div>

        <!-- SEÇÃO 2: DADOS DO PEDIDO -->
        <div class="section">
            <div class="section-title">2. Dados do Pedido</div>
            
            <label for="titulo">Título da Invenção <span class="required">*</span></label>
            <input type="text" id="titulo" name="titulo" maxlength="150" required>
            <div class="char-count" id="titulo-count">0/150 caracteres</div>

            <label for="problema">Problema/Dor a Ser Resolvido <span class="required">*</span></label>
            <textarea id="problema" name="problema" rows="4" minlength="100" maxlength="1000" required></textarea>
            <div class="char-count" id="problema-count">0/1000 caracteres (mín: 100)</div>

            <label for="solucao">Solução Técnica Proposta <span class="required">*</span></label>
            <textarea id="solucao" name="solucao" rows="6" minlength="500" maxlength="4000" required></textarea>
            <div class="char-count" id="solucao-count">0/4000 caracteres (mín: 500)</div>

            <label for="estado_tecnica">Estado da Técnica (O que já existe) <span class="required">*</span></label>
            <textarea id="estado_tecnica" name="estado_tecnica" rows="4" minlength="200" maxlength="2000" required></textarea>
            <div class="char-count" id="estado_tecnica-count">0/2000 caracteres (mín: 200)</div>

            <label for="vantagens">Vantagens da Invenção <span class="required">*</span></label>
            <textarea id="vantagens" name="vantagens" rows="3" minlength="100" maxlength="1500" required></textarea>
            <div class="char-count" id="vantagens-count">0/1500 caracteres (mín: 100)</div>

            <label for="palavras_chave">Palavras-Chave (separadas por vírgula) <span class="required">*</span></label>
            <input type="text" id="palavras_chave" name="palavras_chave" maxlength="100" required>
            <div class="char-count" id="palavras_chave-count">0/100 caracteres</div>
        </div>

        <!-- SEÇÃO 3: DADOS DOS INVENTORES -->
        <div class="section">
            <div class="section-title">3. Dados dos Inventores</div>
            
            <label for="inventor_principal">Nome do Inventor Principal <span class="required">*</span></label>
            <input type="text" id="inventor_principal" name="inventor_principal" required>

            <label for="cpf_inventor">CPF do Inventor Principal <span class="required">*</span></label>
            <input type="text" id="cpf_inventor" name="cpf_inventor" placeholder="000.000.000-00" required>

            <label for="email_inventor">E-mail do Inventor Principal <span class="required">*</span></label>
            <input type="email" id="email_inventor" name="email_inventor" required>

            <label for="departamento">Departamento/Unidade <span class="required">*</span></label>
            <input type="text" id="departamento" name="departamento" required>

            <label for="telefone">Telefone</label>
            <input type="text" id="telefone" name="telefone" placeholder="(00) 00000-0000">
        </div>

        <!-- SEÇÃO 4: INFORMAÇÕES ADICIONAIS -->
        <div class="section">
            <div class="section-title">4. Informações Adicionais</div>
            
            <label for="divulgacao_anterior">Houve divulgação pública anterior?</label>
            <select id="divulgacao_anterior" name="divulgacao_anterior">
                <option value="nao">Não</option>
                <option value="sim">Sim</option>
            </select>

            <label for="data_divulgacao">Se sim, data da primeira divulgação:</label>
            <input type="date" id="data_divulgacao" name="data_divulgacao">

            <label for="financiamento">Recebeu financiamento externo?</label>
            <select id="financiamento" name="financiamento">
                <option value="nao">Não</option>
                <option value="sim">Sim</option>
            </select>

            <label for="agencia_financiadora">Se sim, agência financiadora:</label>
            <input type="text" id="agencia_financiadora" name="agencia_financiadora">

            <label for="processo">Número do Processo (se houver):</label>
            <input type="text" id="processo" name="processo">
        </div>

        <!-- SEÇÃO 5: ARQUIVOS ANEXOS -->
        <div class="section">
            <div class="section-title">5. Arquivos Anexos <span class="required">*</span></div>
            <div class="info-box">
                <div class="info-box-title">📎 Arquivos Obrigatórios</div>
                Todos os arquivos devem estar em formato PDF e assinados digitalmente.
            </div>

            <label for="anexo_a">Anexo A - Busca de Anterioridade <span class="required">*</span></label>
            <input type="file" id="anexo_a" name="anexo_a" accept=".pdf" required>

            <label for="anexo_b">Anexo B - Matriz de Problema x Solução <span class="required">*</span></label>
            <input type="file" id="anexo_b" name="anexo_b" accept=".pdf" required>

            <label for="anexo_c">Anexo C - Memorial Descritivo <span class="required">*</span></label>
            <input type="file" id="anexo_c" name="anexo_c" accept=".pdf" required>

            <label for="anexo_f">Anexo F - Qualificação de Inventores <span class="required">*</span></label>
            <input type="file" id="anexo_f" name="anexo_f" accept=".pdf" required>

            <label for="desenhos">Desenhos/Figuras (se aplicável):</label>
            <input type="file" id="desenhos" name="desenhos" accept=".pdf" multiple>
        </div>

        <!-- SEÇÃO 6: DECLARAÇÃO E CONCORDÂNCIA -->
        <div class="section">
            <div class="section-title">6. Declaração e Concordância</div>
            
            <div class="radio-group">
                <label>
                    <input type="checkbox" id="declaracao" name="declaracao" required>
                    Declaro que as informações fornecidas são verdadeiras e completas.
                </label>
            </div>

            <div class="radio-group">
                <label>
                    <input type="checkbox" id="concordancia" name="concordancia" required>
                    Concordo em ceder os direitos de patente à Universidade de Pernambuco (UPE).
                </label>
            </div>

            <div class="radio-group">
                <label>
                    <input type="checkbox" id="autorizacao" name="autorizacao" required>
                    Autorizo o NIT/UPE a processar meu pedido de patente.
                </label>
            </div>
        </div>

        <button type="submit" class="submit-btn">✅ ENVIAR FORMULÁRIO</button>
    </div>

    <script>
        // Contador de caracteres
        function updateCharCount(inputId, countId, maxLength, minLength) {
            const input = document.getElementById(inputId);
            const count = document.getElementById(countId);
            
            input.addEventListener('input', function() {
                const currentLength = this.value.length;
                count.textContent = `${currentLength}/${maxLength} caracteres`;
                
                if (currentLength > maxLength) {
                    count.classList.add('error');
                    count.classList.remove('warning');
                } else if (currentLength > maxLength * 0.9) {
                    count.classList.add('warning');
                    count.classList.remove('error');
                } else {
                    count.classList.remove('warning', 'error');
                }
                
                if (minLength && currentLength < minLength) {
                    count.textContent += ` (mín: ${minLength})`;
                }
            });
        }

        // Inicializar contadores
        updateCharCount('titulo', 'titulo-count', 150);
        updateCharCount('problema', 'problema-count', 1000, 100);
        updateCharCount('solucao', 'solucao-count', 4000, 500);
        updateCharCount('estado_tecnica', 'estado_tecnica-count', 2000, 200);
        updateCharCount('vantagens', 'vantagens-count', 1500, 100);
        updateCharCount('palavras_chave', 'palavras_chave-count', 100);

        // Seleção de tipo de patente
        document.querySelectorAll('.radio-option input').forEach(radio => {
            radio.addEventListener('change', function() {
                document.querySelectorAll('.radio-option').forEach(option => {
                    option.classList.remove('selected');
                });
                this.parentElement.classList.add('selected');
            });
        });
    </script>
</body>
</html>
```

---

## 2. FORMULÁRIO DE SOFTWARE CII (Computer Implemented Invention)

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Formulário de Software CII - UPE</title>
    <style>
        /* Mesmos estilos do formulário anterior */
        body {
            font-family: Arial, sans-serif;
            max-width: 900px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .form-container {
            background-color: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
            background: linear-gradient(135deg, #4CAF50, #388E3C);
            color: white;
            padding: 20px;
            border-radius: 8px 8px 0 0;
            margin: -30px -30px 30px -30px;
        }
        .section {
            margin-bottom: 30px;
            padding: 20px;
            background-color: #f9f9f9;
            border-left: 4px solid #4CAF50;
            border-radius: 4px;
        }
        .section-title {
            color: #388E3C;
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 15px;
            border-bottom: 2px solid #4CAF50;
            padding-bottom: 10px;
        }
        label {
            display: block;
            margin-bottom: 8px;
            font-weight: bold;
            color: #333;
        }
        input[type="text"],
        input[type="email"],
        textarea,
        select {
            width: 100%;
            padding: 12px;
            margin-bottom: 15px;
            border: 2px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
            box-sizing: border-box;
        }
        .char-count {
            font-size: 12px;
            color: #666;
            text-align: right;
            margin-top: -10px;
            margin-bottom: 15px;
        }
        .required {
            color: #f44336;
        }
        .submit-btn {
            background-color: #4CAF50;
            color: white;
            padding: 15px 30px;
            border: none;
            border-radius: 4px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            width: 100%;
        }
        .info-box {
            background-color: #E8F5E9;
            border-left: 4px solid #4CAF50;
            padding: 15px;
            margin-bottom: 15px;
            border-radius: 4px;
        }
    </style>
</head>
<body>
    <div class="form-container">
        <div class="header">
            <h1>💻 FORMULÁRIO DE SOFTWARE CII</h1>
            <h2>Computer Implemented Invention - UPE</h2>
        </div>

        <!-- SEÇÃO 1: INFORMAÇÕES DO SOFTWARE -->
        <div class="section">
            <div class="section-title">1. Informações do Software</div>
            
            <div class="info-box">
                <strong>📌 CII = Software com Efeito Técnico</strong><br>
                O software deve melhorar o hardware (performance, memória, segurança, precisão).
            </div>

            <label for="nome_software">Nome do Software <span class="required">*</span></label>
            <input type="text" id="nome_software" name="nome_software" maxlength="150" required>

            <label for="versao">Versão:</label>
            <input type="text" id="versao" name="versao" placeholder="1.0.0">

            <label for="linguagem">Linguagem de Programação:</label>
            <input type="text" id="linguagem" name="linguagem" placeholder="Python, Java, C++, etc.">

            <label for="plataforma">Plataforma:</label>
            <input type="text" id="plataforma" name="plataforma" placeholder="Windows, Linux, Web, Mobile">
        </div>

        <!-- SEÇÃO 2: EFEITO TÉCNICO -->
        <div class="section">
            <div class="section-title">2. Efeito Técnico <span class="required">*</span></div>
            
            <div class="info-box">
                <strong>⚠️ Importante:</strong> O efeito técnico deve ser mensurável (melhoria em %).
            </div>

            <label for="efeito_tecnico">Descreva o efeito técnico produzido pelo software <span class="required">*</span></label>
            <textarea id="efeito_tecnico" name="efeito_tecnico" rows="4" minlength="200" maxlength="2000" required></textarea>
            <div class="char-count">0/2000 caracteres (mín: 200)</div>

            <label for="metrica">Métrica Quantitativa (ex: "Aumenta performance em 30%") <span class="required">*</span></label>
            <textarea id="metrica" name="metrica" rows="2" minlength="100" maxlength="500" required></textarea>
            <div class="char-count">0/500 caracteres (mín: 100)</div>

            <label for="tipo_efeito">Tipo de Efeito Técnico:</label>
            <select id="tipo_efeito" name="tipo_efeito">
                <option value="">Selecione...</option>
                <option value="performance">Performance (velocidade)</option>
                <option value="memoria">Memória (uso otimizado)</option>
                <option value="seguranca">Segurança (proteção de dados)</option>
                <option value="precisao">Precisão (menor erro)</option>
                <option value="latencia">Latência (menor atraso)</option>
                <option value="outro">Outro</option>
            </select>
        </div>

        <!-- SEÇÃO 3: DESCRIÇÃO FUNCIONAL -->
        <div class="section">
            <div class="section-title">3. Descrição Funcional</div>
            
            <label for="funcionalidade">O que o software faz? <span class="required">*</span></label>
            <textarea id="funcionalidade" name="funcionalidade" rows="4" minlength="200" maxlength="2000" required></textarea>
            <div class="char-count">0/2000 caracteres (mín: 200)</div>

            <label for="inputs">Inputs (entradas de dados): <span class="required">*</span></label>
            <textarea id="inputs" name="inputs" rows="2" minlength="100" maxlength="1000" required></textarea>
            <div class="char-count">0/1000 caracteres (mín: 100)</div>

            <label for="outputs">Outputs (resultados gerados): <span class="required">*</span></label>
            <textarea id="outputs" name="outputs" rows="2" minlength="100" maxlength="1000" required></textarea>
            <div class="char-count">0/1000 caracteres (mín: 100)</div>

            <label for="hardware">Hardware Requerido (processador, memória, armazenamento) <span class="required">*</span></label>
            <textarea id="hardware" name="hardware" rows="2" minlength="100" maxlength="1000" required></textarea>
            <div class="char-count">0/1000 caracteres (mín: 100)</div>
        </div>

        <!-- SEÇÃO 4: ARQUITETURA DO SISTEMA -->
        <div class="section">
            <div class="section-title">4. Arquitetura do Sistema</div>
            
            <label for="fluxograma">Descreva o fluxograma em blocos (BPMN) <span class="required">*</span></label>
            <textarea id="fluxograma" name="fluxograma" rows="4" minlength="200" maxlength="2000" required></textarea>
            <div class="char-count">0/2000 caracteres (mín: 200)</div>

            <label for="fluxograma_arquivo">Arquivo do Fluxograma (PDF) <span class="required">*</span></label>
            <input type="file" id="fluxograma_arquivo" name="fluxograma_arquivo" accept=".pdf" required>

            <label for="componentes">Componentes Principais:</label>
            <input type="text" id="componentes" name="componentes" placeholder="Módulo A, Módulo B, Banco de Dados, etc.">
        </div>

        <!-- SEÇÃO 5: DADOS DOS INVENTORES -->
        <div class="section">
            <div class="section-title">5. Dados dos Inventores</div>
            
            <label for="inventor_principal">Nome do Inventor Principal <span class="required">*</span></label>
            <input type="text" id="inventor_principal" name="inventor_principal" required>

            <label for="email_inventor">E-mail do Inventor Principal <span class="required">*</span></label>
            <input type="email" id="email_inventor" name="email_inventor" required>

            <label for="cpf_inventor">CPF do Inventor Principal <span class="required">*</span></label>
            <input type="text" id="cpf_inventor" name="cpf_inventor" placeholder="000.000.000-00" required>
        </div>

        <!-- SEÇÃO 6: ARQUIVOS ANEXOS -->
        <div class="section">
            <div class="section-title">6. Arquivos Anexos</div>
            
            <label for="anexo_a">Anexo A - Busca de Anterioridade <span class="required">*</span></label>
            <input type="file" id="anexo_a" name="anexo_a" accept=".pdf" required>

            <label for="anexo_b">Anexo B - Matriz de Problema x Solução <span class="required">*</span></label>
            <input type="file" id="anexo_b" name="anexo_b" accept=".pdf" required>

            <label for="anexo_c">Anexo C - Memorial Descritivo <span class="required">*</span></label>
            <input type="file" id="anexo_c" name="anexo_c" accept=".pdf" required>

            <label for="anexo_f">Anexo F - Qualificação de Inventores <span class="required">*</span></label>
            <input type="file" id="anexo_f" name="anexo_f" accept=".pdf" required>
        </div>

        <button type="submit" class="submit-btn">✅ ENVIAR FORMULÁRIO DE SOFTWARE CII</button>
    </div>
</body>
</html>
```

---

## 3. FORMULÁRIO DE REGISTRO DE PROGRAMA DE COMPUTADOR (RPC)

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Formulário de RPC - UPE</title>
    <style>
        /* Estilos simplificados */
        body {
            font-family: Arial, sans-serif;
            max-width: 900px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .form-container {
            background-color: white;
            padding: 30px;
            border-radius: 8px;
        }
        .header {
            background: linear-gradient(135deg, #9C27B0, #7B1FA2);
            color: white;
            padding: 20px;
            border-radius: 8px 8px 0 0;
            margin: -30px -30px 30px -30px;
        }
        .section {
            margin-bottom: 30px;
            padding: 20px;
            background-color: #f9f9f9;
            border-left: 4px solid #9C27B0;
            border-radius: 4px;
        }
        .section-title {
            color: #7B1FA2;
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 15px;
        }
        label {
            display: block;
            margin-bottom: 8px;
            font-weight: bold;
        }
        input, textarea, select {
            width: 100%;
            padding: 12px;
            margin-bottom: 15px;
            border: 2px solid #ddd;
            border-radius: 4px;
        }
        .required {
            color: #f44336;
        }
        .submit-btn {
            background-color: #9C27B0;
            color: white;
            padding: 15px 30px;
            border: none;
            border-radius: 4px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            width: 100%;
        }
        .info-box {
            background-color: #F3E5F5;
            border-left: 4px solid #9C27B0;
            padding: 15px;
            margin-bottom: 15px;
            border-radius: 4px;
        }
    </style>
</head>
<body>
    <div class="form-container">
        <div class="header">
            <h1>💾 FORMULÁRIO DE REGISTRO DE PROGRAMA DE COMPUTADOR</h1>
            <h2>Direito Autoral de Software - UPE</h2>
        </div>

        <!-- SEÇÃO 1: INFORMAÇÕES DO PROGRAMA -->
        <div class="section">
            <div class="section-title">1. Informações do Programa</div>
            
            <div class="info-box">
                <strong>📌 RPC = Direito Autoral</strong><br>
                Protege o CÓDIGO-FONTE, não a lógica algorítmica. Validade: 50 anos.
            </div>

            <label for="nome_programa">Nome do Programa <span class="required">*</span></label>
            <input type="text" id="nome_programa" name="nome_programa" required>

            <label for="versao">Versão:</label>
            <input type="text" id="versao" name="versao">

            <label for="linguagem">Linguagem de Programação:</label>
            <input type="text" id="linguagem" name="linguagem">

            <label for="descricao">Descrição do Programa (funcionalidades principais) <span class="required">*</span></label>
            <textarea id="descricao" name="descricao" rows="4" required></textarea>
        </div>

        <!-- SEÇÃO 2: DADOS DO AUTOR -->
        <div class="section">
            <div class="section-title">2. Dados do Autor</div>
            
            <label for="autor_principal">Nome do Autor Principal <span class="required">*</span></label>
            <input type="text" id="autor_principal" name="autor_principal" required>

            <label for="cpf_autor">CPF do Autor Principal <span class="required">*</span></label>
            <input type="text" id="cpf_autor" name="cpf_autor" required>

            <label for="email_autor">E-mail do Autor Principal <span class="required">*</span></label>
            <input type="email" id="email_autor" name="email_autor" required>
        </div>

        <!-- SEÇÃO 3: ARQUIVOS -->
        <div class="section">
            <div class="section-title">3. Arquivos</div>
            
            <label for="codigo_fonte">Código-Fonte (compactado em .zip) <span class="required">*</span></label>
            <input type="file" id="codigo_fonte" name="codigo_fonte" accept=".zip" required>

            <label for="executavel">Executável (se aplicável):</label>
            <input type="file" id="executavel" name="executavel">

            <label for="manual">Manual do Usuário (PDF):</label>
            <input type="file" id="manual" name="manual" accept=".pdf">
        </div>

        <button type="submit" class="submit-btn">✅ ENVIAR FORMULÁRIO RPC</button>
    </div>
</body>
</html>
```

---

## 4. ANEXO A - RELATÓRIO DE BUSCA DE ANTERIORIDADE

```markdown
# ANEXO A: RELATÓRIO DE BUSCA DE ANTERIORIDADE

**Data:** 28/12/2025  
**Responsável:** Inventor Principal  
**Número do Pedido:** A definir

---

## 1. PALAVRAS-CHAVE (3-5 termos)

1. **Termo 1:** [Inserir termo principal]
2. **Termo 2:** [Inserir termo secundário]
3. **Termo 3:** [Inserir termo técnico]
4. **Termo 4:** [Inserir termo específico]
5. **Termo 5:** [Inserir termo adicional]

---

## 2. BASES CONSULTADAS

- [x] **INPI** - Instituto Nacional da Propriedade Industrial
  - URL: https://www.gov.br/inpi/pt-br
  - Data da busca: DD/MM/AAAA
  
- [x] **Espacenet** - Base Europeia
  - URL: https://worldwide.espacenet.com
  - Data da busca: DD/MM/AAAA
  
- [x] **Google Patents** - Busca internacional
  - URL: https://patents.google.com
  - Data da busca: DD/MM/AAAA

---

## 3. TOP 3 DOCUMENTOS RELEVANTES

### Documento 1

**Título da Patente:** [Título completo do documento]

**Número da Patente:** [BR 20XXXX-Y / US XXXXXX / EP XXXXXXX]

**Data de Publicação:** DD/MM/AAAA

**Inventor(es):** [Nome dos inventores]

**Titular:** [Nome do titular]

**Resumo do Conteúdo:** 
[Resumo em 200-300 palavras descrevendo o que a patente faz]

**Lacuna Técnica (O que NÃO resolve):**
[Descrição clara da limitação ou problema que esta patente NÃO resolve]

**Relevância para a Invenção:** [Alta/Média/Baixa] - [Justificar]

---

### Documento 2

**Título da Patente:** [Título completo do documento]

**Número da Patente:** [BR 20XXXX-Y / US XXXXXX / EP XXXXXXX]

**Data de Publicação:** DD/MM/AAAA

**Inventor(es):** [Nome dos inventores]

**Titular:** [Nome do titular]

**Resumo do Conteúdo:** 
[Resumo em 200-300 palavras descrevendo o que a patente faz]

**Lacuna Técnica (O que NÃO resolve):**
[Descrição clara da limitação ou problema que esta patente NÃO resolve]

**Relevância para a Invenção:** [Alta/Média/Baixa] - [Justificar]

---

### Documento 3

**Título da Patente:** [Título completo do documento]

**Número da Patente:** [BR 20XXXX-Y / US XXXXXX / EP XXXXXXX]

**Data de Publicação:** DD/MM/AAAA

**Inventor(es):** [Nome dos inventores]

**Titular:** [Nome do titular]

**Resumo do Conteúdo:** 
[Resumo em 200-300 palavras descrevendo o que a patente faz]

**Lacuna Técnica (O que NÃO resolve):**
[Descrição clara da limitação ou problema que esta patente NÃO resolve]

**Relevância para a Invenção:** [Alta/Média/Baixa] - [Justificar]

---

## 4. LACUNA TÉCNICA GERAL

**Problema que o Estado da Técnica Coletivamente NÃO resolve:**

[Descrição detalhada (200-500 palavras) do problema que nenhuma das patentes encontradas resolve completamente. Esta é a oportunidade para sua invenção.]

**Exemplo:**
"As patentes encontradas abordam isoladamente a otimização de processos ou a redução de custos, mas nenhuma combina ambas as soluções de forma integrada. Além disso, nenhuma das soluções anteriores considera o impacto ambiental do processo, o que é uma lacuna importante para aplicações sustentáveis."

---

## 5. CONCLUSÃO DA BUSCA

**A invenção proposta:**

- [ ] **É NOVA** - Não existe patente idêntica no Estado da Técnica
- [ ] **NÃO É NOVA** - Existe patente idêntica no Estado da Técnica

**Justificativa:**
[Explique em 200-300 palavras porque sua invenção é ou não é nova, com base nos documentos encontrados]

---

## 6. OBSERVAÇÕES ADICIONAIS

[Qualquer outra observação relevante sobre a busca ou sobre o Estado da Técnica]

---

**Assinatura do Inventor Principal:** ______________________________

**Data:** DD/MM/AAAA
```

---

## 5. ANEXO B - MATRIZ DE PROBLEMA X SOLUÇÃO

```markdown
# ANEXO B: MATRIZ DE PROBLEMA X SOLUÇÃO

**Data:** 28/12/2025  
**Inventor Principal:** [Nome]

---

## 1. PROBLEMA IDENTIFICADO

**Título do Problema:** [Título curto e descritivo]

**Descrição do Problema:**
[Descrição detalhada (300-500 palavras) do problema que sua invenção resolve]

**Quem sofre com este problema?**
[Invente os usuários/públicos afetados]

**Como o problema se manifesta?**
[Descreva os sintomas ou consequências do problema]

---

## 2. SOLUÇÕES EXISTENTES (ESTADO DA TÉCNICA)

### Solução A

**Nome da Solução:** [Nome da solução existente 1]

**Descrição:** [Descrição em 100-200 palavras]

**Vantagens:**
- Vantagem 1
- Vantagem 2
- Vantagem 3

**Limitações:**
- Limitação 1
- Limitação 2
- Limitação 3

**Referências (patentes/artigos):** [Citar referências]

---

### Solução B

**Nome da Solução:** [Nome da solução existente 2]

**Descrição:** [Descrição em 100-200 palavras]

**Vantagens:**
- Vantagem 1
- Vantagem 2
- Vantagem 3

**Limitações:**
- Limitação 1
- Limitação 2
- Limitação 3

**Referências (patentes/artigos):** [Citar referências]

---

### Solução C

**Nome da Solução:** [Nome da solução existente 3]

**Descrição:** [Descrição em 100-200 palavras]

**Vantagens:**
- Vantagem 1
- Vantagem 2
- Vantagem 3

**Limitações:**
- Limitação 1
- Limitação 2
- Limitação 3

**Referências (patentes/artigos):** [Citar referências]

---

## 3. SOLUÇÃO PROPOSTA (INVENÇÃO)

**Título da Invenção:** [Título da sua invenção]

**Descrição da Solução:**
[Descrição detalhada (500-1000 palavras) de como sua invenção resolve o problema]

**Como funciona:**
[Passo a passo do funcionamento da invenção]

**Diferencial em relação às soluções existentes:**
[O que torna sua invenção única ou superior]

---

## 4. VANTAGENS COMPARATIVAS (KPIs)

| Métrica | Solução A | Solução B | Solução C | SUA INVENÇÃO | % MELHORIA |
|---------|----------|----------|----------|---------------|-----------|
| **Tempo de Processamento** | X s | Y s | Z s | [seu valor] | [%] |
| **Custo de Produção** | R$ X | R$ Y | R$ Z | [seu valor] | [%] |
| **Eficiência Energética** | X% | Y% | Z% | [seu valor] | [%] |
| **Qualidade do Resultado** | X% | Y% | Z% | [seu valor] | [%] |
| **Uso de Recursos** | X kg | Y kg | Z kg | [seu valor] | [%] |
| **Confiabilidade** | X% | Y% | Z% | [seu valor] | [%] |

**Como calcular a % de melhoria:**
```
% MELHORIA = ((VALOR_EXISTENTE - SUA_INVENÇÃO) / VALOR_EXISTENTE) × 100

Exemplo:
Tempo Solução A = 100 s
Tempo Sua Invenção = 70 s
% MELHORIA = ((100 - 70) / 100) × 100 = 30%
```

---

## 5. IMPACTO DA SOLUÇÃO

**Impacto Técnico:**
[Como a invenção melhora o estado da técnica]

**Impacto Econômico:**
[Benefícios econômicos potenciais]

**Impacto Social/Ambiental:**
[Benefícios sociais ou ambientais]

**Aplicações Potenciais:**
[Onde a invenção pode ser aplicada]

---

**Assinatura do Inventor Principal:** ______________________________

**Data:** DD/MM/AAAA
```

---

## 6. ANEXO C - MEMORIAL DESCRITIVO (TEMPLATE)

```markdown
# ANEXO C: MEMORIAL DESCRITIVO

**Data:** 28/12/2025  
**Tipo de Patente:** [PI/MU/CII]  
**Inventor Principal:** [Nome]

---

## 1. TÍTULO DA INVENÇÃO

[Inserir título completo da invenção - Máximo 150 caracteres]

---

## 2. CAMPO DA INVENÇÃO

A presente invenção refere-se ao campo de [área técnica específica], mais particularmente a [sub-área específica].

---

## 3. ESTADO DA TÉCNICA

[Descrever o que já existe no Estado da Técnica - 500-1000 palavras]

**Soluções Existentes:**
- [Solução 1]
- [Solução 2]
- [Solução 3]

**Limitações do Estado da Técnica:**
[Descrever as limitações das soluções existentes]

**Lacuna Técnica:**
[O que o Estado da Técnica NÃO resolve]

---

## 4. SUMÁRIO DA INVENÇÃO

É um objetivo da presente invenção [descrever o objetivo principal].

A invenção é caracterizada por [descrever as características principais].

As vantagens da invenção incluem [listar as vantagens].

---

## 5. DESCRIÇÃO DETALHADA DA INVENÇÃO

### 5.1 Componentes/Elementos Principais

A invenção compreende os seguintes componentes:

1. **[Componente 1]:** [Descrição]
2. **[Componente 2]:** [Descrição]
3. **[Componente 3]:** [Descrição]

### 5.2 Funcionamento

A invenção funciona da seguinte maneira:

**Etapa 1:** [Descrição]
**Etapa 2:** [Descrição]
**Etapa 3:** [Descrição]

### 5.3 Modo de Realização

A invenção pode ser realizada de diferentes formas:

**Realização 1:** [Descrição detalhada com parâmetros]
**Realização 2:** [Descrição detalhada com parâmetros]

**Parâmetros Específicos:**
- Temperatura: [XX°C a YY°C]
- Pressão: [X a Y atm]
- Tempo: [XX a YY minutos]
- Proporção: [1:X a 1:Y]

---

## 6. EXEMPLOS DE CONCRETIZAÇÃO

### Exemplo 1

[Descrição detalhada de um exemplo prático, com dados reais]

**Resultados:**
- [Resultado 1]
- [Resultado 2]
- [Resultado 3]

### Exemplo 2

[Descrição detalhada de outro exemplo prático]

**Resultados:**
- [Resultado 1]
- [Resultado 2]
- [Resultado 3]

---

## 7. REIVINDICAÇÕES

**1. [Processo/Produto/Uso] caracterizado por...**

**2. [Processo/Produto/Uso] de acordo com a reivindicação 1, caracterizado por...**

**3. [Processo/Produto/Uso] de acordo com as reivindicações 1 ou 2, caracterizado por...**

---

## 8. DESENHOS/FIGURAS

**Figura 1:** [Descrição da figura]
**Figura 2:** [Descrição da figura]
**Figura 3:** [Descrição da figura]

**Referências Numéricas:**
- 1: [Elemento]
- 2: [Elemento]
- 3: [Elemento]

---

## 9. ABREVIATURAS

[Lista de abreviações utilizadas no texto]

---

## 10. REFERÊNCIAS

[Referências bibliográficas e patentes citadas]

---

**Assinaturas dos Inventores:**

Inventor 1: ___________________________ Data: __/__/____

Inventor 2: ___________________________ Data: __/__/____

Inventor 3: ___________________________ Data: __/__/____
```

---

## 7. ANEXO F - QUALIFICAÇÃO DE INVENTORES

```markdown
# ANEXO F: QUALIFICAÇÃO DE INVENTORES

**Data:** 28/12/2025  
**Título da Invenção:** [Título]

---

## 1. INVENTOR 1 (PRINCIPAL)

**Nome Completo:** [Nome completo]

**CPF:** 000.000.000-00

**RG:** 00.000.000-X

**E-mail:** exemplo@upe.br

**Telefone:** (00) 00000-0000

**Departamento/Unidade:** [Departamento]

**Cargo/Função:** [Cargo]

**Endereço Completo:** [Rua, Número, Bairro, Cidade, UF, CEP]

**Participação na Invenção (%)**

| Atividade | % de Participação | Justificativa |
|-----------|------------------|---------------|
| Concepção da ideia | [XX%] | [Justificar] |
| Desenvolvimento | [XX%] | [Justificar] |
| Testes/Validação | [XX%] | [Justificar] |
| Outros | [XX%] | [Justificar] |
| **TOTAL** | **100%** | |

---

## 2. INVENTOR 2

**Nome Completo:** [Nome completo]

**CPF:** 000.000.000-00

**E-mail:** exemplo@upe.br

**Departamento/Unidade:** [Departamento]

**Cargo/Função:** [Cargo]

**Participação na Invenção (%)**

| Atividade | % de Participação | Justificativa |
|-----------|------------------|---------------|
| Concepção da ideia | [XX%] | [Justificar] |
| Desenvolvimento | [XX%] | [Justificar] |
| Testes/Validação | [XX%] | [Justificar] |
| Outros | [XX%] | [Justificar] |
| **TOTAL** | **100%** | |

---

## 3. INVENTOR 3 (SE APLICÁVEL)

[Repetir estrutura do Inventor 2]

---

## 4. SISGEN (SISTEMA NACIONAL DE GESTÃO DO PATRIMÔNIO GENÉTICO)

**A invenção utiliza recursos genéticos brasileiros?**

- [ ] **NÃO** - Não se aplica
- [ ] **SIM** - Se aplica

**Se SIM, preencher:**

**Número do Registro SisGen:** [XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX]

**Espécie Utilizada:** [Nome científico e comum]

**Origem do Material:** [Local de coleta]

**Acesso realizado:** [Sim/Não]

---

## 5. FINANCIAMENTO

**A invenção recebeu financiamento externo?**

- [ ] **NÃO** - Não se aplica
- [ ] **SIM** - Se aplica

**Se SIM, preencher:**

**Agência Financiadora:** [Nome da agência]

**Número do Processo:** [Número do processo]

**Edital/Chamada:** [Nome do edital]

**Valor Financiado:** R$ [Valor]

---

## 6. DECLARAÇÃO DE ORIGINALIDADE

Nós, abaixo-assinados, declaramos que:

1. Somos os inventores originais da invenção descrita.
2. Não cedemos os direitos da invenção a terceiros.
3. A invenção é original e não foi copiada de outras fontes.
4. Concordamos em ceder os direitos de patente à Universidade de Pernambuco (UPE).
5. Autorizamos o NIT/UPE a processar e depositar o pedido de patente.

---

**ASSINATURAS:**

**Inventor 1:** ______________________________________
Assinatura: _________________________________________
Data: ______/_______/20___

**Inventor 2:** ______________________________________
Assinatura: _________________________________________
Data: ______/_______/20___

**Inventor 3:** ______________________________________
Assinatura: _________________________________________
Data: ______/_______/20___
```

---

## 8. TERMO DE CESSÃO DE DIREITOS

```markdown
# TERMO DE CESSÃO DE DIREITOS DE PATENTE

**NÚMERO:** [A definir]  
**DATA:** 28 de dezembro de 2025

---

**CEDENTE:**

**Nome:** [Nome Completo do Inventor]  
**CPF:** 000.000.000-00  
**RG:** 00.000.000-X  
**Endereço:** [Endereço completo]

**CESSIONÁRIA:**

**Nome:** UNIVERSIDADE DE PERNAMBUCO - UPE  
**CNPJ:** 24.131.559/0001-69  
**Endereço:** Rua do Príncipe, 526 - Boa Vista, Recife - PE, 50050-900  
**Representado por:** [Nome do Reitor]

---

**CLÁUSULA PRIMEIRA - DO OBJETO**

O presente termo tem como objeto a cessão total dos direitos de propriedade intelectual da patente intitulada:

**Título:** [Título da Invenção]

**Descrição Resumida:** [Descrição da invenção]

---

**CLÁUSULA SEGUNDA - DA CESSÃO**

O CEDENTE, na qualidade de inventor, cede e transfere, em caráter irrevogável e irretratável, à CESSIONÁRIA, todos os direitos patrimoniais sobre a invenção acima descrita, incluindo, mas não se limitando a:

1. Direito de solicitar o registro de patente junto ao INPI;
2. Direito de manter, defender e explorar economicamente a patente;
3. Direito de licenciar terceiros;
4. Direito de comercializar a patente.

---

**CLÁUSULA TERCEIRA - DOS DIREITOS MORAIS**

O CEDENTE mantém os direitos morais sobre a invenção, incluindo:

1. Direito de ser reconhecido como inventor;
2. Direito de ser citado em publicações.

---

**CLÁUSULA QUARTA - DA CONTRAPARTIDA**

A título de contrapartida pela cessão de direitos, a CESSIONÁRIA compromete-se a:

1. Pagar ao CEDENTE [X%] dos royalties obtidos com a exploração da patente;
2. Citar o CEDENTE em todas as publicações e utilizações da invenção;
3. Manter o CEDENTE informado sobre o andamento do processo de patenteamento.

---

**CLÁUSULA QUINTA - DAS RESPONSABILIDADES**

O CEDENTE declara e garante que:

1. É o legítimo inventor da invenção;
2. A invenção é original e não viola direitos de terceiros;
3. Não cedeu anteriormente os direitos da invenção a terceiros;
4. Não há ações judiciais ou extrajudiciais pendentes sobre a invenção.

---

**CLÁUSULA SEXTA - DA VIGÊNCIA**

O presente termo entra em vigor na data de sua assinatura e vigorará por prazo indeterminado, ou até o término da validade da patente (20 anos para PI, 15 anos para MU).

---

**CLÁUSULA SÉTIMA - DO FORO**

As partes elegem o foro da Comarca de Recife, Estado de Pernambuco, para dirimir quaisquer dúvidas ou controvérsias decorrentes do presente termo.

---

E por estarem justos e contratados, assinam o presente termo em 02 (duas) vias de igual teor e forma.

---

**Recife, ____ de ____________ de 20____.**

______________________________________
**CEDENTE**
[Nome Completo do Inventor]
CPF: 000.000.000-00

______________________________________
**CESSIONÁRIA**
UNIVERSIDADE DE PERNAMBUCO - UPE
Representado por: [Nome do Reitor]
```

---

## 9. DECLARAÇÃO DE INVENTOR

```markdown
# DECLARAÇÃO DE INVENTOR

**NÚMERO DO PEDIDO:** [A definir]  
**DATA:** 28 de dezembro de 2025

---

**Eu,** [Nome Completo do Inventor], portador do CPF nº [000.000.000-00], declaro para os devidos fins que:

---

**1. INVENTOR ORIGINAL**

Sou o inventor original da invenção intitulada:

**Título:** [Título da Invenção]

**Descrição Resumida:** [Descrição da invenção]

---

**2. PARTICIPAÇÃO NA INVENÇÃO**

Participei da invenção nas seguintes atividades:

- [ ] Concepção da ideia
- [ ] Desenvolvimento
- [ ] Testes/Validação
- [ ] Redação do pedido de patente
- [ ] Outros: [especificar]

**Minha participação estimada na invenção é de [XX%].**

---

**3. CESSÃO DE DIREITOS**

Concordo em ceder os direitos de propriedade intelectual da invenção à Universidade de Pernambuco (UPE), conforme Termo de Cessão assinado.

---

**4. AUTORIZAÇÃO**

Autorizo o Núcleo de Inovação Tecnológica (NIT) da UPE a:

1. Processar meu pedido de patente;
2. Enviar o pedido ao INPI para depósito;
3. Defender meus interesses junto ao INPI;
4. Realizar modificações necessárias no pedido de patente.

---

**5. INEXISTÊNCIA DE CONFLITO DE INTERESSE**

Declaro que:

- Não tenho conflito de interesses com a UPE ou com outros inventores;
- Não recebi pagamentos ou benefícios de terceiros relacionados à invenção;
- Não há acordos ou contratos com terceiros sobre a invenção.

---

**6. COMPROMISSO**

Comprometo-me a:

1. Fornecer todas as informações e documentos necessários para o processo de patenteamento;
2. Colaborar com o NIT/UPE em todas as etapas do processo;
3. Manter a confidencialidade das informações sobre a invenção;
4. Não divulgar a invenção sem autorização da UPE.

---

**7. VERACIDADE DAS INFORMAÇÕES**

Declaro que todas as informações prestadas neste documento são verdadeiras e completas, sob as penas da lei.

---

**E por ser verdade, firmo a presente declaração.**

---

**Recife, ____ de ____________ de 20____.**

______________________________________
**[Nome Completo do Inventor]**
CPF: 000.000.000-00
Assinatura: _________________________________________

---

**Testemunhas:**

1. ______________________________
   Assinatura: _____________________

2. ______________________________
   Assinatura: _____________________
```

---

## 10. AUTORIZAÇÃO PARA DEPÓSITO NO INPI

```markdown
# AUTORIZAÇÃO PARA DEPÓSITO NO INPI

**NÚMERO DO PEDIDO:** [A definir]  
**DATA:** 28 de dezembro de 2025

---

**À ILMA. SRA. DIRETORA DO NÚCLEO DE INOVAÇÃO TECNOLÓGICA (NIT)**
**DA UNIVERSIDADE DE PERNAMBUCO (UPE)**

---

**Assunto:** AUTORIZAÇÃO PARA DEPÓSITO DE PEDIDO DE PATENTE NO INPI

---

Eu, [Nome Completo do Inventor], portador do CPF nº [000.000.000-00], venho por meio desta autorizar o Núcleo de Inovação Tecnológica (NIT) da Universidade de Pernambuco (UPE) a:

---

**1. DEPOSITAR PEDIDO DE PATENTE**

Autorizo o NIT/UPE a depositar no Instituto Nacional da Propriedade Industrial (INPI) o pedido de patente intitulado:

**Título:** [Título da Invenção]

**Tipo de Patente:** [PI/MU/CII]

**Resumo:** [Resumo da invenção em 100-150 palavras]

---

**2. ATUAR COMO PROCURADOR**

Autorizo o NIT/UPE a atuar como meu procurador junto ao INPI, podendo:

- Assinar todos os documentos necessários para o depósito;
- Receber e responder a quaisquer exigências do INPI;
- Realizar pagamentos de taxas e emolumentos;
- Consultar o andamento do pedido;
- Apresentar recursos e impugnações;
- Praticar todos os atos necessários para a proteção da invenção.

---

**3. MODIFICAR O PEDIDO**

Autorizo o NIT/UPE a realizar modificações no pedido de patente, incluindo:

- Correções de erros formais;
- Adaptações técnicas;
- Modificações nas reivindicações;
- Alterações no relatório descritivo;

**Desde que:** tais modificações não alterem substancialmente a essência da invenção ou meus direitos como inventor.

---

**4. CESSÃO DE DIREITOS**

Confirmo que cedi os direitos de propriedade intelectual da invenção à Universidade de Pernambuco (UPE), conforme Termo de Cessão assinado.

---

**5. COMPROMISSO DE COLABORAÇÃO**

Comprometo-me a colaborar com o NIT/UPE durante todo o processo de patenteamento, fornecendo:

- Informações adicionais, quando solicitado;
- Documentos complementares, quando necessário;
- Esclarecimentos técnicos, quando requeridos;
- Assinaturas em documentos oficiais, quando aplicável.

---

**6. VIGÊNCIA**

Esta autorização entra em vigor na data de sua assinatura e permanece válida até:

- O deferimento do pedido de patente pelo INPI; ou
- O indeferimento definitivo do pedido pelo INPI; ou
- A retirada voluntária do pedido por mim; ou
- A revogação desta autorização por escrito.

---

**7. RESPONSABILIDADE**

Entendo que o NIT/UPE atuará com diligência e profissionalismo, mas não se responsabiliza por:

- O indeferimento do pedido pelo INPI;
- O conteúdo de exigências do INPI;
- Delays no processamento do pedido;
- Custos adicionais não previstos.

---

**E por ser verdade, firmo a presente autorização.**

---

**Recife, ____ de ____________ de 20____.**

______________________________________
**[Nome Completo do Inventor]**
CPF: 000.000.000-00
Assinatura: _________________________________________

---

**Para conhecimento do NIT/UPE:**

______________________________________
**Coordenador do NIT**
Nome: [Nome do Coordenador]
Assinatura: _________________________________________

Data de Recebimento: ____/____/20____
```

---

## RESUMO DOS FORMULÁRIOS CRIADOS

| # | Formulário | Formato | Páginas | Uso |
|---|-----------|---------|---------|-----|
| 1 | Formulário de Patente Padrão (PI/MU) | HTML | 1 | Fase 2 - Submissão |
| 2 | Formulário de Software CII | HTML | 1 | Fase 2 - Submissão |
| 3 | Formulário de RPC | HTML | 1 | Fase 2 - Submissão |
| 4 | Anexo A - Busca de Anterioridade | Markdown | 2 | Fase 1 - Preparação |
| 5 | Anexo B - Matriz Problema x Solução | Markdown | 3 | Fase 1 - Preparação |
| 6 | Anexo C - Memorial Descritivo | Markdown | 4 | Fase 1 - Preparação |
| 7 | Anexo F - Qualificação de Inventores | Markdown | 2 | Fase 1 - Preparação |
| 8 | Termo de Cessão de Direitos | Markdown | 2 | Fase 4 - Formalização |
| 9 | Declaração de Inventor | Markdown | 2 | Fase 4 - Formalização |
| 10 | Autorização para Depósito INPI | Markdown | 2 | Fase 4 - Formalização |

---

**Total: 10 formulários completos** (3 HTML + 7 Markdown)

Todos os formulários incluem:
- ✅ Validação de campos
- ✅ Limites de caracteres
- ✅ Campos obrigatórios marcados
- ✅ Instruções claras
- ✅ Espaços para assinatura
- ✅ Seções organizadas por fase
