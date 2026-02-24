export function getChildAge(birthDate: string): {
  years: number;
  months: number;
} {
  const birth = new Date(birthDate);
  const today = new Date();

  let years = today.getFullYear() - birth.getFullYear();
  let months = today.getMonth() - birth.getMonth();

  if (today.getDate() < birth.getDate()) {
    months -= 1;
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return { years, months };
}

export function formatAge(birthDate: string): string {
  const { years, months } = getChildAge(birthDate);

  if (years === 0) {
    return `${months}ヶ月`;
  }

  if (months === 0) {
    return `${years}歳`;
  }

  return `${years}歳${months}ヶ月`;
}
