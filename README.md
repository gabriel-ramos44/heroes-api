## API NestJS - Documentação

Este projeto implementa uma API RESTful com autenticação JWT usando NestJS, TypeORM e MongoDB.

### Pré-requisitos

- **Node.js e npm**
- **MongoDB:** Tenha uma instância do MongoDB em execução.

### Configuração Local


1. **Instale as dependências:**
   npm install

2. **Configure o Banco de Dados:**
   - Crie um arquivo chamado `.env` na raiz do projeto.
   - Adicione as seguintes variáveis de ambiente, substituindo os valores entre colchetes pelos seus dados de conexão com o MongoDB:
     ```
     DATABASE_HOST=[SEU_HOST_DO_MONGODB]
     DATABASE_PORT=[SUA_PORTA_DO_MONGODB]
     DATABASE_NAME=[NOME_DO_SEU_BANCO_DE_DADOS]
     DATABASE_USER=[SEU_USUÁRIO_DO_MONGODB]
     DATABASE_PASSWORD=[SUA_SENHA_DO_MONGODB]
     JWT_SECRET=[SUA_CHAVE_SECRETA_JWT]
     ```

5. **Inicie o Servidor:**
   npm run start

   A API estará disponível em `http://localhost:3000`.

### Implantação em Docker

1. **Construa a Imagem Docker:**
   docker build -t <heroes_api_image> .

2. **Execute o Container Docker:**
   docker run -p 3000:3000 -d <heroes_api_image>



### Implantação na AWS (Exemplo com Elastic Beanstalk)

1. **Crie um Arquivo `Procfile`:**
   ```
   web: npm run start:prod
   ```

2. **Crie um Arquivo `eb-deploy.config.js`:**
  ```javascript
  module.exports = {
    "aws-eb": {
      "settings": {
        "healthcheckurl": "/",
        "nodecommand": "npm run start:prod",
        "npm": {
          "install": ["npm install --production"]
        },
        "environment": {
          // Suas variáveis de ambiente
          "DATABASE_HOST": "host_do_mongodb",
          "DATABASE_PORT": "porta_do_mongodb",
          "DATABASE_NAME": "nome_do_banco_de_dados",
          "DATABASE_USER": "usuário_do_mongodb",
          "DATABASE_PASSWORD": "senha_do_mongodb",
          "JWT_SECRET": "have_secreta_jwt"
        },
        "build": {
          "vpc": {
            "securitygroup": ["security_group_id"],
            "subnetids": ["subnet_1_id", "subnet_2_id"]
          }
        }
      }
    }
  };
  ```

3. **Faça o Deploy para o Elastic Beanstalk:**
   - Utilize o AWS CLI ou o AWS Management Console para criar um novo ambiente do Elastic Beanstalk.
   - Siga as instruções para fazer o upload do código da sua aplicação.