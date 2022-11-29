import { CustomError, HTTPError } from './errorInterface.js';

describe('Given the class CustomError', () => {
    let error: CustomError;
    beforeEach(() => {
        error = new HTTPError(508, 'Loop Detected', 'We Loops');
    });
    test('When ', () => {
        expect(error).toBeInstanceOf(Error);
        expect(error).toBeInstanceOf(HTTPError);
        expect(error).toHaveProperty('statusCode', 508);
        expect(error).toHaveProperty('statusMessage', 'Loop Detected');
        expect(error).toHaveProperty('message', 'We Loops');
        expect(error).toHaveProperty('name', 'HTTPError');
    });
});
