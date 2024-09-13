/**
 * Récursion avec une profondeur maximale de 6
 * @param {*} depth 
 */
function recursion(depth) {
    console.log(`Recursion depth: ${depth}`);
    if (depth < 6) {
        recursion(depth + 1); // Premier appel imbriqué
        if (depth < 5) {
            recursion(depth + 1); // Deuxième appel imbriqué
            if (depth < 4) {
                recursion(depth + 1); // Troisième appel imbriqué
                if (depth < 3) {
                    recursion(depth + 1); // Quatrième appel imbriqué
                    if (depth < 2) {
                        recursion(depth + 1); // Cinquième appel imbriqué
                        if (depth < 1) {
                            recursion(depth + 1); // Sixième appel imbriqué
                        }
                    }
                }
            }
        }
    } else {
        console.log("Maximum recursion depth reached.");
    }
}

// Lancer la fonction avec une profondeur initiale de 1
recursion(1);
