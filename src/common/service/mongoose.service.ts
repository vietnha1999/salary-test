import { ClientSession, Connection } from 'mongoose';

export abstract class MongooseService {
  async withTransaction<T>(
    connection: Connection,
    session: ClientSession | undefined,
    callback: (session: ClientSession) => Promise<T>,
  ) {
    if (session) {
      return callback(session);
    } else {
      const _session = await connection.startSession();
      let result!: T;
      try {
        await _session.withTransaction<void>(async (ss) => {
          result = await callback(ss);
        });
        return result;
      } finally {
        await _session.endSession();
      }
    }
  }
}
