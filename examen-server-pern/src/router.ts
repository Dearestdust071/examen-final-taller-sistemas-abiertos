// src/routes/book.ts
import { Router } from 'express';
import { body, param, query } from 'express-validator'; // Se añade query
import { handleInputErrors } from './middleware';
import {
  createBook,
  getAllBooks,
  getBookByID,
  getBookByISBN, // Nuevo controlador importado
  updateBook,
  updateAvailability,
  deleteBook
} from './handlers/book';
const router = Router();

// /**
//  * @swagger
//  * components:
//  *   schemas:
//  *     Book:
//  *       type: object
//  *       properties:
//  *         id:
//  *           type: integer
//  *           description: ID del libro
//  *           example: 1
//  *         name:
//  *           type: string
//  *           description: Título del libro
//  *           example: Cien Años de Soledad
//  *         author:
//  *           type: string
//  *           description: Autor del libro
//  *           example: Gabriel García Márquez
//  *         isbn:
//  *           type: string
//  *           description: ISBN del libro
//  *           example: 9780307474728
//  *         releaseDate:
//  *           type: string
//  *           format: date
//  *           description: Fecha de publicación (YYYY-MM-DD)
//  *           example: 1967-06-05
//  *         availability:
//  *           type: boolean
//  *           description: Disponibilidad del libro
//  *           example: true
//  */

// /**
//  * @swagger
//  * /api/books:
//  *   get:
//  *     summary: Obtener lista de libros
//  *     tags:
//  *       - Books
//  *     responses:
//  *       200:
//  *         description: Lista de libros
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 data:
//  *                   type: array
//  *                   items:
//  *                     $ref: '#/components/schemas/Book'
//  */
// router.get('/books', getAllBooks);

// /**
//  * @swagger
//  * /api/books/{id}:
//  *   get:
//  *     summary: Obtener un libro por ID
//  *     tags:
//  *       - Books
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         description: ID del libro a consultar
//  *         required: true
//  *         schema:
//  *           type: integer
//  *     responses:
//  *       200:
//  *         description: Libro encontrado
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: '#/components/schemas/Book'
//  *       400:
//  *         description: ID inválido
//  *       404:
//  *         description: Libro no encontrado
//  */
// router.get(
//   '/books/:id',
//   param('id').isInt().withMessage('ID no válido'),
//   handleInputErrors,
//   getBookByID
// );

// /**
//  * @swagger
//  * /api/books:
//  *   post:
//  *     summary: Crear un nuevo libro
//  *     tags:
//  *       - Books
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             required:
//  *               - name
//  *               - author
//  *               - isbn
//  *               - releaseDate
//  *             properties:
//  *               name:
//  *                 type: string
//  *                 example: El Principito
//  *               author:
//  *                 type: string
//  *                 example: Antoine de Saint-Exupéry
//  *               isbn:
//  *                 type: string
//  *                 example: 9780156012195
//  *               releaseDate:
//  *                 type: string
//  *                 format: date
//  *                 example: 1943-04-06
//  *     responses:
//  *       201:
//  *         description: Libro creado exitosamente
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: '#/components/schemas/Book'
//  *       400:
//  *         description: Datos inválidos
//  */
// router.post(
//   '/books',
//   body('name').notEmpty().withMessage('Falta el título'),
//   body('author').notEmpty().withMessage('Falta el autor'),
//   body('isbn').notEmpty().withMessage('Falta el ISBN'),
//   body('releaseDate')
//     .notEmpty().withMessage('Falta la fecha de publicación')
//     .isISO8601().withMessage('Formato de fecha inválido (YYYY-MM-DD)'),
//   handleInputErrors,
//   createBook
// );

// /**
//  * @swagger
//  * /api/books/{id}:
//  *   put:
//  *     summary: Actualizar un libro existente
//  *     tags:
//  *       - Books
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         description: ID del libro a actualizar
//  *         required: true
//  *         schema:
//  *           type: integer
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             required:
//  *               - name
//  *               - author
//  *               - isbn
//  *               - releaseDate
//  *             properties:
//  *               name:
//  *                 type: string
//  *                 example: El Principito (Edición Ilustrada)
//  *               author:
//  *                 type: string
//  *                 example: Antoine de Saint-Exupéry
//  *               isbn:
//  *                 type: string
//  *                 example: 9780156012195
//  *               releaseDate:
//  *                 type: string
//  *                 format: date
//  *                 example: 1943-04-06
//  *     responses:
//  *       200:
//  *         description: Libro actualizado
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: '#/components/schemas/Book'
//  *       400:
//  *         description: Datos inválidos
//  *       404:
//  *         description: Libro no encontrado
//  */
// router.put(
//   '/books/:id',
//   param('id').isInt().withMessage('ID no válido'),
//   body('name').notEmpty().withMessage('Falta el título'),
//   body('author').notEmpty().withMessage('Falta el autor'),
//   body('isbn').notEmpty().withMessage('Falta el ISBN'),
//   body('releaseDate')
//     .notEmpty().withMessage('Falta la fecha de publicación')
//     .isISO8601().withMessage('Formato de fecha inválido (YYYY-MM-DD)'),
//   handleInputErrors,
//   updateBook
// );

// /**
//  * @swagger
//  * /api/books/{id}:
//  *   patch:
//  *     summary: Alternar disponibilidad de un libro
//  *     tags:
//  *       - Books
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         description: ID del libro a actualizar
//  *         required: true
//  *         schema:
//  *           type: integer
//  *     responses:
//  *       200:
//  *         description: Disponibilidad actualizada
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: '#/components/schemas/Book'
//  *       400:
//  *         description: ID inválido
//  *       404:
//  *         description: Libro no encontrado
//  */
// router.patch(
//   '/books/:id',
//   param('id').isInt().withMessage('ID no válido'),
//   handleInputErrors,
//   updateAvailability
// );

// /**
//  * @swagger
//  * /api/books/{id}:
//  *   delete:
//  *     summary: Eliminar un libro
//  *     tags:
//  *       - Books
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         description: ID del libro a eliminar
//  *         required: true
//  *         schema:
//  *           type: integer
//  *     responses:
//  *       200:
//  *         description: Libro eliminado correctamente
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 message:
//  *                   type: string
//  *                   example: Libro eliminado correctamente
//  *       400:
//  *         description: ID inválido
//  *       404:
//  *         description: Libro no encontrado
//  */
// router.delete(
//   '/books/:id',
//   param('id').isInt().withMessage('ID no válido'),
//   handleInputErrors,
//   deleteBook
// );

// export default router;


//  DIFIFFF FF F F F 
/**
 * @swagger
 * components:
 * schemas:
 * Book:
 * type: object
 * properties:
 * id:
 * type: integer
 * description: ID del libro
 * example: 1
 * name:
 * type: string
 * description: Título del libro
 * example: Cien Años de Soledad
 * author:
 * type: string
 * description: Autor del libro
 * example: Gabriel García Márquez
 * isbn:
 * type: string
 * description: ISBN del libro
 * example: 9780307474728
 * releaseDate:
 * type: string
 * format: date
 * description: Fecha de publicación (YYYY-MM-DD)
 * example: 1967-06-05
 * availability:
 * type: boolean
 * description: Disponibilidad del libro
 * example: true
 */

/**
 * @swagger
 * /api/books:
 * get:
 * summary: Obtener lista de libros
 * tags:
 * - Books
 * responses:
 * 200:
 * description: Lista de libros
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * data:
 * type: array
 * items:
 * $ref: '#/components/schemas/Book'
 */
router.get('/books', getAllBooks);

/**
 * @swagger
 * /api/books/search:
 * get:
 * summary: Buscar libro por ISBN
 * tags:
 * - Books
 * parameters:
 * - in: query
 * name: isbn
 * description: ISBN del libro a buscar
 * required: true
 * schema:
 * type: string
 * responses:
 * 200:
 * description: Libro encontrado
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Book'
 * 400:
 * description: ISBN faltante
 * 404:
 * description: Libro no encontrado
 */
router.get(
  '/books/search',
  query('isbn').notEmpty().withMessage('El ISBN es obligatorio'),
  handleInputErrors,
  getBookByISBN
);

/**
 * @swagger
 * /api/books/{id}:
 * get:
 * summary: Obtener un libro por ID
 * tags:
 * - Books
 * parameters:
 * - in: path
 * name: id
 * description: ID del libro a consultar
 * required: true
 * schema:
 * type: integer
 * responses:
 * 200:
 * description: Libro encontrado
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Book'
 * 400:
 * description: ID inválido
 * 404:
 * description: Libro no encontrado
 */
router.get(
  '/books/:id',
  param('id').isInt().withMessage('ID no válido'),
  handleInputErrors,
  getBookByID
);

/**
 * @swagger
 * /api/books:
 * post:
 * summary: Crear un nuevo libro
 * tags:
 * - Books
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required:
 * - name
 * - author
 * - isbn
 * - releaseDate
 * properties:
 * name:
 * type: string
 * example: El Principito
 * author:
 * type: string
 * example: Antoine de Saint-Exupéry
 * isbn:
 * type: string
 * example: 9780156012195
 * releaseDate:
 * type: string
 * format: date
 * example: 1943-04-06
 * responses:
 * 201:
 * description: Libro creado exitosamente
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Book'
 * 400:
 * description: Datos inválidos
 */
router.post(
  '/books',
  body('name').notEmpty().withMessage('Falta el título'),
  body('author').notEmpty().withMessage('Falta el autor'),
  body('isbn').notEmpty().withMessage('Falta el ISBN'),
  body('releaseDate')
    .notEmpty().withMessage('Falta la fecha de publicación')
    .isISO8601().withMessage('Formato de fecha inválido (YYYY-MM-DD)'),
  handleInputErrors,
  createBook
);

/**
 * @swagger
 * /api/books/{id}:
 * put:
 * summary: Actualizar un libro existente
 * tags:
 * - Books
 * parameters:
 * - in: path
 * name: id
 * description: ID del libro a actualizar
 * required: true
 * schema:
 * type: integer
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required:
 * - name
 * - author
 * - isbn
 * - releaseDate
 * properties:
 * name:
 * type: string
 * example: El Principito (Edición Ilustrada)
 * author:
 * type: string
 * example: Antoine de Saint-Exupéry
 * isbn:
 * type: string
 * example: 9780156012195
 * releaseDate:
 * type: string
 * format: date
 * example: 1943-04-06
 * responses:
 * 200:
 * description: Libro actualizado
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Book'
 * 400:
 * description: Datos inválidos
 * 404:
 * description: Libro no encontrado
 */
router.put(
  '/books/:id',
  param('id').isInt().withMessage('ID no válido'),
  body('name').notEmpty().withMessage('Falta el título'),
  body('author').notEmpty().withMessage('Falta el autor'),
  body('isbn').notEmpty().withMessage('Falta el ISBN'),
  body('releaseDate')
    .notEmpty().withMessage('Falta la fecha de publicación')
    .isISO8601().withMessage('Formato de fecha inválido (YYYY-MM-DD)'),
  handleInputErrors,
  updateBook
);

/**
 * @swagger
 * /api/books/{id}:
 * patch:
 * summary: Alternar disponibilidad de un libro
 * tags:
 * - Books
 * parameters:
 * - in: path
 * name: id
 * description: ID del libro a actualizar
 * required: true
 * schema:
 * type: integer
 * responses:
 * 200:
 * description: Disponibilidad actualizada
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Book'
 * 400:
 * description: ID inválido
 * 404:
 * description: Libro no encontrado
 */
router.patch(
  '/books/:id',
  param('id').isInt().withMessage('ID no válido'),
  handleInputErrors,
  updateAvailability
);

/**
 * @swagger
 * /api/books/{id}:
 * delete:
 * summary: Eliminar un libro
 * tags:
 * - Books
 * parameters:
 * - in: path
 * name: id
 * description: ID del libro a eliminar
 * required: true
 * schema:
 * type: integer
 * responses:
 * 200:
 * description: Libro eliminado correctamente
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * message:
 * type: string
 * example: Libro eliminado correctamente
 * 400:
 * description: ID inválido
 * 404:
 * description: Libro no encontrado
 */
router.delete(
  '/books/:id',
  param('id').isInt().withMessage('ID no válido'),
  handleInputErrors,
  deleteBook
);

export default router;