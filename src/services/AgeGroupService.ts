import { AgeGroup } from "entity/AgeGroup";
import ConstantService from "interfaces/constantService";
import { getRepository } from "typeorm";

class AgeGroupService extends ConstantService {
  async getConstant(title: string): Promise<AgeGroup> {
    if (this.constantMap) {
      return await this.getFromConstantMap(title);
    }
    return await this.getFromDatabase(title);
  }

  async getFromConstantMap(title: string): Promise<AgeGroup | undefined> {
    return await Promise.resolve(
      this.constantMap[title] as AgeGroup | undefined
    );
  }

  async getFromDatabase(title: string): Promise<AgeGroup | undefined> {
    const repo = getRepository(AgeGroup);
    try {
      return await repo.findOne({ title: title });
    } catch (e) {
      return await Promise.resolve(undefined);
    }
  }
}

export default AgeGroupService;
