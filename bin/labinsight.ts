#!/usr/bin/env node

import { program } from "commander";
import { InitCommand } from "../src/cli/initCommand";
import { AnalyzeCommand } from "../src/cli/analyzeCommand";

program.version("0.0.7");

/**
 * Initialize a new .labinsight file
 */
program
  .command("init")
  .description("Initialize a new .labinsight file")
  .action((): void => {
    new InitCommand().execute();
  });

/**
 * Analyze files in the current directory based on the configuration
 */
program
  .command("analyze")
  .description(
    "Analyze files in the current directory based on the configuration"
  )
  .option("-s, --silent", "Run in silent mode")
  .option("-t, --type <type>", "Type of analysis to perform")
  .option("-k, --keep", "Keep the generated reports")
  .option("-v, --verbose", "Run in verbose mode")
  .action((options): void => {
    new AnalyzeCommand().execute(options);
  });

program.parse(process.argv);
