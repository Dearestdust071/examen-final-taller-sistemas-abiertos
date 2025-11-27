import request from 'supertest';
import server from '../../server';

describe('POST /api/books', () => {
  it('debe retornar 400 si el cuerpo está vacío', async () => {
    const res = await request(server).post('/api/books').send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  it('debe retornar 400 si falta alguno de los campos obligatorios', async () => {
    // Falta author, isbn, releaseDate
    const res = await request(server)
      .post('/api/books')
      .send({ name: 'El Principito' });
    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  it('debe retornar 400 si releaseDate no tiene formato YYYY-MM-DD', async () => {
    const payload = {
      name: '1984',
      author: 'George Orwell',
      isbn: '9780451524935',
      releaseDate: '06/08/1949'
    };
    const res = await request(server)
      .post('/api/books')
      .send(payload);
    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  it('debe crear un libro con datos válidos', async () => {
    const payload = {
      name: 'Cien Años de Soledad',
      author: 'Gabriel García Márquez',
      isbn: '9780307474728',
      releaseDate: '1967-06-05'
    };
    const res = await request(server)
      .post('/api/books')
      .send(payload);
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe(payload.name);
    expect(res.body.author).toBe(payload.author);
    expect(res.body.isbn).toBe(payload.isbn);
    expect(res.body.releaseDate).toBe(payload.releaseDate);
  });

  it('nunca debe retornar 404', async () => {
    const res = await request(server).post('/api/books').send({});
    expect(res.statusCode).not.toBe(404);
  });
});

describe('GET /api/books', () => {
  it('debe retornar 200', async () => {
    const res = await request(server).get('/api/books');
    expect(res.statusCode).toBe(200);
  });

  it('debe retornar JSON con propiedad data (array)', async () => {
    const res = await request(server).get('/api/books');
    expect(res.headers['content-type']).toMatch(/json/);
    expect(res.body.data).toBeDefined();
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('no debe tener propiedad errors', async () => {
    const res = await request(server).get('/api/books');
    expect(res.body.errors).toBeUndefined();
  });
});

describe('GET /api/books/:id', () => {
  it('retorna 400 si el id no es numérico', async () => {
    const res = await request(server).get('/api/books/abc');
    expect(res.statusCode).toBe(400);
  });

  it('retorna 404 si el libro no existe', async () => {
    const res = await request(server).get('/api/books/9999');
    expect(res.statusCode).toBe(404);
  });

  it('retorna 200 si el libro existe', async () => {
    const create = await request(server)
      .post('/api/books')
      .send({
        name: 'El Hobbit',
        author: 'J.R.R. Tolkien',
        isbn: '9780547928227',
        releaseDate: '1937-09-21'
      });
    const res = await request(server).get(`/api/books/${create.body.id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('El Hobbit');
  });
});

describe('PUT /api/books/:id', () => {
  it('retorna 400 si el cuerpo está vacío', async () => {
    const create = await request(server)
      .post('/api/books')
      .send({
        name: 'Drácula',
        author: 'Bram Stoker',
        isbn: '9780141439846',
        releaseDate: '1897-05-26'
      });
    const res = await request(server)
      .put(`/api/books/${create.body.id}`)
      .send({});
    expect(res.statusCode).toBe(400);
  });

  it('retorna 400 si releaseDate es inválido', async () => {
    const create = await request(server)
      .post('/api/books')
      .send({
        name: 'Frankenstein',
        author: 'Mary Shelley',
        isbn: '9780486282114',
        releaseDate: '1818-01-01'
      });
    const res = await request(server)
      .put(`/api/books/${create.body.id}`)
      .send({
        name: 'Frankenstein 2',
        author: 'M. Shelley',
        isbn: '9780486282114',
        releaseDate: '01-01-1818'
      });
    expect(res.statusCode).toBe(400);
  });

  it('retorna 404 si el libro no existe', async () => {
    const res = await request(server)
      .put('/api/books/9999')
      .send({
        name: 'Invisible Man',
        author: 'Ralph Ellison',
        isbn: '9780679732761',
        releaseDate: '1952-04-14'
      });
    expect(res.statusCode).toBe(404);
  });

  it('actualiza correctamente si es válido', async () => {
    const create = await request(server)
      .post('/api/books')
      .send({
        name: 'Matar a un ruiseñor',
        author: 'Harper Lee',
        isbn: '9780446310789',
        releaseDate: '1960-07-11'
      });
    const res = await request(server)
      .put(`/api/books/${create.body.id}`)
      .send({
        name: 'Matar a un ruiseñor (Edición Especial)',
        author: 'Harper Lee',
        isbn: '9780446310789',
        releaseDate: '1960-07-11'
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toMatch(/Edición Especial/);
  });
});

describe('PATCH /api/books/:id', () => {
  it('retorna 404 si el libro no existe', async () => {
    const res = await request(server).patch('/api/books/9999');
    expect(res.statusCode).toBe(404);
  });

  it('cambia availability correctamente', async () => {
    const create = await request(server)
      .post('/api/books')
      .send({
        name: 'El código Da Vinci',
        author: 'Dan Brown',
        isbn: '9780307474278',
        releaseDate: '2003-03-18'
      });
    const res1 = await request(server).patch(`/api/books/${create.body.id}`);
    const res2 = await request(server).patch(`/api/books/${create.body.id}`);
    expect(res1.statusCode).toBe(200);
    expect(res2.statusCode).toBe(200);
    expect(res1.body.availability).not.toBe(res2.body.availability);
  });
});

describe('DELETE /api/books/:id', () => {
  it('retorna 400 si el id no es válido', async () => {
    const res = await request(server).delete('/api/books/abc');
    expect(res.statusCode).toBe(400);
  });

  it('retorna 404 si el libro no existe', async () => {
    const res = await request(server).delete('/api/books/9999');
    expect(res.statusCode).toBe(404);
  });

  it('elimina correctamente y retorna mensaje', async () => {
    const create = await request(server)
      .post('/api/books')
      .send({
        name: 'El Principito',
        author: 'Antoine de Saint-Exupéry',
        isbn: '9780156012195',
        releaseDate: '1943-04-06'
      });
    const res = await request(server).delete(`/api/books/${create.body.id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/eliminado/i);
  });
});
