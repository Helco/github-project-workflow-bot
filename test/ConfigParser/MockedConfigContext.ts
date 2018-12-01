import { IConfigContext } from "../../src/ConfigParser";

export function MakeMockedConfigContext() {
    return jest.fn<IConfigContext>(() => ({
        accept: jest.fn(),
        getValue: jest.fn()
    }));
}
export const MockedConfigContext = MakeMockedConfigContext();
