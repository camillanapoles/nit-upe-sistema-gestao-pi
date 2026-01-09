// Seed script para inicializar o banco de dados com dados de exemplo

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seed do banco de dados...');

  // Limpar dados existentes (apenas em desenvolvimento)
  if (process.env.NODE_ENV !== 'production') {
    console.log('Limpando dados existentes...');
    await prisma.historico.deleteMany();
    await prisma.avaliacao.deleteMany();
    await prisma.anexo.deleteMany();
    await prisma.pedido.deleteMany();
    await prisma.usuario.deleteMany();
  }

  // Criar usuários de exemplo
  const hashedPassword = await bcrypt.hash('Senha123', 10);

  const admin = await prisma.usuario.upsert({
    where: { email: 'admin@upe.br' },
    update: {},
    create: {
      email: 'admin@upe.br',
      nome: 'Administrador do Sistema',
      senha: hashedPassword,
      role: 'ADMIN',
      cpf: '12345678900',
      telefone: '(81) 99999-0001',
      departamento: 'NIT',
    },
  });

  const inventor = await prisma.usuario.upsert({
    where: { email: 'inventor@upe.br' },
    update: {},
    create: {
      email: 'inventor@upe.br',
      nome: 'Dr. João Silva',
      senha: hashedPassword,
      role: 'INVENTOR',
      cpf: '98765432100',
      telefone: '(81) 99999-0002',
      departamento: 'Departamento de Engenharia',
    },
  });

  const avaliador = await prisma.usuario.upsert({
    where: { email: 'avaliador@upe.br' },
    update: {},
    create: {
      email: 'avaliador@upe.br',
      nome: 'Dra. Maria Santos',
      senha: hashedPassword,
      role: 'AVALIADOR',
      cpf: '11122233344',
      telefone: '(81) 99999-0003',
      departamento: 'NIT',
    },
  });

  console.log('Usuários criados:', { admin, inventor, avaliador });

  // Criar pedidos de exemplo
  const pedido1 = await prisma.pedido.create({
    data: {
      numeroPedido: 'PED-2024-0001',
      tipo: 'PI',
      titulo: 'Dispositivo Odontológico para Tratamento de Lesões em Mucosa Oral',
      problema: 'O tratamento de lesões na mucosa oral requer procedimentos complexos e frequentes aplicação de medicamentos, causando desconforto aos pacientes e baixa adesão ao tratamento. As soluções atuais não permitem liberação controlada de princípios ativos na área afetada.',
      solucao: 'Dispositivo de liberação controlada de princípios ativos para tratamento de lesões em mucosa oral, composto por matriz polimérica biocompatível que adere à área afetada e libera gradualmente o medicamento ao longo de 12 horas, reduzindo a frequência de aplicação e melhorando a eficácia do tratamento.',
      estadoTecnica: 'Existem géis e pomadas disponíveis no mercado, porém requerem aplicação frequente (3 a 4 vezes ao dia). Há também filmes bioadesivos, mas com baixa capacidade de retenção e liberação não controlada. Nenhum produto disponível combina alta adesão com liberação controlada de longo prazo.',
      vantagens: 'Redução de 40% no tempo de tratamento; 35% menos dor durante aplicação; Liberação controlada por 12 horas; Fácil aplicação; Biocompatibilidade comprovada; Custo de produção 30% inferior às soluções importadas.',
      palavrasChave: 'cicatrização, odontologia, dispositivo, liberação controlada, mucosa oral',
      resumo: 'Dispositivo bioadesivo para liberação controlada de medicamentos no tratamento de lesões bucais, permitindo aplicação única diária com maior eficácia terapêutica.',
      faseAtual: 'ANALISE',
      status: 'EM_ANALISE',
      inventorId: inventor.id,
    },
  });

  const pedido2 = await prisma.pedido.create({
    data: {
      numeroPedido: 'PED-2024-0002',
      tipo: 'CII',
      titulo: 'Sistema de Análise de Imagens Médicas por Inteligência Artificial',
      problema: 'O diagnóstico de imagens médicas depende da experiência e disponibilidade do radiologista. Em regiões com escassez de especialistas, o diagnóstico demora dias ou semanas, atrasando o início do tratamento. Sistemas CAD existentes possuem alta taxa de falso positivo, gerando exames desnecessários.',
      solucao: 'Algoritmo de deep learning baseado em redes neurais convolucionais para análise automática de exames de radiografia, tomografia e ressonância magnética. O sistema utiliza transfer learning com dataset validado de 2 milhões de imagens, alcançando precisão de 97% na detecção de anomalias.',
      estadoTecnica: 'Existem sistemas CAD (Computer-Aided Detection) com precisão entre 75-85%. Sistemas baseados em IA mais recentes alcançam 90%, mas requerem hardware especializado. A proposta utiliza arquitetura otimizada que roda em hardware convencional com precisão superior.',
      vantagens: 'Precisão de 97% vs 85% dos melhores sistemas atuais; Tempo de análise de 30 segundos vs 20 minutos (média humana); Não requer hardware especializado; Custo de implementação 70% inferior; Interface web para acesso remoto.',
      palavrasChave: 'IA, radiologia, diagnóstico, deep learning, CNN, imagem médica',
      resumo: 'Sistema de análise de imagens médicas por IA que alcança 97% de precisão em 30 segundos, acessível via web sem hardware especializado.',
      faseAtual: 'SUBMISSAO',
      status: 'RASCUNHO',
      inventorId: inventor.id,
    },
  });

  const pedido3 = await prisma.pedido.create({
    data: {
      numeroPedido: 'PED-2024-0003',
      tipo: 'MU',
      titulo: 'Dispositivo de Fixação para Cateteres Venosos',
      problema: 'A fixação de cateteres venosos é geralmente feita com esparadrapo ou fitas adesivas que podem causar alergias, irritação da pele ou descolamento acidental. Pacientes que se movimentam muito têm maior risco de perda do acesso venoso.',
      solucao: 'Dispositivo de fixação ajustável com mecanismo de travamento que mantém o cateter firmemente no lugar sem adesivos na pele. Composto por material hipoalergênico com formato anatômico que se adapta a diferentes regiões do corpo.',
      estadoTecnica: 'Existem fixadores que utilizam adesivos ou braçadeiras elásticas. Adesivos causam alergias em 15% dos pacientes. Braçadeiras elásticas podem escorregar. Nenhum produto combina fixação segura com conforto prolongado.',
      vantagens: 'Zero alergias por contato com adesivos; Redução de 90% nos casos de descolamento; Reutilizável; Podem ser esterilizados; Custo similar a fixadores convencionais; Fácil aplicação por um único profissional.',
      palavrasChave: 'cateter, fixação, venoso, dispositivo médico, hipoalergênico',
      resumo: 'Dispositivo de fixação mecânica para cateteres venosos sem adesivos, reduzindo alergias e descolamentos.',
      faseAtual: 'PREPARACAO',
      status: 'RASCUNHO',
      inventorId: inventor.id,
    },
  });

  console.log('Pedidos criados:', { pedido1, pedido2, pedido3 });

  // Criar histórico para os pedidos
  await prisma.historico.create({
    data: {
      pedidoId: pedido1.id,
      acao: 'CRIADO',
      valorNovo: 'Pedido criado via seed',
      createdBy: inventor.id,
    },
  });

  await prisma.historico.create({
    data: {
      pedidoId: pedido1.id,
      acao: 'STATUS_ALTERADO',
      valorAntigo: 'RASCUNHO',
      valorNovo: 'EM_ANALISE',
      createdBy: inventor.id,
    },
  });

  console.log('Histórico criado');

  // Criar uma avaliação de exemplo
  await prisma.avaliacao.create({
    data: {
      pedidoId: pedido1.id,
      avaliadorId: avaliador.id,
      novidade: true,
      atividadeInventiva: true,
      aplicacaoIndustrial: true,
      suficienciaDescritiva: true,
      classificacao: 'VERDE',
      parecerTecnico: 'A invenção apresenta clareza na descrição do problema técnico e solução proposta. A análise de anterioridade demonstra conhecimento do estado da técnica. Os resultados claimed são plausíveis e consistentes. Recomenda-se prosseguir com a formalização.',
      recomendacoes: 'Sugerido incluir dados comparativos adicionais na seção de vantagens.',
    },
  });

  console.log('Avaliação criada');

  console.log('Seed concluído com sucesso!');
  console.log('\nUsuários de teste:');
  console.log('  - admin@upe.br / Senha123 (ADMIN)');
  console.log('  - inventor@upe.br / Senha123 (INVENTOR)');
  console.log('  - avaliador@upe.br / Senha123 (AVALIADOR)');
}

main()
  .catch((e) => {
    console.error('Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
