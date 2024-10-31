export const CODE_ERROR = {
    ERROR_INTERNAL: {
        code: 'ERR-001',
        error: 'Error interno en el sistema',
        title: 'Error interno'
    },
    ERROR_REGISTER_USER: {
        code: 'ERR-002',
        error: 'Problemas en la conexcion de la base de datos, para el registro del usuario, intente mas tarde',
        title: 'Error al registrar al usuario'
    },
    ERROR_USER_EXITS: {
        code: 'ERR-003',
        error: 'El usuario ya cuenta con una cuenta registrada a su usuario',
        title: 'Usuario existente'
    },
    ERROR_REGISTER_WALLET: {
        code: 'ERR-004',
        error: 'Problemas en la conexcion de la base de datos, para el registro de la wallet, intente mas tarde',
        title: 'Error al registrar la wallet'
    },
    ERROR_USER_NOT_FOUND: {
        code: 'ERR-005',
        error: 'El usuario no fue encontrado el usuario ingresado no encontrado',
        title: 'User Not Found',
    },
    ERROR_WALLET_NOT_FOUND: {
        code: 'ERR-006',
        error: 'No hay ninguna wallet asociado a este usuario',
        title: 'User Not Found',
    },
    ERROR_USER_NOT_MATCH: {
        code: 'ERR-007',
        error: 'El usuario la cuenta no coincide con la cuenta que se busca',
        title: 'No existe coincidence',
    },
    ERROR_TOKEN_EXPIRED: {
        code: 'ERR-008',
        error: 'El token de pago ha expirado, por favor intente de nuevo',
        title: 'Token Expired',
    },
    ERROR_TOKEN_NOT_MATCH: {
        code: 'ERR-009',
        error: 'El token de pago no coincide con el que se busca',
        title: 'Token Not Found',
    },
    ERROR_BALANCE_INSUFFICIENT: {
        code: 'ERR-010',
        error: 'No hay suficiente balance para realizar la compra',
        title: 'Balance Insufficient',
    },
    ERROR_PROCESS_FAILED: {
        code: 'ERR-011',
        error: 'Hubo un problema al procesar la compra, por favor intente de nuevo',
        title: 'Process Failed',
    }
};

