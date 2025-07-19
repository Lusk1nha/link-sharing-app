import { Readable } from 'stream';

export const UPLOADER_STRATEGY = Symbol('FileUploaderPort');

export interface FileUploaderPort {
  /**
   * Uploads data and returns a publicly accessible URL
   * @param key - destination path in the storage (e.g. "folder/file.png")
   * @param body - file contents as Buffer or Readable
   * @param contentType - MIME type of the file
   */
  upload<T>(
    key: string,
    body: Buffer | Uint8Array | Blob | string | Readable,
    contentType: string,
    options?: Partial<T>,
  ): Promise<string>;

  delete<T>(key: string, options?: Partial<T>): Promise<void>;
}
