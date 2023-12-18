import {GET_WALLET_STRIPE_STATUS} from 'actions';
import {
  GET_CURRENT_WALLET,
  GET_KIZUNA_PACKAGES,
  GET_PAYMENT_CARDS,
  GET_CARD_PAYMENT_SECRET,
  ADD_PAYMENT_CARD,
  PURCHASE_PACKAGE,
  GET_TRANSACTION_HISTORY,
  TRANSFER_KIZUNA,
  LOGOUT,
  REMOVE_PAYMENT_CARD,
  CONNECT_STRIPE,
  GET_PAYMENT_CRYPTO_CARDS,
  GET_NOW_PAYMENTS_CURRENCIES,
} from 'actions';

const INITIAL_STATE = {
  current: {
    balance: 0,
    today: 0,
  },
  loading: false,
  packages: [],
  beingLoadPackages: false,
  cards: [],
  cryptoCards: [],
  beingLoadCards: false,
  beingLoadPaymentSecret: false,
  beingAddCard: false,
  beingRemoveCard: false,
  beingPurchase: false,
  transactions: [],
  transactionsLastPage: 1,
  transactionsLoading: false,
  beingTransferKizuna: false,
  paymentNowCurrencies: [],

  beingLoadStripeStatus: false,
  stripeStatusResponse: {
    amount: 0,
    currency: 'usd',
    status: 'NOT_CONNECTED', // CONNECTED | NOT_CONNECTED | PENDING
  },
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case REMOVE_PAYMENT_CARD.REQUEST:
      return {
        ...state,
        beingRemoveCard: true,
      };
    case REMOVE_PAYMENT_CARD.SUCCESS:
      return {
        ...state,
        beingRemoveCard: false,
        cards: state.cards.filter(
          (item) => item.id !== action.payload.inputPayload.id,
        ),
      };
    case REMOVE_PAYMENT_CARD.FAILURE:
      return {
        ...state,
        beingRemoveCard: false,
      };
    case TRANSFER_KIZUNA.REQUEST:
      return {
        ...state,
        beingTransferKizuna: true,
      };
    case TRANSFER_KIZUNA.SUCCESS:
      return {
        ...state,
        beingTransferKizuna: false,
        current: {
          balance: state.current.balance - action.payload.inputPayload.amount,
          today: state.current.today,
        },
      };
    case TRANSFER_KIZUNA.FAILURE:
      return {
        ...state,
        beingTransferKizuna: false,
      };
    case GET_TRANSACTION_HISTORY.REQUEST:
      return {
        ...state,
        transactionsLoading: true,
      };
    case GET_TRANSACTION_HISTORY.SUCCESS:
      return {
        ...state,
        transactions:
          action.payload.meta.pagination.current_page === 1
            ? action.payload.data
            : [...state.transactions, ...action.payload.data],
        transactionsLastPage: action.payload.meta.pagination.total_pages || 1,
        transactionsLoading: false,
      };
    case GET_TRANSACTION_HISTORY.FAILURE:
      return {
        ...state,
        transactionsLoading: false,
      };
    case PURCHASE_PACKAGE.REQUEST:
      return {
        ...state,
        beingPurchase: true,
      };
    case PURCHASE_PACKAGE.SUCCESS:
      return {
        ...state,
        beingPurchase: false,
      };
    case PURCHASE_PACKAGE.FAILURE:
      return {
        ...state,
        beingPurchase: false,
      };
    case ADD_PAYMENT_CARD.REQUEST:
      return {
        ...state,
        beingAddCard: true,
      };
    case ADD_PAYMENT_CARD.SUCCESS:
      return {
        ...state,
        beingAddCard: false,
        cards: [...state.cards, action.payload.data],
      };
    case ADD_PAYMENT_CARD.FAILURE:
      return {
        ...state,
        beingAddCard: false,
      };
    case GET_CURRENT_WALLET.REQUEST:
      return {
        ...state,
        loading: true,
      };
    case GET_CURRENT_WALLET.SUCCESS:
      return {
        ...state,
        loading: false,
        current: action.payload,
      };
    case GET_CURRENT_WALLET.FAILURE:
      return {
        ...state,
        loading: false,
      };
    case GET_KIZUNA_PACKAGES.REQUEST:
      return {
        ...state,
        beingLoadPackages: true,
      };
    case GET_KIZUNA_PACKAGES.SUCCESS:
      return {
        ...state,
        beingLoadPackages: false,
        packages: action.payload.data,
      };
    case GET_KIZUNA_PACKAGES.FAILURE:
      return {
        ...state,
        beingLoadPackages: false,
      };
    case GET_PAYMENT_CARDS.REQUEST:
      return {
        ...state,
        beingLoadCards: true,
      };
    case GET_PAYMENT_CARDS.SUCCESS:
      return {
        ...state,
        beingLoadCards: false,
        cards: action.payload.data,
      };
    case GET_PAYMENT_CARDS.FAILURE:
      return {
        ...state,
        beingLoadCards: false,
      };
    case GET_CARD_PAYMENT_SECRET.REQUEST:
      return {
        ...state,
        beingLoadPaymentSecret: true,
      };
    case GET_CARD_PAYMENT_SECRET.SUCCESS:
      return {
        ...state,
        beingLoadPaymentSecret: false,
      };
    case GET_CARD_PAYMENT_SECRET.FAILURE:
      return {
        ...state,
        beingLoadPaymentSecret: false,
      };
    case LOGOUT.SUCCESS:
      return INITIAL_STATE;

    case GET_NOW_PAYMENTS_CURRENCIES.SUCCESS:
      return {
        ...state,
        paymentNowCurrencies: action.payload.currencies
          ?.sort((a, b) => a?.localeCompare(b))
          .map(
            (item) =>
              ({
                name: item,
              } || []),
          ),
      };

    case GET_PAYMENT_CRYPTO_CARDS.REQUEST:
      return {
        ...state,
        beingLoadCards: true,
      };
    case GET_PAYMENT_CRYPTO_CARDS.SUCCESS:
      return {
        ...state,
        beingLoadCards: false,
        cryptoCards: action.payload.data,
      };
    case GET_PAYMENT_CRYPTO_CARDS.FAILURE:
      return {
        ...state,
        beingLoadCards: false,
      };

    case GET_WALLET_STRIPE_STATUS.REQUEST:
      return {
        ...state,
        beingLoadStripeStatus: true,
      };
    case GET_WALLET_STRIPE_STATUS.SUCCESS:
      return {
        ...state,
        stripeStatusResponse: action.payload,
        beingLoadStripeStatus: false,
      };
    case GET_WALLET_STRIPE_STATUS.FAILURE:
      return {
        ...state,
        beingLoadStripeStatus: false,
      };
    default:
      return state;
  }
};
