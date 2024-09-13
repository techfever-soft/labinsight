class TryCatch {
  async test() {
    let a = 1;
    const promise = await Promise.resolve(a); // Doit être entouré d'un try-catch

    if (promise === 1) {
      await Promise.reject("Resolve"); // Doit être entouré d'un try-catch
    } else {
      await Promise.reject("Catch"); // Doit être entouré d'un try-catch
    }
  }
}