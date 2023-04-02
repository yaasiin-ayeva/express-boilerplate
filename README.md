# # express-boilerplate [![Node.js CI](https://github.com/yaasiin-ayeva/express-boilerplate/actions/workflows/node.js.yml/badge.svg)](https://github.com/yaasiin-ayeva/express-boilerplate/actions/workflows/node.js.yml)

Simple express rest api boilerplate with user authentication with JWT token &amp; routes for forget password &amp; password reset.
# Presentation

# Steps to run this project:

1. Run :

```bash
npm i
```

2. Please be sure to check you environment. Setup environnement settings are inside **./.env** file

3. Finally Run :

```bash
npm run dev
```

## SRC Folder structure

| Location            | Content                                           |
| ------------------- | ------------------------------------------------- |
| `/src/.env`         | Environnement settings                            |
| `/assets/documents` | Document folder                                   |
| `/assets/pictures`  | Pictures folder                                   |
| `/src/entity`       | Entity files wrote with typeORM decorators        |
| `/src/services`     | All services organized by entity with an index    |
| `/src/middlewares`  | Middlewares for some services                     |
| `/src/routes`       | Routes organized by entity with an index          |
| `/src/index.js`     | API Entry Point with server configurations        |
| `/src/dtos`         | DTOs for entities                                 |
| `/src/configs`      | Imported project configurations from an .env file |

Please kindly respect this project architecture in your code maintenance.

## IMPORTANT

Check `/postman` folder to get exported postman collection

[link-author]: https://github.com/yaasiin-ayeva
