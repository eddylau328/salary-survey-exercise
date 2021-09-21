import SalaryService from "./SalaryService";

describe("SalarySurveyService class", () => {
  describe("parseAnnualSalary - convert annual salary from string to number", () => {
    const convertTests = [
      { rawAnnualSalary: "2,000,000", expectValue: 2000000 },
      { rawAnnualSalary: "20000", expectValue: 20000 },
      { rawAnnualSalary: "200.00", expectValue: 200.0 },
      { rawAnnualSalary: "2,00", expectValue: 200 },
      { rawAnnualSalary: "200k", expectValue: 200000 },
      { rawAnnualSalary: "20 k", expectValue: 20000 },
      { rawAnnualSalary: "2.42M", expectValue: 2420000 },
      { rawAnnualSalary: "71,000 base with 6,000 bonus", expectValue: 71000 },
      { rawAnnualSalary: "$56,000.00", expectValue: 56000.0 },
      { rawAnnualSalary: "62,000 USD", expectValue: 62000 },
      { rawAnnualSalary: "0", expectValue: 0 },
      {
        rawAnnualSalary: "varies widely, from 2.5 million to about 4 million",
        expectValue: 0,
      },
      {
        rawAnnualSalary: "Free rent",
        expectValue: 0,
      },
    ];
    convertTests.forEach(({ rawAnnualSalary, expectValue }) => {
      it(`should convert '${rawAnnualSalary}' to ${expectValue}`, async () => {
        const service = new SalaryService();
        const result = await service.parseAnnualSalary(rawAnnualSalary);
        console.log(result);
        expect(result).toEqual(expectValue);
      });
    });
  });
});
