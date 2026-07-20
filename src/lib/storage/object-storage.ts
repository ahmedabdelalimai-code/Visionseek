export type StorageObject = {
  key: string;
  contentType: string;
  sizeBytes: number;
  checksum?: string;
};

/** S3-compatible storage port; adapters own SDK and provider configuration. */
export interface ObjectStorage {
  createUploadUrl(input: { key: string; contentType: string; expiresInSeconds: number }): Promise<{ url: string; headers: Record<string, string> }>;
  getObjectMetadata(key: string): Promise<StorageObject | null>;
  deleteObject(key: string): Promise<void>;
}
