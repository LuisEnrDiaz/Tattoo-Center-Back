/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testPathIgnorePatterns: ['dist'],
    resolver: 'jest-ts-webcompat-resolver',
    coveragePathIgnorePatterns: [
        'src/entities',
        'src/app.ts',
        'src/index.ts',
        'src/e2e',
        'src/middlewares/interceptors.ts',
        'src/repository/users.repo.ts',
        'src/controller/user.controller.ts',
    ],
};
