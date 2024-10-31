import { User } from "../../user/domain";

describe('User ', () => {
    let user: User;

    beforeEach(() => {
        user = new User(
            '1',
            'DNI',
            '12345678',
            'Juan Pérez',
            'juan.perez@example.com',
            '123456789'
        );
    });

    it('should create an instance of User', () => {
        expect(user).toBeInstanceOf(User);
    });

    it('should have the correct properties', () => {
        expect(user.id).toBe('1');
        expect(user.typeDocument).toBe('DNI');
        expect(user.numberDocument).toBe('12345678');
        expect(user.fullName).toBe('Juan Pérez');
        expect(user.email).toBe('juan.perez@example.com');
        expect(user.phoneNumber).toBe('123456789');
    });

    it('should allow properties to be updated', () => {
        user.fullName = 'Pedro Pérez';
        expect(user.fullName).toBe('Pedro Pérez');
    });
});