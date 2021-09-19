import { WorkExperienceYear } from "entity/WorkExperienceYear";
import ConstantService from "interfaces/constantService";
import { getRepository } from "typeorm";

class WorkExperienceYearService extends ConstantService {
  async getConstant(title: string): Promise<WorkExperienceYear> {
    if (this.constantMap) {
      return await this.getFromConstantMap(title);
    }
    return await this.getFromDatabase(title);
  }

  async getFromConstantMap(
    title: string
  ): Promise<WorkExperienceYear | undefined> {
    return await Promise.resolve(
      this.constantMap[title] as WorkExperienceYear | undefined
    );
  }

  async getFromDatabase(
    title: string
  ): Promise<WorkExperienceYear | undefined> {
    const repo = getRepository(WorkExperienceYear);
    try {
      return await repo.findOne({ title: title });
    } catch (e) {
      return await Promise.resolve(undefined);
    }
  }
}

export default WorkExperienceYearService;
