import { ParseAnnualSalary } from "interfaces/salaryService";

class SalaryService implements ParseAnnualSalary {
  public async parseAnnualSalary(rawAnnualSalary: string): Promise<number> {
    const annualSalary = this.filterAnnualSalary(rawAnnualSalary);
    return await Promise.resolve(annualSalary || 0);
  }

  private filterAnnualSalary(rawAnnualSalary: string): number | undefined {
    const isContainAlphabet = (examineValue: string): boolean => {
      const characterRegex = /[a-zA-Z]/g;
      return characterRegex.test(examineValue);
    };

    const isContainNumber = (examineValue: string): boolean => {
      const numberRegex = /(\d+|\d{1,3}(,\d{3})*)(\.\d+)?/;
      return numberRegex.test(examineValue);
    };
    const getMatchNumbers = (examineValue: string): string[] | null => {
      const numberRegex = /(\d+|\d{1,3}(,\d{3})*)(\.\d+)?/;
      return examineValue.match(numberRegex);
    };

    const removeWhiteSpaces = (value: string): string =>
      value.replace(/ /g, "");

    const removeCommas = (value: string): string => value.replace(/,/g, "");

    if (isContainAlphabet(rawAnnualSalary)) {
      return undefined;
    }

    const filterWhiteSpace = removeWhiteSpaces(rawAnnualSalary);

    if (!isContainNumber(filterWhiteSpace)) {
      return undefined;
    }

    const matchNumbers: string[] | null = getMatchNumbers(filterWhiteSpace);
    if (!Array.isArray(matchNumbers)) {
      return undefined;
    }
    if (matchNumbers.length === 0) {
      return undefined;
    }

    const closedResult: string = matchNumbers[0];
    const pureNumber = removeCommas(closedResult);
    const result = parseFloat(pureNumber);
    if (isNaN(result)) {
      return undefined;
    }
    return result;
  }
}

export default SalaryService;