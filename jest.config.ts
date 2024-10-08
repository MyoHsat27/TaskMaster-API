export default {
    preset: "ts-jest",
    testEnvironment: "node",
    moduleNameMapper: {
        "^(\\.{1,2}/.*)\\.js$": "$1"
    },
    setupFilesAfterEnv: ["<rootDir>/src/__tests__/jest.setup.ts"],
    extensionsToTreatAsEsm: [".ts"],
    transform: {
        "^.+\\.ts$": ["ts-jest", { useESM: true }]
    },
    testMatch: ["<rootDir>/src/**/*.test.ts"],
    verbose: true,
    forceExit: true,
    clearMocks: true
};
