
const { login} = require('./login');
describe('Authentication Tests', () => {
    describe('Login', () => {
        it('should successfully log in with valid credentials', () => {
            const result = login('test@example.com', 'password123');
            expect(result.success).toBe(true);
            expect(result.message).toBe('Login successful.');
        });
        it('should fail to log in with invalid credentials', () => {
            const result = login('wrong@example.com', 'wrongpassword');
            expect(result.success).toBe(false);
            expect(result.message).toBe('Invalid credentials.');
        });
        it('should throw an error if email or password is not provided', () => {
            expect(() => login('', 'password')).toThrow('Email and password are required.');
            expect(() => login('email', '')).toThrow('Email and password are required.');
        });
    });
});