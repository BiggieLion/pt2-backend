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
            <p>Por favor reportalo con equipo de desarrollo de esta app</p>
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

export const requestCreated = (data: Params) => {
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
            <p>Tu solicitud de crédito con número de serie ${creditId} ha sido creada con exito</p>
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
            <p>¡Buenas noticias! Tu solicitud de crédito con número de serie ${creditId} fue pre-aprobada por la IA con ${iaScore} puntos.</p>
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
            <p>Te informamos que tu solicitud de crédito con número de serie ${creditId} fue puntuada por la IA con ${iaScore} puntos y ha sido rechazada por estos motivos:</p>
            <p>${reasonOfRejection}</p>
            <br />
            <br />
            <h3>Equipo de Risky Measurer</h3>
        </body>
        </html>
  `;
};

export const requestEvaluation = (data: Params): string => {
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
            <p>Te informamos que tu solicitud de crédicto de serie ${creditId} fue puntuada por la IA con ${iaScore} puntos.</p>
            <p>Un analista se pondrá en contacto contigo pronto...</p>
            <br />
            <br />
            <h3>Equipo de Risky Measurer</h3>
        </body>
        </html>
  `;
};
