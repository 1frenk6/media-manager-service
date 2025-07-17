import uploadFile from '.';
import { REQ_UPLOAD_MOCK } from './__mock__';
import db from '../../../services/db';
import s3UploadFile from '../../../services/s3/utils/s3-upload-file';

jest.mock('../../../services/s3/utils/s3-upload-file', () => jest.fn());

jest.mock('../../../services/db', () => ({
  insertInto: jest.fn(() => ({
    values: jest.fn(() => ({
      returning: jest.fn(() => ({
        executeTakeFirstOrThrow: jest.fn(),
      })),
    })),
  })),
}));

describe('GIVEN uploadFile', () => {
  const mockS3UploadFile = {
    s3url: 'mock-s3-url',
    s3Key: 'mock-s3-key',
  };
  beforeEach(() => {
    jest.clearAllMocks();
    (s3UploadFile as jest.Mock).mockResolvedValue(mockS3UploadFile);
    const executeDbMock = jest.fn().mockResolvedValue({ id: 123 });

    (db.insertInto as jest.Mock).mockReturnValue({
      values: jest.fn(() => ({
        returning: jest.fn(() => ({
          executeTakeFirstOrThrow: executeDbMock,
        })),
      })),
    });
  });

  describe('WHEN req body is not provided', () => {
    it('THEN should return status 400 and json with error prop', async () => {
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;
      await uploadFile({ ...REQ_UPLOAD_MOCK, body: {} }, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Missing metadata fields' });
    });
  });

  describe('WHEN req body ROLE is not valid', () => {
    it('THEN should return status 400 and json with error prop', async () => {
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;
      await uploadFile(
        {
          ...REQ_UPLOAD_MOCK,
          body: {
            ...REQ_UPLOAD_MOCK.body,
            roles: 'invalid-test-role,admin',
          },
        },
        res
      );
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: `Invalid Role Metadata invalid-test-role` });
    });
  });

  describe('WHEN req is correctly passed', () => {
    it('THEN should return status 200 and json', async () => {
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;
      await uploadFile(REQ_UPLOAD_MOCK, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'File uploaded', id: 123 });
    });
  });

  // TODO: test of catch exception
});
