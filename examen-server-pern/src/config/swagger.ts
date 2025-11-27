import swaggerJSDoc from "swagger-jsdoc";
import { SwaggerUiOptions } from "swagger-ui-express";

const options : swaggerJSDoc.Options = {
    swaggerDefinition:{
        openapi:'3.0.2',
        tags:[
            {
            name:'Products',
            description: 'Operaciones de API PERN con products'
            },
            {
            name:'Users',
            description: 'Operaciones de API PERN con users'
            },
            
            
        ],
        info:{
            title: 'REST API hecha con Node.js / Express / Typescript',
            version:"1.0.0",
            description:"API documentacion para productos"
        }
    },
    apis: ['./src/router.ts']
}

const swaggerUiOptions : SwaggerUiOptions = {
    customCss : `
        .topbar-wrapper .link {
            height: 80px;
            width: auto;
        }
        .swagger-ui .topbar {
            background-color: #2b3b45;
        }
    `,
    customSiteTitle: 'Documentación REST API Express / TypeScript'
}

const swaggerSpec = swaggerJSDoc(options)
export default swaggerSpec
export{
    swaggerUiOptions
}