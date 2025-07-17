import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3Client } from '../../client';
import buildS3Url from '../build-s3-url';
import s3UploadFile from '.';
import { v4 as uuidv4 } from 'uuid';

jest.mock('../../client', () => ({
  s3Client: {
    send: jest.fn(),
  },
}));

jest.mock('../build-s3-url', () => jest.fn());
jest.mock('uuid', () => ({
  v4: jest.fn(),
}));

describe('GIVEN s3UploadFile', () => {
  const fakeFile = {
    originalname: 'testfile.txt',
    buffer: Buffer.from('file contents'),
    mimetype: 'text/plain',
  } as any;
  let mockUuidV4: jest.Mock;
  let mockBuildS3Url: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    mockUuidV4 = (uuidv4 as jest.Mock).mockReturnValue('mock-uuid');
    mockBuildS3Url = (buildS3Url as jest.Mock).mockReturnValue('mock-s3-url');
    (s3Client.send as jest.Mock).mockResolvedValue({});
  });

  describe('WHEN file correctly uploaded', () => {
    it('THEN should upload file to S3 and return correct URLs and keys', async () => {
      (s3Client.send as jest.Mock).mockResolvedValue({});
      mockBuildS3Url.mockReturnValue('mock-s3-url');

      const result = await s3UploadFile(fakeFile);

      expect(mockUuidV4).toHaveBeenCalled();
      expect(mockBuildS3Url).toHaveBeenCalledTimes(1);
      expect(s3Client.send).toHaveBeenCalledWith(expect.any(PutObjectCommand));

      expect(result).toEqual({
        s3url: 'mock-s3-url',
        fileId: 'mock-uuid',
        s3Key: 'mock-uuid-testfile.txt',
      });
    });
  });

  describe('WHEN s3Client.send fails', () => {
    it('THEN should throw error', async () => {
      (uuidv4 as jest.Mock).mockReturnValue('mock-uuid');
      (s3Client.send as jest.Mock).mockRejectedValue(new Error('S3 upload failed'));

      await expect(s3UploadFile(fakeFile)).rejects.toThrow('S3 upload failed');
    });
  });
});
