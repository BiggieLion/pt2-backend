import { Params } from './dto/notify-email.dto';

export const defaultTemplate = (data: Params) => {
  const { name } = data;

  return `
  <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Document</title>
        </head>
        <body>
            <h2>Hola ${name}!!!</h2>
            <p>Si recibes este correo significa que has encontrado un bug</p>
            <p>Por favor reportalo con el desarrollador de esta app</p>
        </body>
        </html>`;
};

export const test = (data: Params) => {
  const { name } = data;

  return `
     <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Document</title>
        </head>
        <body>
            <h2>Hola ${name}!!!</h2>
            <p>Este es un mensaje de prueba desde el micro servicio de email</p>
        </body>
        </html> 
  `;
};

export const requestCrequestCreatedreated = (data: Params) => {
  const { name, creditId } = data;
  return `
  <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Document</title>
        </head>
        <body>
            <h2>Hola ${name}!!!</h2>
            <p>Tu solicitud con número de serie ${creditId} ha sido creada con exito</p>
            <p>Muy pronto un analista se pondrá en contacto contigo para validar tu información</p>
            <br />
            <br />
            <h3>Equipo de Risky Measurer</h3>
        </body>
        </html>
  `;
};

export const requestApproved = (data: Params): string => {
  const { name, creditId, iaScore } = data;
  return `
   <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Document</title>
        </head>
        <body>
            <h2>Hola ${name}!!!</h2>
            <p>¡Buenas noticias! Tu crédito con número de serie ${creditId} fue puntuado por la IA con ${iaScore} puntos y ha sido aprovado</p>
            <br />
            <br />
            <h3>Equipo de Risky Measurer</h3>
        </body>
        </html>
  `;
};

export const requestRejected = (data: Params): string => {
  const { name, creditId, reasonOfRejection, iaScore } = data;
  return `
  <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Document</title>
        </head>
        <body>
            <h2>Hola ${name}!!!</h2>
            <p>Lamentamos informarte que tu crédito con número de serie ${creditId} fue puntuado por la IA con ${iaScore} puntos y ha sido rechazada por estos motivos:</p>
            <p>${reasonOfRejection}</p>
            <br />
            <br />
            <h3>Equipo de Risky Measurer</h3>
        </body>
        </html>
  `;
};
