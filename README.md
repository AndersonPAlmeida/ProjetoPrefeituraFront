Agendador
=========

O aplicativo Agendador foi desenvolvido para viabilizar a automatização do agendamento dos atendimentos com hora marcada em órgãos públicos, permitindo que uma prefeitura crie, por exemplo, horários de atendimento para médicos em postos de saúde.

Informações
-----------
## Docker
Instale o [docker-ce](https://docs.docker.com/install/) e configure o dns em `/etc/docker/daemon.json`
```
{
   "dns": [ "200.17.202.3"]
}
```

```
Aviso

Este Dockerfile deve ser apenas usado em development

```
```bash
  $ git clone git@gitlab.c3sl.ufpr.br:agendador/Back-end-server.git
  $ sudo docker-compose up
```


* Versão node: v5.x
* Versão npm: latest

Git:
```bash
  $ sudo apt-get install git
```
Instalação node:
  Ao instalar o node, o npm já vem incluso.
  Para instalar node basta usar o installer: https://nodejs.org/en/download/

npm:
```bash
  $ npm install npm@latest -g
```

## Execução (desenvolvimento)
```bash
  $ npm install
  $ npm run dev
```

## Execução (produção)
```bash
  $ npm install
  $ npm run build
  $ npm start
```
