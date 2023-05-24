import { DataSource } from "typeorm";



export const ormConfig:any= {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'haroon1010',
  database: 'ideas',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: true,
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  migrationsTableName: "custom_migration_table",
  subscribers: ['src/subscriber/**/*{.ts,.js}'],
 
};

const connectionSource = new DataSource(ormConfig)
export default connectionSource;

