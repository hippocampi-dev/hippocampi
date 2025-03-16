export function calculateAge(DOB: Date) {
  let calculatedAge = new Date().getFullYear() - DOB.getFullYear();
  const monthDiff = new Date().getMonth() - DOB.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && new Date().getDate() < DOB.getDate())) {
    calculatedAge--;
  }

  return calculatedAge;
}