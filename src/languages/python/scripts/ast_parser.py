import ast
import sys
import json

def parse_python_code(file_path):
    # Lire le code source du fichier Python
    with open(file_path, 'r') as f:
        source_code = f.read()

    # Parser le code source pour générer l'AST
    tree = ast.parse(source_code)

    # Convertir l'AST en un format dictionnaire pour l'écrire en JSON
    def ast_to_dict(node):
        if not isinstance(node, ast.AST):
            return node
        result = {"_type": type(node).__name__}
        for field, value in ast.iter_fields(node):
            if isinstance(value, list):
                result[field] = [ast_to_dict(item) for item in value]
            else:
                result[field] = ast_to_dict(value)
        return result

    # Retourner l'AST en format dictionnaire
    return ast_to_dict(tree)

if __name__ == "__main__":
    input_file = sys.argv[1]  # Le fichier Python à analyser
    output_file = sys.argv[2]  # Le fichier JSON de sortie pour l'AST

    # Générer l'AST
    ast_representation = parse_python_code(input_file)

    # Écrire l'AST en format JSON
    with open(output_file, 'w') as f:
        json.dump(ast_representation, f, indent=4)

    print(f"AST écrit dans le fichier : {output_file}")
