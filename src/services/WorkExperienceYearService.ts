import { WorkExperienceYear } from "entity/WorkExperienceYear";
import {
  ConstantService,
  GetWorkExperienceYear,
} from "interfaces/constantService";

class WorkExperienceYearService
  extends ConstantService
  implements GetWorkExperienceYear
{
  protected entity = WorkExperienceYear;
  public async getConstant(
    title: string
  ): Promise<WorkExperienceYear | undefined> {
    if (this.constantMap) {
      return (await this.getFromConstantMap(title)) as
        | WorkExperienceYear
        | undefined;
    }
    return (await this.getFromDatabase(title)) as
      | WorkExperienceYear
      | undefined;
  }
}

export default WorkExperienceYearService;
