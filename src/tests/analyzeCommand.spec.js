"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const analyzeCommand_1 = require("@cli/analyzeCommand");
jest.mock("@config/configManager");
jest.mock("@core/managers/argManager");
jest.mock("@core/factories/reportFactory");
jest.mock("@core/managers/reportManager");
jest.mock("@utils/loggerUtil");
jest.mock("@inquirer/prompts", () => ({
    select: jest.fn(),
}));
describe("AnalyzeCommand", () => {
    let analyzeCommand;
    beforeEach(() => {
        analyzeCommand = new analyzeCommand_1.AnalyzeCommand();
        jest.clearAllMocks();
    });
    describe("execute", () => {
        it("should execute the full analyze command", () => __awaiter(void 0, void 0, void 0, function* () {
            // TODO: Implement execute the full analyze command test
            expect(true).toBe(true);
        }));
    });
});
