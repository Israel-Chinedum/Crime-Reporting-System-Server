class VerifyTimeFormat {
  isTimeFormat(value: string) {
    const timeRegex = /^([01]\d|2[0-3]):[0-5]\d\s(AM|PM)$/i;
    if (!timeRegex.test(value)) {
      return false;
    }
    return true;
  }
}

export const verifyTimeFormat = new VerifyTimeFormat();
