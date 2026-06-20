import PocketBase, { RecordModel } from 'pocketbase';

// Use NEXT_PUBLIC_ prefix so it is available in the browser
export const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_INSTANCE_URL);

// Utility to get the full URL of an uploaded file
export const getFileUrl = (record: RecordModel, filename: string) => {
  return pb.files.getURL(record, filename);
};
