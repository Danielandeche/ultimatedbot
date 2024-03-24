import React from 'react';
import { useHistory, useLocation } from 'react-router';
import classNames from 'classnames';
import { Icon, Text } from '@deriv/components';
import { routes } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';
import { useFeatureFlags } from '@deriv/hooks';

const TradersHubHomeButton = observer(() => {
    const { ui } = useStore();
    const { is_dark_mode_on } = ui;
    const history = useHistory();
    const location = useLocation();
    const { pathname } = location;
    const { is_next_wallet_enabled, is_next_tradershub_enabled } = useFeatureFlags();

    const redirect_routes = () => {
        if (is_next_wallet_enabled) {
            return routes.wallets;
        } else if (is_next_tradershub_enabled) {
            return routes.traders_hub_v2;
        }

        return routes.traders_hub;
    };

    return (
        <div
            data-testid='dt_traders_hub_home_button'
            className={classNames('traders-hub-header__tradershub', {
                'traders-hub-header__tradershub--active':
                    pathname === routes.traders_hub ||
                    pathname === routes.traders_hub_v2 ||
                    pathname === routes.wallets,
            })}
            onClick={() => history.push(redirect_routes())}
        >
            <div className='traders-hub-header__tradershub--home-logo'>
                <Icon
                    icon={is_dark_mode_on ? 'IcAppstoreHomeDark' : 'IcAppstoreTradersHubHome'}
                    size={is_dark_mode_on ? 15 : 17}
                />
            </div>
            <Text className='traders-hub-header__tradershub--text'>
                <Localize i18n_default_text="Trader's Hub" />
            </Text>
            <a href="https://wa.me/your_whatsapp_number">
                <svg fill="none" height="26" viewBox="0 0 32 32" width="26" xmlns="http://www.w3.org/2000/svg">
                    <path d="m0 16c0 8.8366 7.16344 16 16 16 8.8366 0 16-7.1634 16-16 0-8.83656-7.1634-16-16-16-8.83656 0-16 7.16344-16 16z" fill="#25d366"/>
                    <path clipRule="evenodd" d="m21.6 10.3c-1.5-1.5-3.5-2.3-5.6-2.3-4.4 0-8 3.6-8 8 0 1.4.40001 2.8 1.10001 4l-1.10001 4 4.2-1.1c1.2.6 2.5 1 3.8 1 4.4 0 8-3.6 8-8 0-2.1-.9-4.1-2.4-5.6zm-5.6 12.3c-1.2 0-2.4-.3-3.4-.9l-.2-.1-2.50001.7.70001-2.4-.2-.3c-.70001-1.1-1.00001-2.3-1.00001-3.5 0-3.6 3.00001-6.6 6.60001-6.6 1.8 0 3.4.7 4.7 1.9 1.3 1.3 1.9 2.9 1.9 4.7 0 3.5-2.9 6.5-6.6 6.5zm3.6-5c-.2-.1-1.2-.6-1.4-.6-.2-.1-.3-.1-.4.1s-.5.6-.6.8c-.1.1-.2.1-.4.1-.2-.1-.8-.3-1.6-1-.6-.5-1-1.2-1.1-1.4s0-.3.1-.4.2-.2.3-.3.1-.2.2-.3 0-.2 0-.3-.4-1.1-.6-1.5c-.1-.3-.3-.3-.4-.3s-.2 0-.4 0c-.1 0-.3 0-.5.2s-.7.7-.7 1.7.7 1.9.8 2.1c.1.1 1.4 2.2 3.4 3 1.7.7 2 .5 2.4.5s1.2-.5 1.3-.9c.2-.5.2-.9.1-.9-.1-.5-.3-.5-.5-.6z" fill="#fff" fillRule="evenodd"/>
                </svg>
            </a>
        </div>
    );
});

export default TradersHubHomeButton;
