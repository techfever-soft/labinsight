#!/usr/bin/env node

import { AnalyzeCommand } from "../cli/analyzeCommand";
import { InitCommand } from "../cli/initCommand";
import { program } from "commander";

program.version("0.0.9");

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
  .option("-o, --only <language>", "Only analyze files of a specific language")
  .option(
    "-f, --format <format>",
    "Analysis output format (json, csv, html or xml)"
  )
  .action((options): void => {
    new AnalyzeCommand().execute(options);
  });

program.parse(process.argv);
