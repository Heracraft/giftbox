import PocketBase, { RecordModel } from 'pocketbase';

// The remote instance URL provided by the user
export const pb = new PocketBase(process.env.POCKETBASE_INSTANCE_URL);

// Utility to get the full URL of an uploaded file
export const getFileUrl = (record: RecordModel, filename: string) => {
  return pb.files.getURL(record, filename);
};
