/**
 * Read file content without try-catch
 * @param {*} filePath 
 */
async function fetchDataWithoutTryCatch(url) {
    const data = await fetch(url); // This should trigger the rule
    return data.json();
}