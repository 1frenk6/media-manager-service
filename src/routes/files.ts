

import { Router } from 'express';
import multer from 'multer';
import listFiles from '../controllers/files/list-files';
import getFileById from '../controllers/files/get-file-by-id';
import uploadFile from '../controllers/files/upload-file';

const fileRouter = Router();
const upload = multer({
  storage: multer.memoryStorage(),
});

/**
 * @openapi
 * /files:
 *   post:
 *     tags:
 *       - Files
 *     summary: Upload a file with metadata
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *               - title
 *               - category
 *               - language
 *               - provider
 *               - roles
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               title:
 *                 type: string
 *                 example: "My File Title"
 *               description:
 *                 type: string
 *                 example: "Some description about the file"
 *               category:
 *                 type: string
 *                 example: "education"
 *               language:
 *                 type: string
 *                 example: "en"
 *               provider:
 *                 type: string
 *                 example: "internal"
 *               roles:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: [admin, editor, viewer]
 *                 example: [admin, viewer]
 *     responses:
 *       200:
 *         description: Upload file
 */
fileRouter.post('/', upload.single('file'), uploadFile);

/**
 * @openapi
 * /files:
 *   get:
 *     tags:
 *       - Files
 *     summary: List Files
 *     responses:
 *       200:
 *         description: List Files
 */
fileRouter.get('/', listFiles);

/**
 * @openapi
 * /files/{id}:
 *   get:
 *     tags:
 *       - Files
 *     summary: Get file by id
 *     responses:
 *       200:
 *         description: Get file by id
 *     parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: integer
 *        required: true
 *        description: Numeric ID of the file to get
 */
fileRouter.get('/:id', getFileById);

export default fileRouter;
