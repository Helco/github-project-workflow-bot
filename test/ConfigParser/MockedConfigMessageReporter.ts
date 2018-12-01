import { IConfigMessageReporter } from "../../src/ConfigParser";

export const MockedConfigMessageReporter = jest.fn<IConfigMessageReporter>(() => ({
    reportError: jest.fn(),
    reportWarning: jest.fn(),
    hasErrors: jest.fn()
}));
