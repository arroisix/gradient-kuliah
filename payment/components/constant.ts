export type PAYMENT_DICT = {
    VA_BNI: string;
    VA_BRI: string;
    VA_MANDIRI: string;
    VA_BCA: string;
    VA_PERMATA: string;
    VA_BJB: string;
    VA_BSI: string;
    QRIS: string;
    GOPAY: string;
    ID_DANA: string;
    ID_OVO: string;
    ID_SHOPEEPAY: string;
    ID_LINKAJA: string;
    CARD_VISA: string;
    CARD_MASTERCARD: string;
    CARD_AMEX: string;
    CARD_JCB: string;
    ALFAMART: string;
    INDOMARET: string;
    VOUCHER: string;
    MANUAL?: string;
    OTHER: undefined;
};

export const LOGO_PAYMENT: PAYMENT_DICT = {
    VA_BNI: 'bni.png',
    VA_BRI: 'bri.png',
    VA_MANDIRI: 'mandiri.png',
    VA_BCA: 'bca.png',
    VA_PERMATA: 'permata.png',
    VA_BJB: 'bjb.png',
    VA_BSI: 'bsi.png',
    QRIS: 'qris.png',
    GOPAY: 'gopay.png',
    ID_DANA: 'dana.png',
    ID_OVO: 'ovo.png',
    ID_SHOPEEPAY: 'shopeepay.png',
    ID_LINKAJA: 'linkaja.png',
    CARD_VISA: 'visa.png',
    CARD_MASTERCARD: 'mastercard.png',
    CARD_AMEX: 'amex.png',
    CARD_JCB: 'jcb.png',
    ALFAMART: 'alfamart.png',
    INDOMARET: 'indomaret.png',
    OTHER: undefined,
    VOUCHER: 'voucher.png'
};

export const NAME_PAYMENT: PAYMENT_DICT = {
    VA_BNI: 'Bank BNI',
    VA_BRI: 'Bank BRI',
    VA_MANDIRI: 'Bank Mandiri',
    VA_BCA: 'Bank BCA',
    VA_PERMATA: 'Bank Permata',
    VA_BJB: 'Bank BJB',
    VA_BSI: 'Bank BSI',
    QRIS: 'QRIS',
    GOPAY: 'GoPay',
    ID_DANA: 'DANA',
    ID_OVO: 'OVO',
    ID_SHOPEEPAY: 'ShopeePay',
    ID_LINKAJA: 'LinkAja',
    CARD_VISA: 'Visa Card',
    CARD_MASTERCARD: 'Mastercard',
    CARD_AMEX: 'AMEX Card',
    CARD_JCB: 'JCB Card',
    ALFAMART: 'Alfamart',
    INDOMARET: 'Indomaret',
    MANUAL: 'Manual',
    OTHER: undefined,
    VOUCHER: 'Kode Voucher'
};
