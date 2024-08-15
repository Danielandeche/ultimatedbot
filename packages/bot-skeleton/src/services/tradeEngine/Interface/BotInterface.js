import { observer as globalObserver } from '../../../utils/observer';
import { createDetails } from '../utils/helpers';
import { config } from '../../../constants';
import { api_base2 } from '../../api/api-base';
import { notify } from '../utils/broadcast';

const getBotInterface = tradeEngine => {
    const getDetail = i => createDetails(tradeEngine.data.contract)[i];

    return {
        init: (...args) => tradeEngine.init(...args),
        start: (...args) => tradeEngine.start(...args),
        stop: (...args) => tradeEngine.stop(...args),
        purchase: contract_type => tradeEngine.purchase(contract_type),
        getAskPrice: contract_type => Number(getProposal(contract_type, tradeEngine).ask_price),
        getPayout: contract_type => Number(getProposal(contract_type, tradeEngine).payout),
        getPurchaseReference: () => tradeEngine.getPurchaseReference(),
        isSellAvailable: () => tradeEngine.isSellAtMarketAvailable(),
        sellAtMarket: () => tradeEngine.sellAtMarket(),
        getSellPrice: () => getSellPrice(tradeEngine),
        isResult: result => getDetail(10) === result,
        isTradeAgain: result => globalObserver.emit('bot.trade_again', result),
        readDetails: i => getDetail(i - 1),
        showTP: () => {
            config.show_notifications.show_tp = true;
        },
        showSL: () => {
            config.show_notifications.show_sl = true;
        },
        enabaleVH: status => {
            if (status == 'enable') {
                config.vh_variables.is_enabled = true;
            } else {
                config.vh_variables.is_enabled = false;
            }
        },
        activateVHVariables: (martingale, max_steps, min_trades, take_profit, stop_loss) => {
            const authorizeAccount = async token => {
                try {
                    if (!config.vh_variables.is_authorized) {
                        const response = await api_base2.authorize_3(token);

                        if (response.authorize) {
                            config.vh_variables.is_authorized = true;
                            notify('success', 'Virtual Hook Authorized');
                        } else {
                            console.error('Authorization failed:', response.error);
                        }
                    } else {
                        notify('success', 'Virtual Hook Already Authorized');
                    }
                } catch (error) {
                    notify('error', error.error.message.toString());
                }
            };

            const cleanToken = inputToken => {
                // Remove leading and trailing single quotes
                const cleanedToken = inputToken.replace(/^'|'$/g, '');
                return cleanedToken;
            };

            const virtual_token = 'AdDA8jU7lRadRwH';
            config.vh_variables.vh_official = true;
            config.vh_variables.martingale = parseFloat(martingale);
            config.vh_variables.token = virtual_token.toString();
            authorizeAccount(cleanToken(config.vh_variables.token));
            notify('success', 'Virtual Hook Enabled');
            config.vh_variables.is_enabled = true;
            config.vh_variables.allow_martingale = true;
            config.vh_variables.max_steps = parseFloat(max_steps);
            config.vh_variables.min_trades = parseFloat(min_trades);
            config.vh_variables.take_profit = parseFloat(take_profit);
            config.vh_variables.stop_loss = parseFloat(stop_loss);
        },
    };
};

const getProposal = (contract_type, tradeEngine) => {
    return tradeEngine.data.proposals.find(
        proposal =>
            proposal.contract_type === contract_type &&
            proposal.purchase_reference === tradeEngine.getPurchaseReference()
    );
};

const getSellPrice = tradeEngine => {
    return tradeEngine.getSellPrice();
};

export default getBotInterface;
