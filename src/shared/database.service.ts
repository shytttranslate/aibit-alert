import { Injectable } from '@nestjs/common';
import { LazyModuleLoader } from '@nestjs/core';
import { LazyModule } from './lazy/LazyModule';
import { DataSource, EntityTarget, ObjectLiteral, Repository } from 'typeorm';

@Injectable()
export class DBService {
  private dt: DataSource;
  constructor(private lazyLoad: LazyModuleLoader) {
    // this._getDbSource();
  }
  async _getDbSource() {
    const ref = await this.lazyLoad.load(() => LazyModule);
    this.dt = ref.get(DataSource);
  }
  getRepository<T extends ObjectLiteral>(entity: EntityTarget<T>) {
    if (!this.dt) {
      return null;
    }
    return this.dt.getRepository<T>(entity as any);
  }
}
