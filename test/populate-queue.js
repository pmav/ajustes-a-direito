var config = require('../config/config.js');

var fivebeans = require('fivebeans');

var entries = [{
  "ContracObject": "Aluguer de oito (8) autocarros para assegurar transportes escolares e o serviço de vigilância humana para acompanhamento e supervisão dos alunos nos trajetos do transporte escolar",
  "Buyer": "Camara Municipal de Palmela (506187543)",
  "Seller": "\"Traviama - Transportes Terrestres de Passageiros, Lda (506855155)\"",
  "Cost": "\"173.370,40 €\"",
  "Date": "27-10-2015",
  "Hash": "f201e03ca0b888b25e90db36103f6ae1"
}, {
  "ContracObject": "Construção das Piscinas Cobertas de Pinhel",
  "Buyer": "Município de Pinhel (506787249)",
  "Seller": "\"Biosfera Construções, Unip. Lda. (508307880)\"",
  "Cost": "\"1.562.000,00 €\"",
  "Date": "27-10-2015",
  "Hash": "be79edb5e91d2cc63481ad9a00b18449"
}, {
  "ContracObject": "\"Prestação de serviços de manutenção de espaços exteriores, incluindo as zonas verdes e pavimentadas com calçada dos passeios e pracetas\"",
  "Buyer": "Município de Palmela (506187543)",
  "Seller": "\"Centro de Jardinagem Sogrene, Lda (502778687)\"",
  "Cost": "\"152.042,71 €\"",
  "Date": "27-10-2015",
  "Hash": "b60c261d6bb9184500a2c505dea7845b"
}, {
  "ContracObject": "Fornecimento de equipamentos audiovisuais e de ativos de rede e equipamentos de comunicações para o Centro de Documentação 25 de Abril e Centro de Estudos Sociais da Universidade de Coimbra",
  "Buyer": "Universidade de Coimbra (501617582)",
  "Seller": "\"Decunify - Soluções e Comunicações, SA (504889893)\"",
  "Cost": "\"99.493,35 €\"",
  "Date": "27-10-2015",
  "Hash": "933ac5decaf717bf38f940c49c8f0693"
}, {
  "ContracObject": "\"União das Freguesias de Santiago de Litém, S. Simão de Litém e Albergaria dos Doze / Asfaltagem de estradas e caminhos na Freguesia [E.M. 532-1 (Castelo - Albergaria dos Doze), Albergaria dos Doze, Cartaria e Vidoeira] - Proc. n.º 49/2015\"",
  "Buyer": "Município de Pombal (506334562)",
  "Seller": "\"Contec - Construção e Engenharia, S.A. (501436162)\"",
  "Cost": "\"122.554,28 €\"",
  "Date": "27-10-2015",
  "Hash": "3cb4ddff1975c6d7acdd58907ab6475e"
}, {
  "ContracObject": "\"Fornecimento de energia elétrica para as instalações alimentadas em MT – Média Tensão (lote 1), BTE - Baixa Tensão Especial (lote 2), BTN - Baixa Tensão Normal “Iluminação Pública” (lote 3), e BTN- Baixa Tensão Normal, excluindo Iluminação Pública – Instalações Municipais (lote 4), pelo período de um ano.\"",
  "Buyer": "Município de Braga (506901173)",
  "Seller": "\"EDP Comercial – Comercialização de Energia, S.A. (503504564)\"",
  "Cost": "\"2.238.649,37 €\"",
  "Date": "27-10-2015",
  "Hash": "e6d08cff1770a052133e5d5105d1ad2c"
}, {
  "ContracObject": "Prestação de Serviços de Limpeza Química das Caldeiras",
  "Buyer": "\"Valorsul - Valorização e Tratamento de Resíduos Sólidos das Regiões de Lisboa e do Oeste, S. A. (509479600)\"",
  "Seller": "\"LQI – Serviços Industrias, S.A. (501438114)\"",
  "Cost": "\"0,00 €\"",
  "Date": "27-10-2015",
  "Hash": "ab257355dc411b9143c2522791ac0ad2"
}, {
  "ContracObject": "Aquisição de Mobiliário Geral e Mobiliário Administrativo e Hospitalar para o Lar de Idosos e Creche",
  "Buyer": "Centro Social Professora Elisa Barros Silva (502023910)",
  "Seller": "\"Móvel4 II Companhia do Móvel, Lda. (510655238)\"",
  "Cost": "\"144.106,00 €\"",
  "Date": "27-10-2015",
  "Hash": "ddfcc86bb3e83dc010f7b81b04cec2a5"
}, {
  "ContracObject": "Prestação de serviços de manutenção do equipamento lúdico-desportivo nas Escolas do 1.º Ciclo do Ensino Básico do Concelho de Almada",
  "Buyer": "Câmara Municipal de Almada (500051054)",
  "Seller": "\"PLAY PLANET - MOB. URBANO, CONSTRUÇÃO E PAISAGISMO, LDA (509295770)\"",
  "Cost": "\"25.000,00 €\"",
  "Date": "27-10-2015",
  "Hash": "6b41da0c5289551001e006717d99cd7b"
}, {
  "ContracObject": "\"Limpeza e Beneficiação dos Rios e Ribeiros no Concelho (Reabilitação, Limpeza e valorização do Rio Arunca) - Proc. n.º 39/2015\"",
  "Buyer": "Município de Pombal (506334562)",
  "Seller": "\"MarvãoMáquinas - Aluguer de Máquinas, Lda. (503623130)\"",
  "Cost": "\"120.682,46 €\"",
  "Date": "27-10-2015",
  "Hash": "64004c3252c50b5f0bf8b7b31597b698"
}, {
  "ContracObject": "\"Fornecimento de energia eléctrica em Média Tensão, Baixa Tensão Especial, Baixa Tensão Normal e Iluminação Pública. \"",
  "Buyer": "Município de Pinhel (506787249)",
  "Seller": "\"HEN - Serviços Energéticos, Lda. (510287050)\"",
  "Cost": "\"573.029,67 €\"",
  "Date": "27-10-2015",
  "Hash": "e1b8332b502882c00b609453d6159e59"
}, {
  "ContracObject": "Aquisição de sobresselentes panhard m11",
  "Buyer": "Estado Maior do Exército (600021610)",
  "Seller": "Panhard General Defense (25652036591)",
  "Cost": "\"349.686,55 €\"",
  "Date": "26-10-2015",
  "Hash": "e5084da2eb13f5c2fcf98d4bf49cff24"
}, {
  "ContracObject": "Fornecimento contínuo de gasóleo rodoviário .",
  "Buyer": "Município de Campo Maior (501175229)",
  "Seller": "\"Francisco Laia Nunes, Lda. (502659726)\"",
  "Cost": "\"126.100,00 €\"",
  "Date": "26-10-2015",
  "Hash": "26f729b70c508908a756b92ced34cf3f"
}, {
  "ContracObject": "Serviços de limpeza para instalações da C.M.P.",
  "Buyer": "Município de Palmela (506187543)",
  "Seller": "\"Euromex - Facility Services, Lda (502629428)\"",
  "Cost": "\"163.440,00 €\"",
  "Date": "26-10-2015",
  "Hash": "18bced480d5d4d0592261a20173a74a2"
}, {
  "ContracObject": "\"Fornecimento de chapas para tromel tr01,02,03,04 \"",
  "Buyer": "\"Tratolixo - Tratamento de Resíduos Sólidos, E. I. M. (502444010)\"",
  "Seller": "\"Masias Recycling, S.L. (B-17282567)\"",
  "Cost": "\"90.815,76 €\"",
  "Date": "26-10-2015",
  "Hash": "9801e1554307e90df4faf7b651898f20"
}, {
  "ContracObject": "Serviços de limpeza e desobstrução de emissários e transporte de lamas líquidas",
  "Buyer": "\"Simlis - Saneamento integrado dos Municípios do Lis, S. A. (504864688)\"",
  "Seller": "\"Octalimpa - Limpezas Unipessoal, Lda. (507187482)\"",
  "Cost": "\"231.000,00 €\"",
  "Date": "26-10-2015",
  "Hash": "0331beb377f8cd3a20f06bbb356d32df"
}, {
  "ContracObject": "\"Recolha e Tratamento de lamas digeridas da Central de Digestão Anaeróbia, na Abrunheira, Mafra\"",
  "Buyer": "\"Tratolixo - Tratamento de Resíduos Sólidos, E. I. M. (502444010)\"",
  "Seller": "\"CITRI, Centro Integrado de Tratamento de Resíduos Industriais, S.A. (504472046)\"",
  "Cost": "\"65.520,00 €\"",
  "Date": "27-10-2015",
  "Hash": "73951e213bb8e06f734cfb471e202095"
}, {
  "ContracObject": "Deposição de monstros",
  "Buyer": "\"Tratolixo - Tratamento de Resíduos Sólidos, E. I. M. (502444010)\"",
  "Seller": "\"CITRI, Centro Integrado de Tratamento de Resíduos Industriais, S.A. (504472046)\"",
  "Cost": "\"91.960,00 €\"",
  "Date": "27-10-2015",
  "Hash": "b2f842464bb4403c179937444771d4cf"
}, {
  "ContracObject": "\"PRESTAÇÃO DE SERVIÇOS DE MANUTENÇÃO E ASSISTÊNCIA TÉCNICA AOS SISTEMAS AVAC E INSTALAÇÕES DE AR CONDICIONADO DE CENTROS DE SAÚDE E SERVIÇOS DO SESARAM, EPE.\"",
  "Buyer": "\"Serviço de Saúde da Região Autónoma da Madeira, E. P. E. (511228848)\"",
  "Seller": "\"OPENLINE FACILITY SERVICES, SA. (508622069)\"",
  "Cost": "\"41.600,00 €\"",
  "Date": "27-10-2015",
  "Hash": "9d0f664027190a8e57f9d221b936f6eb"
}, {
  "ContracObject": "\"Aquisição de reagentes para a realização de análises clínicas nas unidades funcionais da química clínica e urgência do Serviço de Patologia Clínica do Centro Hospitalar Lisboa Norte, EPE\"",
  "Buyer": "\"Centro Hospitalar Lisboa Norte, E. P. E. (508481287)\"",
  "Seller": "\"Roche, Lda. (504282921)\"",
  "Cost": "\"1.355.401,33 €\"",
  "Date": "27-10-2015",
  "Hash": "7da3f5caed29dff294150d9e49a97540"
}, {
  "ContracObject": "\"Execução de moviemntação de terras, demolições, pavimentos e colocação de lancis, colocação de mobiliário urbano, arborização em caldeiras e criação de zona verde em prado florido incluindo rede de rega.\"",
  "Buyer": "Município de Palmela (506187543)",
  "Seller": "\"Florindo Rodrigues Júnior & Filhos, SA (500603456)\"",
  "Cost": "\"39.598,98 €\"",
  "Date": "27-10-2015",
  "Hash": "62a81e33b8bb4061c4cbce54e19b62a5"
}, {
  "ContracObject": "\"Contrato de fiscalização e controlo da empreitada de Reabilitação da \"\"Ilha\"\" da Bela Vista (1.ª Fase) (SE.004.2015.010)\"",
  "Buyer": "\"CMPH - DomusSocial - Empresa de Habitação e Manutenção do Município do Porto, EEM (505037700)\"",
  "Seller": "\"Cotefis - Gestão de Projectos, SA (502693622)\"",
  "Cost": "\"33.732,50 €\"",
  "Date": "27-10-2015",
  "Hash": "2d6e30067e1296ebb67a94a80d67cb3e"
}, {
  "ContracObject": "\"Empreitada de \"\"Dragagens de manutenção no Portinho de Vila Praia de Âncora\"\"\"",
  "Buyer": "\"Direção-Geral de Recursos Naturais, Segurança e Serviços Marítimos (600084973)\"",
  "Seller": "\"Alexandre Barbosa Borges, S.A. (500553408)\"",
  "Cost": "\"329.867,10 €\"",
  "Date": "27-10-2015",
  "Hash": "f397bff8a4ce03b3cd6a628e39390ab1"
}, {
  "ContracObject": "Colheita e Análises Fisico-Químicas e Microbiológicas para Controlo de Qualidade da Água no Subsistema de Água Residual",
  "Buyer": "\"Águas de Santo André, S. A. (505600005)\"",
  "Seller": "\"Laboratório de Águas do Litoral Alentejano, Lda. (503310980)\"",
  "Cost": "\"86.804,90 €\"",
  "Date": "27-10-2015",
  "Hash": "d621f93060e04b8b19aac5a2804e8ce0"
}, {
  "ContracObject": "\" AQUISIÇÃO DE SISTEMAS DE PURIFICAÇÃO DE ÁGUA PARA OBTENÇÃO DE ÁGUA PURIFICADA DE QUALIDADE, PARA A UNIDADE DE INVESTIGAÇÃO IBIMED DA SECÇÃO AUTÓNOMA DAS CIÊNCIAS DE SAÚDE UNIVERSIDADE DE AVEIRO\"",
  "Buyer": "Universidade de Aveiro (501461108)",
  "Seller": "Millipore S.A.S.  (FR59434691192)",
  "Cost": "\"52.186,58 €\"",
  "Date": "27-10-2015",
  "Hash": "d523d7ce900e4f3412b7802aff9af6ee"
}, {
  "ContracObject": "\"Execução de Infraestruturas de Águas Pluviais na Praceta de S.Bartolomeu, Rua da Bela Vista, Rua do Viso, Rua D.Sancho I e Rua Cidade de Viseu\"",
  "Buyer": "Município de Aveiro (505931192)",
  "Seller": "\"MANUEL FRANCISCO DE ALMEIDA, S.A. (500178585)\"",
  "Cost": "\"57.128,08 €\"",
  "Date": "26-10-2015",
  "Hash": "5da84d14495df64f7b614eeb2047872e"
}, {
  "ContracObject": "\"Fornecimento de Energia Eléctrica para as Instalações Alimentadas em Média Tensão e Baixa Tensão Especial, das Instalações dos Serviços Municipalizados\"",
  "Buyer": "Serviços Municipalizados de Viseu (680020063)",
  "Seller": "\"EDP Comercial - Comercialização de Energia, S.A. (503504564)\"",
  "Cost": "\"593.688,39 €\"",
  "Date": "26-10-2015",
  "Hash": "c18ce8377a6b55d6cab1812131cbdab3"
}, {
  "ContracObject": "CONTRATO DE AQUISIÇÃO DE SERVIÇOS DE RECOLHA DE RESÍDUOS SÓLIDOS URBANOS NO CONCELHO DE VALPAÇOS",
  "Buyer": "Município de Valpaços (506874320)",
  "Seller": "\"SUMA - SERVIÇOS URBANOS E MEIO AMBIENTE, S.A. (503210560)\"",
  "Cost": "\"174.000,00 €\"",
  "Date": "26-10-2015",
  "Hash": "7b0e0f1a2516adb62bc5791aa927cd79"
}, {
  "ContracObject": "Combustíveis a granel (gasolina 95 e gasóleo rodoviário)",
  "Buyer": "\"Inframoura, E.M. (504915266)\"",
  "Seller": "\"NORBAT - Baterias, Combustíveis e Lurbificantes, Lda. (505377934)\"",
  "Cost": "\"143.880,60 €\"",
  "Date": "26-10-2015",
  "Hash": "34d7509d3baa3b22efd77dab55c11548"
}, {
  "ContracObject": "Serviços de inspecção revisão e manutenção e recarga de meios de combate a incêndio",
  "Buyer": "Faculdade de Arquitetura da Universidade de Lisboa (502784083)",
  "Seller": "Visacção - Segurança Privada S.A. (507756002)",
  "Cost": "\"3.612,30 €\"",
  "Date": "26-10-2015",
  "Hash": "08ff71f1941f2bbeef20363d5271f221"
}];

var maxEntriesToProcess = 1;
var processedEntries = 0;
var toProccessEntries = Math.min(entries.length, maxEntriesToProcess);

function populateQueue() {
  for (var i = 0; i < toProccessEntries; i++) {
    processedEntries++;
    beans.put(JSON.stringify(entries[i]));
  }
}

//=====================  FIVE BEANS

var beans = {
  init: function() {
    queueClient = new fivebeans.client(config.beanstalkd.address, config.beanstalkd.port);
    queueClient.on('connect', function() {
        queueClient.use(config.beanstalkd.tube, function(err, response) {
          populateQueue();
        });
      })
      .on('error', function(err) {
        console.log("Error connection Beanstalkd - " + err);
      })
      .on('close', function() {
        console.log("Connection to Beanstalkd closed");
      })
      .connect();
  },

  put: function(payload) {
    return function(payload, inProcessedEntries, inEntriesToProcess) {
      queueClient.put(0, 0, 30, payload, function(err, jobid) {
        if (err)
          console.log("Error inserting in queue - Payload: " + JSON.stringify(payload));

        if (inProcessedEntries === toProccessEntries) {
          queueClient.end();
        }
      });
    }(payload, processedEntries)
  }
}

beans.init();
