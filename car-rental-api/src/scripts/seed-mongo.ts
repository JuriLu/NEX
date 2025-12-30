import { config } from 'dotenv';
import mongoose from 'mongoose';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

config();

const MONGO_URI =
  process.env.MONGODB_URI ?? 'mongodb://localhost:27017/CarRental';
const DB_NAME = process.env.MONGODB_DB_NAME ?? 'CarRental';
const seedsDir = join(__dirname, '..', '..', 'seeds', 'mongodb');
type SeedDocument = Record<string, unknown>;

async function loadJson<T>(fileName: string): Promise<T> {
  const raw = await readFile(join(seedsDir, fileName), 'utf-8');
  return JSON.parse(raw) as T;
}

async function seedCollection(
  name: string,
  data: SeedDocument[],
): Promise<void> {
  if (!Array.isArray(data)) {
    throw new Error(`Seed data for ${name} is not an array.`);
  }

  const collection = mongoose.connection.collection(name);
  await collection.deleteMany({});
  if (data.length > 0) {
    await collection.insertMany(data);
  }

  console.log(`Seeded ${data.length} documents into ${name}`);
}

async function run(): Promise<void> {
  await mongoose.connect(MONGO_URI, { dbName: DB_NAME });

  await seedCollection('users', await loadJson<SeedDocument[]>('users.json'));
  await seedCollection('cars', await loadJson<SeedDocument[]>('cars.json'));
  await seedCollection(
    'bookings',
    await loadJson<SeedDocument[]>('bookings.json'),
  );
}

run()
  .then(() => console.log('Mongo seed completed.'))
  .catch((error) => {
    console.error('Mongo seed failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
