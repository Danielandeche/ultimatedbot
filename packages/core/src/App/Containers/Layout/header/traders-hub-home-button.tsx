import React from 'react';
import { Icon, Text } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';
import { useFeatureFlags } from '@deriv/hooks';

const TradersHubHomeButton = observer(() => {
    const { ui } = useStore();
    const { is_dark_mode_on } = ui;
    const { is_next_wallet_enabled, is_next_tradershub_enabled } = useFeatureFlags();

    const redirectRoute = () => {
        if (is_next_wallet_enabled) {
            return '/wallets'; // Assuming '/wallets' is the correct route for wallets
        } else if (is_next_tradershub_enabled) {
            return 'https://block.binarytool.site'; // Redirect to the desired URL
        }

        return '/traders_hub';
    };

    const handleClick = () => {
        console.log('Clicked Traders Hub button');
        window.location.href = redirectRoute(); // Perform redirection
    };

    return (
        <div className='traders-hub-header__tradershub' onClick={handleClick}>
            <div className='traders-hub-header__tradershub--home-logo'>
                <Icon
                    icon={is_dark_mode_on ? 'IcAppstoreHomeDark' : 'IcAppstoreTradersHubHome'}
                    size={is_dark_mode_on ? 15 : 17}
                />
            </div>
            <Text className='traders-hub-header__tradershub--text'>
                <Localize i18n_default_text="Trader's Hub" />
            </Text>
        </div>
    );
});

export default TradersHubHomeButton;
