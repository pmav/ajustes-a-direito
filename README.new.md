# Ajustes a Direito #

### Links ###

- https://trello.com/b/L7Y2Xx9v/ajustes-a-direito

- https://www.facebook.com/AjustesDireitos

- https://twitter.com/AjustesDireitos/

### Setup de Desenvolvimento ###

* Instalar vagrant: https://www.vagrantup.com/
* Abrir terminal na directoria do ficheiro Vagrantfile e correr "vagrant up"
* Esperar que a VM seja criada e inicializada (pode demorar)
* Após o processo ter terminado a VM está pronta para desenvolvimento com um servior de redis e outro de beanstalkd a correr nos portos default, via docker.
* Para ligar à VM fazer "vagrant ssh", uma vez feito o login passar para o directório partilhado: cd /vagrant
* Este directório está partilhado com o host e tem acesso a alterações de código em tempo real
* Dentro da VM correr "docker ps" para ver que containers estão a correr
* Para instalar os node modules necessários correr "npm install --no-bin-links" em /vagrant
* Para correr a aplicação fazer "sh producer.sh" e "sh publisher.sh"

### Componentes ###

* Servidor redis (docker)
* Servidor beanstalkd (docker)
* App producer.js (lê posts do portal do gov. e coloca os novos na queue - para verificar quais ainda não foram processados usa redis)
* App publisher.js (lê posts da queue e publica no twitter, facebook, etc.)

### Como funciona (versão antiga) ###

1. Liga-se ao portal Base para fazer download os ajustes directos mais recentes (http://www.base.gov.pt/base2/rest/contratos.csv)
2. Verifica quais já foram processados através do registo dos mesmo numa instância Redis
3. Novas entradas são inseridas no Redis e postadas para o Twitter (@AjustesDireitos)
4. Post para o Twitter tem algum processamento para que o texto do ajuste + valor + entidade fique abaixo do limite de 160 caracteres (E.G.: "Prestação de Serviços em regime de tarefa para as atividades no Parque Desportiv..|Municpio de Oliveira do Bairro|10560,00€")
