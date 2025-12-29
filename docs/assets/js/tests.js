// Sistema de Testes Automatizados
// NIT/UPE - Sistema de Gestão de Propriedade Intelectual

class TestRunner {
    constructor() {
        this.tests = [];
        this.results = [];
        this.testForms = [
            'formularios/formulario_pi_mu.html',
            'formularios/formulario_cii.html',
            'formularios/formulario_rpc.html',
            'anexos/anexo_a.html',
            'anexos/anexo_b.html',
            'anexos/anexo_c.html',
            'anexos/anexo_f.html'
        ];
    }

    // Adicionar teste
    addTest(name, fn, description = '') {
        this.tests.push({ name, fn, description });
    }

    // Executar todos os testes
    async runAll() {
        console.log('🧪 Iniciando testes...');
        this.results = [];

        for (const test of this.tests) {
            try {
                const result = await test.fn();
                this.results.push({
                    name: test.name,
                    description: test.description,
                    status: 'pass',
                    result
                });
                console.log(`✅ ${test.name}`);
            } catch (error) {
                this.results.push({
                    name: test.name,
                    description: test.description,
                    status: 'fail',
                    error: error.message
                });
                console.log(`❌ ${test.name}: ${error.message}`);
            }
        }

        this.generateReport();
        return this.results;
    }

    // Gerar relatório
    generateReport() {
        const passed = this.results.filter(r => r.status === 'pass').length;
        const failed = this.results.filter(r => r.status === 'fail').length;
        const total = this.results.length;

        console.log('\n📊 Relatório de Testes:');
        console.log(`   Total: ${total}`);
        console.log(`   Passou: ${passed} ✅`);
        console.log(`   Falhou: ${failed} ❌`);
        console.log(`   Taxa de Sucesso: ${((passed/total)*100).toFixed(1)}%`);

        return {
            total,
            passed,
            failed,
            successRate: ((passed/total)*100).toFixed(1),
            results: this.results
        };
    }

    // Exportar relatório
    exportReport() {
        const report = this.generateReport();
        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `test-report-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }
}

// Instância global
const runner = new TestRunner();

// =====================
// TESTES DE FORMULÁRIOS
// =====================

// Teste 1: Verificar existência de todos os formulários
runner.addTest(
    'Formulários Existentes',
    async () => {
        const forms = document.querySelectorAll('form');
        if (forms.length === 0) {
            throw new Error('Nenhum formulário encontrado na página');
        }
        return { count: forms.length };
    },
    'Verifica se os formulários HTML existem na página'
);

// Teste 2: Validar campos obrigatórios
runner.addTest(
    'Validação de Campos Obrigatórios',
    async () => {
        const requiredFields = document.querySelectorAll('[required]');
        const invalidFields = [];

        requiredFields.forEach(field => {
            if (!field.value && field.type !== 'checkbox') {
                invalidFields.push(field.name || field.id);
            }
        });

        if (invalidFields.length > 0) {
            throw new Error(`Campos obrigatórios vazios: ${invalidFields.join(', ')}`);
        }

        return { validated: requiredFields.length };
    },
    'Verifica se todos os campos marcados como required têm valor'
);

// Teste 3: Validar limites de caracteres
runner.addTest(
    'Limites de Caracteres',
    async () => {
        const textareas = document.querySelectorAll('textarea[maxlength]');
        const inputs = document.querySelectorAll('input[type="text"][maxlength]');
        const fields = [...textareas, ...inputs];
        const violations = [];

        fields.forEach(field => {
            const maxLength = parseInt(field.getAttribute('maxlength'));
            if (field.value.length > maxLength) {
                violations.push({
                    field: field.name || field.id,
                    length: field.value.length,
                    max: maxLength
                });
            }
        });

        if (violations.length > 0) {
            throw new Error(`${violations.length} campos excedem o limite de caracteres`);
        }

        return { checked: fields.length };
    },
    'Verifica se nenhum campo excede o limite máximo de caracteres'
);

// Teste 4: Validar formato de e-mail
runner.addTest(
    'Validação de E-mail',
    async () => {
        const emailInputs = document.querySelectorAll('input[type="email"]');
        const invalidEmails = [];
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        emailInputs.forEach(input => {
            if (input.value && !emailRegex.test(input.value)) {
                invalidEmails.push(input.value);
            }
        });

        if (invalidEmails.length > 0) {
            throw new Error(`E-mails inválidos: ${invalidEmails.join(', ')}`);
        }

        return { checked: emailInputs.length };
    },
    'Verifica se todos os campos de e-mail têm formato válido'
);

// Teste 5: Validar CPF
runner.addTest(
    'Validação de CPF',
    async () => {
        const cpfInputs = document.querySelectorAll('input[data-mask="cpf"]');
        const invalidCPFs = [];

        cpfInputs.forEach(input => {
            const cpf = input.value.replace(/\D/g, '');
            if (cpf && cpf.length === 11) {
                // Validar dígitos verificadores
                const cpfWithoutDigits = cpf.slice(0, 9);
                const firstDigit = this.calculateCPFDigit(cpfWithoutDigits);
                const secondDigit = this.calculateCPFDigit(cpfWithoutDigits + firstDigit);

                if (cpf[9] != firstDigit || cpf[10] != secondDigit) {
                    invalidCPFs.push(input.value);
                }
            }
        });

        if (invalidCPFs.length > 0) {
            throw new Error(`CPFs inválidos: ${invalidCPFs.join(', ')}`);
        }

        return { checked: cpfInputs.length };
    },
    'Verifica se todos os CPFs têm dígitos verificadores válidos'
);

// Teste 6: Validar CNPJ
runner.addTest(
    'Validação de CNPJ',
    async () => {
        const cnpjInputs = document.querySelectorAll('input[data-mask="cnpj"]');
        const invalidCNPJs = [];

        cnpjInputs.forEach(input => {
            const cnpj = input.value.replace(/\D/g, '');
            if (cnpj && cnpj.length === 14) {
                // Validar dígitos verificadores
                const cnpjWithoutDigits = cnpj.slice(0, 12);
                const firstDigit = this.calculateCNPJDigit(cnpjWithoutDigits);
                const secondDigit = this.calculateCNPJDigit(cnpjWithoutDigits + firstDigit);

                if (cnpj[12] != firstDigit || cnpj[13] != secondDigit) {
                    invalidCNPJs.push(input.value);
                }
            }
        });

        if (invalidCNPJs.length > 0) {
            throw new Error(`CNPJs inválidos: ${invalidCNPJs.join(', ')}`);
        }

        return { checked: cnpjInputs.length };
    },
    'Verifica se todos os CNPJs têm dígitos verificadores válidos'
);

// Teste 7: Validar CEP
runner.addTest(
    'Validação de CEP',
    async () => {
        const cepInputs = document.querySelectorAll('input[data-mask="cep"]');
        const invalidCEPs = [];

        cepInputs.forEach(input => {
            const cep = input.value.replace(/\D/g, '');
            if (cep && cep.length !== 8) {
                invalidCEPs.push(input.value);
            }
        });

        if (invalidCEPs.length > 0) {
            throw new Error(`CEPs inválidos: ${invalidCEPs.join(', ')}`);
        }

        return { checked: cepInputs.length };
    },
    'Verifica se todos os CEPs têm 8 dígitos'
);

// Teste 8: Validar upload de arquivos
runner.addTest(
    'Validação de Upload de Arquivos',
    async () => {
        const fileInputs = document.querySelectorAll('input[type="file"]');
        const invalidFiles = [];

        fileInputs.forEach(input => {
            const files = input.files;
            const maxSize = input.getAttribute('data-max-size') || 10485760; // 10MB default
            const allowedTypes = input.getAttribute('accept')?.split(',');

            for (let i = 0; i < files.length; i++) {
                const file = files[i];

                // Verificar tamanho
                if (file.size > maxSize) {
                    invalidFiles.push({
                        file: file.name,
                        reason: 'excede tamanho máximo'
                    });
                }

                // Verificar tipo
                if (allowedTypes && !allowedTypes.includes(file.type)) {
                    invalidFiles.push({
                        file: file.name,
                        reason: 'tipo não permitido'
                    });
                }
            }
        });

        if (invalidFiles.length > 0) {
            throw new Error(`Arquivos inválidos: ${invalidFiles.map(f => f.file).join(', ')}`);
        }

        return { checked: fileInputs.length };
    },
    'Verifica se todos os arquivos atendem aos requisitos de tipo e tamanho'
);

// Teste 9: Verificar terminologia padronizada
runner.addTest(
    'Terminologia Padronizada',
    async () => {
        const bodyText = document.body.innerText;
        const terminologia = {
            'PI': 'Patente de Invenção',
            'MU': 'Modelo de Utilidade',
            'CII': 'Computer Implemented Invention',
            'RPC': 'Registro de Programa de Computador',
            'NIT': 'Núcleo de Inovação Tecnológica'
        };

        const issues = [];

        // Verificar uso correto de abreviações
        for (const [abbr, full] of Object.entries(terminologia)) {
            const regex = new RegExp(`\\b${full}\\b`, 'gi');
            if (regex.test(bodyText) && !new RegExp(`\\b${abbr}\\b`, 'g').test(bodyText)) {
                issues.push(`Uso de "${full}" sem abreviação "${abbr}"`);
            }
        }

        return { terminologia: Object.keys(terminologia), issues };
    },
    'Verifica o uso correto da terminologia padronizada (PI, MU, CII, RPC, NIT)'
);

// Teste 10: Verificar contadores de caracteres
runner.addTest(
    'Contadores de Caracteres',
    async () => {
        const charCounters = document.querySelectorAll('.char-count');
        const inputsWithCounters = [];

        charCounters.forEach(counter => {
            const input = counter.previousElementSibling;
            if (input) {
                inputsWithCounters.push({
                    field: input.name || input.id,
                    counter: counter.textContent
                });
            }
        });

        if (inputsWithCounters.length === 0) {
            console.warn('⚠️  Nenhum contador de caracteres encontrado');
        }

        return { count: charCounters.length };
    },
    'Verifica se campos com limite de caracteres têm contadores visíveis'
);

// Teste 11: Verificar responsividade
runner.addTest(
    'Responsividade',
    async () => {
        const viewportWidth = window.innerWidth;
        const breakpoints = {
            mobile: 768,
            tablet: 1024,
            desktop: 1200
        };

        let currentBreakpoint = 'desktop';
        if (viewportWidth < breakpoints.mobile) currentBreakpoint = 'mobile';
        else if (viewportWidth < breakpoints.tablet) currentBreakpoint = 'tablet';

        return { viewportWidth, breakpoint: currentBreakpoint };
    },
    'Verifica a largura da viewport atual e o breakpoint correspondente'
);

// Teste 12: Verificar acessibilidade (ARIA)
runner.addTest(
    'Acessibilidade ARIA',
    async () => {
        const ariaLabels = document.querySelectorAll('[aria-label]');
        const ariaDescriptions = document.querySelectorAll('[aria-describedby]');
        const requiredAria = document.querySelectorAll('[required]:not([aria-required])');

        const issues = [];

        if (ariaLabels.length === 0 && document.querySelectorAll('input, select, textarea').length > 5) {
            issues.push('Poucos elementos com aria-label');
        }

        if (requiredAria.length > 0) {
            console.log('⚠️  Campos required sem aria-required:', requiredAria.length);
        }

        return {
            ariaLabels: ariaLabels.length,
            ariaDescriptions: ariaDescriptions.length,
            issues
        };
    },
    'Verifica práticas básicas de acessibilidade (aria-label, aria-describedby)'
);

// =====================
// FUNÇÕES AUXILIARES
// =====================

TestRunner.prototype.calculateCPFDigit = function(cpf) {
    let sum = 0;
    for (let i = 0; i < cpf.length; i++) {
        sum += parseInt(cpf[i]) * (cpf.length + 1 - i);
    }
    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
};

TestRunner.prototype.calculateCNPJDigit = function(cnpj) {
    let sum = 0;
    let weight = cnpj.length === 12 ? 5 : 6;
    for (let i = 0; i < cnpj.length; i++) {
        sum += parseInt(cnpj[i]) * weight;
        weight = weight === 2 ? 9 : weight - 1;
    }
    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
};

// =====================
// FUNÇÕES GLOBAIS
// =====================

// Executar todos os testes
function runAllTests() {
    runner.runAll().then(results => {
        // Atualizar UI com resultados
        const testItems = document.querySelectorAll('.test-item');
        results.forEach((result, index) => {
            if (testItems[index]) {
                const status = testItems[index].querySelector('.test-status');
                if (result.status === 'pass') {
                    status.textContent = 'PASS';
                    status.className = 'test-status test-status-success';
                } else {
                    status.textContent = 'FAIL';
                    status.className = 'test-status test-status-fail';
                }
            }
        });

        // Exibir alerta com resumo
        const passed = results.filter(r => r.status === 'pass').length;
        const total = results.length;
        alert(`✅ Testes concluídos!\n\nPassou: ${passed}/${total}\nTaxa de Sucesso: ${((passed/total)*100).toFixed(1)}%`);
    });
}

// Exportar relatório de testes
function exportTestReport() {
    runner.exportReport();
}

// =====================
// INICIALIZAÇÃO
// =====================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Sistema de Testes carregado');
    console.log('📝 Formulários disponíveis:', runner.testForms);
    console.log('🧪 Testes configurados:', runner.tests.length);
});

// Expor para console global
window.testRunner = runner;
window.runAllTests = runAllTests;
window.exportTestReport = exportTestReport;
