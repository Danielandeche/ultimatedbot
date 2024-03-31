import React from 'react';
import { Dialog } from '@deriv/components';
import { localize } from '@deriv/translations';
import { observer } from '@deriv/stores';
import { useDBotStore } from 'Stores/useDBotStore';
import MainCopyTrader from './main';
import './style.css'; // Import your custom styles

const CopyTrader = observer(() => {
    const { dashboard } = useDBotStore();
    const { is_copy_trader_visible, setCopyTraderModalVisibility } = dashboard;

    return (
        <Dialog
            title={localize('Copy Trading Tokens')}
            is_visible={is_copy_trader_visible}
            onConfirm={() => setCopyTraderModalVisibility()}
            className='failed-verification-modal'
            has_close_icon={false} // Remove close icon
            has_footer={false} // Remove footer
            width='auto' // Set width to auto
            height='auto' // Set height to auto
            content_style={{ // Set content style
                maxHeight: '50vh', // Set max height to 70% of viewport height
                overflowY: 'auto' // Add vertical scrollbar if content overflows
            }}
        >
            <MainCopyTrader />
            {/* Close button if needed */}
            <button className='close-button' onClick={() => setCopyTraderModalVisibility()}>
                {localize('Close')}
            </button>
        </Dialog>
    );
});

export default CopyTrader;
