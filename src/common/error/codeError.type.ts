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
};

