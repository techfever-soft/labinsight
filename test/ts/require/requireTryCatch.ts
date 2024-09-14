/**
 * requireTryCatchFunction
 * @returns Promise<boolean>
 */
export async function requireTryCatchFunction() {
  if (await true) {
    return true;
  } else {
    return false;
  }
}
