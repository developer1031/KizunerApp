import {
  GET_CURRENT_WALLET,
  GET_KIZUNA_PACKAGES,
  GET_PAYMENT_CARDS,
  GET_CARD_PAYMENT_SECRET,
  ADD_PAYMENT_CARD,
  PURCHASE_PACKAGE,
  GET_TRANSACTION_HISTORY,
  TRANSFER_KIZUNA,
  REMOVE_PAYMENT_CARD,
  CONNECT_STRIPE,
  GET_STRIPE_CUSTOM_ACCOUNT,
  GET_NOW_PAYMENTS_CURRENCIES,
  GET_NOW_PAYMENTS_MIN_AMOUNT,
  GET_NOW_PAYMENTS_ESTIMATE,
  GET_PAYMENT_CRYPTO_CARDS,
  POST_PAYMENT_CRYPTO_CARD,
  DELETE_PAYMENT_CRYPTO_CARD,
  UPLOAD_STRIPE_IDENTITY,
  GET_WALLET_STRIPE_STATUS,
  PAYOUT_STRIPE,
} from './types';
import {generateThunkAction} from './utilities';
import NavigationService from 'navigation/service';

export const transferKizuna = ({user_id, amount}, callback) =>
  generateThunkAction({
    actionType: TRANSFER_KIZUNA,
    apiOptions: {
      endpoint: '/wallets/transactions',
      data: {user_id, amount},
      method: 'POST',
    },
    callback,
  })();

export const removePaymentCard = (id, callback) =>
  generateThunkAction({
    actionType: REMOVE_PAYMENT_CARD,
    inputPayload: {id},
    apiOptions: {
      endpoint: `/wallets/cards/${id}`,
      method: 'DELETE',
    },
    callback,
  })();

export const getTransactionHistory = ({from_date, to_date, page}) =>
  generateThunkAction({
    actionType: GET_TRANSACTION_HISTORY,
    apiOptions: {
      endpoint: '/wallets/transactions',
      params: {from_date, to_date, per_page: 10, page},
    },
  })();

export const purchasePackage = ({package_id, card_id}, callback) =>
  generateThunkAction({
    actionType: PURCHASE_PACKAGE,
    apiOptions: {
      method: 'POST',
      endpoint: '/wallets/purchases',
      data: {package_id, card_id},
    },
    callback,
  })();

export const getCurrentWallet = () =>
  generateThunkAction({
    actionType: GET_CURRENT_WALLET,
    apiOptions: {
      endpoint: '/wallets',
    },
  })();

export const getKizunaPackages = () =>
  generateThunkAction({
    actionType: GET_KIZUNA_PACKAGES,
    apiOptions: {
      endpoint: '/packages',
    },
  })();

export const getPaymentCards = () =>
  generateThunkAction({
    actionType: GET_PAYMENT_CARDS,
    apiOptions: {
      endpoint: '/wallets/cards',
    },
  })();

export const addPaymentCard = ({payment_method}, callback) =>
  generateThunkAction({
    actionType: ADD_PAYMENT_CARD,
    apiOptions: {
      method: 'POST',
      endpoint: '/wallets/cards',
      data: {payment_method},
    },
    callback,
  })();

export const getCardPaymentSecret = () =>
  generateThunkAction({
    actionType: GET_CARD_PAYMENT_SECRET,
    apiOptions: {
      endpoint: '/wallets/cards/create',
    },
    callback: {
      success: async (result) => {
        if (result?.data?.client_secret) {
          NavigationService.navigate('PaymentData', {
            client_secret: result.data.client_secret,
          });
        }
      },
    },
  })();

export const connectStripe = (data, callback) =>
  generateThunkAction({
    actionType: CONNECT_STRIPE,
    apiOptions: {
      method: 'POST',
      endpoint: '/wallets/stripe/connect',
      data,
    },
    callback,
  })();

export const getStripeCustomAccount = (data, callback) =>
  generateThunkAction({
    actionType: GET_STRIPE_CUSTOM_ACCOUNT,
    apiOptions: {
      method: 'GET',
      endpoint: '/wallets/stripe/account',
    },
    callback,
  })();

export const getNowPaymentsCurrencies = (callback) =>
  generateThunkAction({
    actionType: GET_NOW_PAYMENTS_CURRENCIES,
    apiOptions: {
      method: 'GET',
      endpoint: '/wallets/now-payments/currencies',
    },
    callback,
  })();

export const getNowPaymentsMinAmount = (currency_from, callback) =>
  generateThunkAction({
    actionType: GET_NOW_PAYMENTS_MIN_AMOUNT,
    apiOptions: {
      method: 'GET',
      endpoint: '/wallets/now-payments/min-amount',
      params: {
        currency_from,
      },
    },
    callback,
  })();

export const getNowPaymentEstimate = ({currency_to, amount}, callback) =>
  generateThunkAction({
    actionType: GET_NOW_PAYMENTS_ESTIMATE,
    apiOptions: {
      method: 'GET',
      endpoint: '/wallets/now-payments/estimate',
      params: {
        currency_to,
        amount,
      },
    },
    callback,
  })();

export const getPaymentCryptoCards = () =>
  generateThunkAction({
    actionType: GET_PAYMENT_CRYPTO_CARDS,
    apiOptions: {
      endpoint: '/wallets/crypto-wallets',
    },
  })();

export const postPaymentCryptoCard = (data) =>
  generateThunkAction({
    actionType: POST_PAYMENT_CRYPTO_CARD,
    apiOptions: {
      endpoint: '/wallets/crypto-wallets',
      method: 'POST',
      data,
    },
    callback: {
      success: (result, dispatch) => {
        dispatch(getPaymentCryptoCards());
        NavigationService.goBack();
      },
    },
  })();

export const deletePaymentCryptoCard = (id) =>
  generateThunkAction({
    actionType: DELETE_PAYMENT_CRYPTO_CARD,
    apiOptions: {
      endpoint: `/wallets/crypto-wallets/${id}`,
      method: 'DELETE',
    },
    callback: {
      success: (result, dispatch) => {
        dispatch(getPaymentCryptoCards());
        NavigationService.goBack();
      },
    },
  })();

export const uploadStripeIdentity = (data, callback) => {
  return generateThunkAction({
    actionType: UPLOAD_STRIPE_IDENTITY,
    apiOptions: {
      method: 'POST',
      endpoint: '/wallets/stripe/identity-document',
      data,
    },
    callback,
  })();
};

export const getWalletStripeStatus = () => {
  return generateThunkAction({
    actionType: GET_WALLET_STRIPE_STATUS,
    apiOptions: {
      method: 'GET',
      endpoint: '/wallets/stripe/status',
    },
  })();
};
export const payoutStripe = (data, callback) => {
  return generateThunkAction({
    actionType: PAYOUT_STRIPE,
    apiOptions: {
      method: 'POST',
      endpoint: '/wallets/stripe/withdraw',
      // data,
    },
    callback,
  })();
};
