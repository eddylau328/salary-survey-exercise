interface ParseAnnualSalary {
  parseAnnualSalary(rawSalary: string): Promise<number>;
}

export { ParseAnnualSalary };
