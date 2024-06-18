const chai = require('chai');
const supertest = require('supertest');

const expect = chai.expect;
const requester = supertest('http://localhost:9090');

describe('Testing Sessions API', () => {

  it('Iniciar sesión', async () => {
    const credentials = {
      email: 'felipe@gmail.com',
      password: '654321'
    };
  
    const { statusCode } = await requester.post('/auth/login').send(credentials);
  
    expect(statusCode).to.equal(302);
  });

  it('Iniciar sesión con usuario no existente', async () => {
    const credentials = {
      email: 'testlogin@gmail.com',
      password: 'contra1234'
    };
  
    const { statusCode, body } = await requester.post('/auth/login').send(credentials);
  
    expect(statusCode).to.equal(404);
    expect(body).is.ok.and.to.have.property('error');
  });

  it('Registro de usuario', async () => {
    const newUser = {
      first_name: 'Prueba',
      last_name: 'Test',
      email: 'tester@gmail.com',
      age: 30,
      password: '123456'
    };
  
    const { statusCode } = await requester.post('/auth/register').send(newUser);
  
    expect(statusCode).to.equal(302);
  });

  it('Solicitar restablecimiento de contraseña', async () => {
    const email = 'felipe@gmail.com';
  
    const { statusCode, body } = await requester.post('/auth//password/reset/request').send({ email });
  
    expect(statusCode).to.equal(200);
    expect(body).to.have.property('message', 'Email para restablecer la contraseña enviado');
  });
  
});
