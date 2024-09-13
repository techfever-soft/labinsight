import path from "path";
import fs from "fs";
import { LabInsightConfig } from "@interfaces/config.interface";
import { LabInsightRuleConfig } from "@interfaces/rule.interface";

export class AutoDetectManager {
  private dependencies: { [key: string]: string };
  private devDependencies: { [key: string]: string };
  private packageJson: { [key: string]: any };

  private defaultRules: LabInsightRuleConfig = {
    "ts.max-lines": {
      severity: "error",
      options: {
        limit: 100,
      },
    },
    "ts.max-method-lines": {
      severity: "warning",
      options: {
        limit: 25,
      },
    },
    "ts.max-array-length": {
      severity: "error",
      options: {
        limit: 100,
      },
    },
    "ts.require-method-description": {
      severity: "warning",
    },
    "ts.require-class-description": {
      severity: "warning",
    },
    "ts.require-interface-description": {
      severity: "warning",
    },
    "ts.require-try-catch": {
      severity: "error",
    },
    "ts.casing-function": {
      severity: "error",
      options: {
        casing: "camelCase",
      },
    },
    "ts.casing-class": {
      severity: "error",
      options: {
        casing: "pascalCase",
      },
    },
    "ts.casing-parameter": {
      severity: "error",
      options: {
        casing: "camelCase",
      },
    },
    "ts.casing-method": {
      severity: "error",
      options: {
        casing: "camelCase",
      },
    },
    "ts.casing-property": {
      severity: "error",
      options: {
        casing: "camelCase",
      },
    },
    "ts.casing-type": {
      severity: "error",
      options: {
        casing: "pascalCase",
      },
    },
    "ts.casing-interface": {
      severity: "error",
      options: {
        casing: "pascalCase",
      },
    },
    "ts.casing-enum": {
      severity: "error",
      options: {
        casing: "pascalCase",
      },
    },
    "ts.limit-recursion-depth": {
      severity: "error",
      options: {
        limit: 3,
      },
    },
    "ts.no-global-state": {
      severity: "error",
    },
    "js.max-lines": {
      severity: "error",
      options: {
        limit: 100,
      },
    },
    "js.require-method-description": {
      severity: "warning",
    },
    "js.require-try-catch": {
      severity: "error",
    },
    "js.casing-class": {
      severity: "error",
      options: {
        casing: "pascalCase",
      },
    },
    "js.casing-parameter": {
      severity: "error",
      options: {
        casing: "camelCase",
      },
    },
    "js.casing-function": {
      severity: "error",
      options: {
        casing: "camelCase",
      },
    },
  };

  private defaultConfig: LabInsightConfig = {
    $schema: "https://lab-insight.web.app/config.schema.json",
    version: 2,
    projectName: "LabInsight Project",
    projectType: "none",
    engine: "none",
    environment: "development",
    linting: "none",
    ignoredDirectories: [
      "node_modules",
      ".git",
      "dist",
      "build",
      "out",
      "temp",
      "tmp",
      "reports",
      "logs",
    ],
    ignoredFiles: [
      ".labinsight",
      ".gitignore",
      ".npmignore",
      ".prettierignore",
      ".eslintignore",
      "package-lock.json",
      "package.json",
      "tsconfig.json",
      "README.md",
      "CHANGELOG.md",
      "LICENCE",
      "ROADMAP.md",
    ],
    customRules: [],
    rules: {
      ...this.defaultRules,
    },
  };

  constructor(cwd: string) {
    const packageJsonPath = path.join(cwd, "package.json");
    const rawPackageJson = fs.readFileSync(packageJsonPath, "utf-8");
    const packageJson = JSON.parse(rawPackageJson);

    this.packageJson = packageJson;
    this.dependencies = packageJson.dependencies || {};
    this.devDependencies = packageJson.devDependencies || {};
  }

  /**
   * Detects the project configuration
   * @returns LabInsightConfig
   */
  public detectProjectConfig(): LabInsightConfig {
    const projectName = this.getProjectName();
    const projectType = this.detectProjectType();
    const engine = this.detectBuildEngine();
    const environment = this.detectEnvironment();
    const linting = this.detectLinting();

    return {
      ...this.defaultConfig,
      linting,
      projectName,
      projectType,
      engine,
      environment,
    };
  }

  /**
   * Gets the project name from the package.json
   * @returns string
   */
  private getProjectName(): string {
    return this.packageJson["name"] || "LabInsight Project";
  }

  /**
   * Detects the linting tool used in the project
   * @returns LabInsightConfig["linting"]
   */
  private detectLinting(): LabInsightConfig["linting"] {
    const lintingMapping: { [key: string]: LabInsightConfig["linting"] } = {
      eslint: "eslint",
      prettier: "prettier",
    };

    for (const [dependency, linting] of Object.entries(lintingMapping)) {
      if (this.isDependencyPresent(dependency)) {
        return linting;
      }
    }

    return "none";
  }

  /**
   * Detects the project type based on the dependencies present in the project
   * @returns LabInsightConfig["projectType"]
   */
  private detectProjectType(): LabInsightConfig["projectType"] {
    const typeMapping: { [key: string]: LabInsightConfig["projectType"] } = {
      express: "node",
      "@types/express": "node",
      react: "react",
      "react-dom": "react",
      "@angular/core": "angular",
      vue: "vue",
      svelte: "svelte",
      "lit-element": "lit-element",
      "@stencil/core": "stencil",
    };

    for (const [dependency, projectType] of Object.entries(typeMapping)) {
      if (this.isDependencyPresent(dependency)) {
        return projectType;
      }
    }

    return "none";
  }

  /**
   * Detects the build engine used in the project
   * @returns LabInsightConfig["engine"]
   */
  private detectBuildEngine(): LabInsightConfig["engine"] {
    const engineMapping: { [key: string]: LabInsightConfig["engine"] } = {
      webpack: "webpack",
      vite: "vite",
      esbuild: "esbuild",
    };

    for (const [dependency, engine] of Object.entries(engineMapping)) {
      if (this.isDependencyPresent(dependency)) {
        return engine;
      }
    }

    return "none";
  }

  /**
   * Detects the current environment
   * @returns LabInsightConfig["enviroment"]
   */
  private detectEnvironment(): LabInsightConfig["environment"] {
    return process.env.NODE_ENV === "production" ? "production" : "development";
  }

  /**
   * Checks if a dependency is present
   * @param dependency string
   * @returns boolean
   */
  private isDependencyPresent(dependency: string): boolean {
    return (
      this.dependencies.hasOwnProperty(dependency) ||
      this.devDependencies.hasOwnProperty(dependency)
    );
  }
}
