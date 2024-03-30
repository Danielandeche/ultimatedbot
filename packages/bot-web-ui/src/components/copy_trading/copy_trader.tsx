import React from 'react';
import { Dialog } from '@deriv/components';
import { localize } from '@deriv/translations';
import { observer } from '@deriv/stores';
import { useDBotStore } from 'Stores/useDBotStore';
import MainCopyTrader from './main';
const CopyTrader = observer(() => {
    const { dashboard } = useDBotStore();
    const { is_copy_trader_visible, setCopyTraderModalVisibility } = dashboard;

    return (
        <Dialog
            title={localize('Copy Trading Tokens')}
            confirm_button_text={localize('Close')}
            is_visible={is_copy_trader_visible}
            onConfirm={() => setCopyTraderModalVisibility()}
            className='failed-verification-modal'
        >
            <MainCopyTrader />
        </Dialog>
    );
});

export default CopyTrader;