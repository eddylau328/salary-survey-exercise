import { AgeGroup } from "entity/AgeGroup";
import { ConstantService, GetAgeGroup } from "interfaces/constantService";

class AgeGroupService extends ConstantService implements GetAgeGroup {
  protected entity = AgeGroup;
  public async getConstant(title: string): Promise<AgeGroup | undefined> {
    if (this.constantMap) {
      return (await this.getFromConstantMap(title)) as AgeGroup | undefined;
    }
    return (await this.getFromDatabase(title)) as AgeGroup | undefined;
  }
}

export default AgeGroupService;
