import Dexie, { liveQuery, Table } from 'dexie';

export class AppState<T extends Object, U extends keyof T> {
  key!: U;
  value!: T[U];
}

const APP_TABLE_NAME = 'app';
export class OriginState<P extends Record<any, any>> extends Dexie {
  app!: Table<AppState<P, keyof P>, 'key'>;
  
  constructor(dbName: string) {
    super(dbName);
    this.version(1).stores({
      [APP_TABLE_NAME]: '&key',
    });

    this.app = this.table(APP_TABLE_NAME);
    this.app.mapToClass(AppState);
  }

  get = async <T extends P, U extends keyof T>(propName: U) => {
    return (await this.getPropCollection(propName).first())?.value as T[U];
  };

  set = async <T extends P, U extends keyof T>(propName: U, value: T[U]) => {
    const propExist = !!(await this.getPropCollection(propName).first());
    if (propExist) {
      return !!(await this.getPropCollection(propName).modify({ value }));
    } else {
      return !!(await this.app.put({ key: propName, value }));
    }
  };

  live$ = <T extends P, U extends keyof T>(propName: U) => {
    return liveQuery(() => this.get(propName) as T[U]);
  };

  private getPropCollection = propName => {
    return this.app.where('key').equals(propName);
  };
}
