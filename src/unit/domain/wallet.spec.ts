import { Wallet } from "../../user/domain/wallet";

describe('Wallet', () => {
    let wallet: Wallet;

    beforeEach(() => {
        wallet = new Wallet(
            '1',
            '123456789',
            'user-123',
            1000,
            new Date('2023-01-01')
        );
    });

    it('should create an instance of Wallet', () => {
        expect(wallet).toBeInstanceOf(Wallet);
    });

    it('should have the correct properties', () => {
        expect(wallet.id).toBe('1');
        expect(wallet.phoneNumber).toBe('123456789');
        expect(wallet.userId).toBe('user-123');
        expect(wallet.balance).toBe(1000);
        expect(wallet.createAt).toEqual(new Date('2023-01-01'));
    });

    it('should allow properties to be updated', () => {
        wallet.balance = 2000;
        expect(wallet.balance).toBe(2000);
        
        wallet.phoneNumber = '987654321';
        expect(wallet.phoneNumber).toBe('987654321');
    });
});