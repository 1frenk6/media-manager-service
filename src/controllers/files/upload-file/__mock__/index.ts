export const REQ_UPLOAD_MOCK = {
  file: {
    originalName: 'test.txt',
    buffer: Buffer.from('file test body'),
    mimetype: 'text/plain',
    size: 123,
  },
  body: {
    title: 'mock-title',
    description: 'mock-description',
    category: 'mock-category',
    language: 'mock-language',
    provider: 'mock-provider',
    roles: 'admin,editor',
  },
} as any;

export const RES_UPLOAD_MOCK = () =>
  ({
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as any);
