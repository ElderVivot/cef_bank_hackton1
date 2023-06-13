import msSql, { ConnectionPool } from 'mssql';
import 'dotenv/config';

const configConnection = {
  server: process.env.DB_SERVER,
  port: Number(process.env.DB_PORT) || 1433,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  options: {
    encrypt: true, // for azure
    trustServerCertificate: false, // change to true for local dev / self-signed certs
  },
};

export class Connection {
  private connection: ConnectionPool;
  constructor() {
    this.connect().then((_) => console.log(_));
  }

  private async connect() {
    if (!this.connection) {
      try {
        this.connection = await msSql.connect(configConnection);
      } catch (error) {
        console.log('error to connect database');
        console.error(error);
      }
    }
  }

  async query<IData>(text: string): Promise<IData[]> {
    // const start = Date.now()
    const result = await msSql.query<IData>(text);
    // const duration = Date.now() - start
    // console.log('executed query', { start, duration, text })
    return result.recordset;
  }
}

export const connectionFactory = {
  provide: 'CONNECTION',
  useFactory: (): Connection => {
    return new Connection();
  },
};
