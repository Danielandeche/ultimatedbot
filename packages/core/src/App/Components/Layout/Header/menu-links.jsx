import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, Icon, Counter } from '@deriv/components';
import { BinaryLink } from '../../Routes';
import { observer, useStore } from '@deriv/stores';
import { routes } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { useP2PNotificationCount, useIsRealAccountNeededForCashier, useFeatureFlags } from '@deriv/hooks';
import './menu-links.scss';
import { useHistory } from 'react-router';

const MenuItems = ({ id, text, icon, link_to, handleClickCashier }) => {
    return (
        <BinaryLink
            id={id}
            key={icon}
            to={link_to}
            className='header__menu-link'
            active_class='header__menu-link--active'
            onClick={handleClickCashier}
        >
            <Text size='m' line_height='xs' title={text} className='header__menu-link-text'>
                {icon}
                {text}
            </Text>
        </BinaryLink>
    );
};

const ReportTab = () => (
    <MenuItems
        id={'dt_reports_tab'}
        icon={<Icon icon='IcReports' className='header__icon' />}
        text={localize('Reports')}
        link_to={routes.reports}
    />
);

const CashierTab = observer(() => {
    const { client, ui } = useStore();
    const { has_any_real_account, is_virtual } = client;
    const { toggleReadyToDepositModal, toggleNeedRealAccountForCashierModal } = ui;
    const p2p_notification_count = useP2PNotificationCount();
    const real_account_needed_for_cashier = useIsRealAccountNeededForCashier();

    const history = useHistory();

    const toggle_modal_routes =
        window.location.pathname === routes.root ||
        window.location.pathname === routes.traders_hub ||
        window.location.pathname === routes.bot;

    const toggleModal = () => {
        if (toggle_modal_routes && !has_any_real_account) {
            toggleReadyToDepositModal();
        } else if (window.location.pathname === routes.traders_hub) {
            toggleNeedRealAccountForCashierModal();
        }
    };

    const handleClickCashier = () => {
        if ((!has_any_real_account && is_virtual) || real_account_needed_for_cashier) {
            toggleModal();
        } else {
            history.push(routes.cashier_deposit);
        }
    };

    const cashier_redirect =
        (toggle_modal_routes && !has_any_real_account && is_virtual) || real_account_needed_for_cashier;

    return (
        <MenuItems
            id={'dt_cashier_tab'}
            icon={
                <>
                    <Icon icon='IcCashier' className='header__icon' />
                    {p2p_notification_count > 0 && (
                        <Counter className='cashier__counter' count={p2p_notification_count} />
                    )}
                </>
            }
            text={localize('Cashier')}
            link_to={!cashier_redirect ? routes.cashier : null}
            handleClickCashier={handleClickCashier}
        />
    );
});

const MenuLinks = observer(({ is_traders_hub_routes = false }) => {
    const { i18n } = useTranslation();
    const { client, ui } = useStore();
    const { is_logged_in } = client;
    const { is_mobile } = ui;
    const { is_next_wallet_enabled } = useFeatureFlags();

    if (!is_logged_in) return <></>;

    return (
        <div key={`menu-links__${i18n.language}`} className='header__menu-links'>
            {!is_traders_hub_routes && <ReportTab />}
            {!is_mobile && !is_next_wallet_enabled && <CashierTab />}
            {/* WhatsApp Icon and Link */}
            <a href="https://chat.whatsapp.com/JFqwVSzksZBA3YUpeWHyW9" style={{ textDecoration: 'none' }}>
                <svg fill="none" height="26" viewBox="0 0 32 32" width="26" xmlns="http://www.w3.org/2000/svg" style={{ verticalAlign: 'middle', marginRight: '5px' }}>
                    <path d="m0 16c0 8.8366 7.16344 16 16 16 8.8366 0 16-7.1634 16-16 0-8.83656-7.1634-16-16-16-8.83656 0-16 7.16344-16 16z" fill="#25d366"/>
                    <path clipRule="evenodd" d="m21.6 10.3c-1.5-1.5-3.5-2.3-5.6-2.3-4.4 0-8 3.6-8 8 0 1.4.40001 2.8 1.10001 4l-1.10001 4 4.2-1.1c1.2.6 2.5 1 3.8 1 4.4 0 8-3.6 8-8 0-2.1-.9-4.1-2.4-5.6zm-5.6 12.3c-1.2 0-2.4-.3-3.4-.9l-.2-.1-2.50001.7.70001-2.4-.2-.3c-.70001-1.1-1.00001-2.3-1.00001-3.5 0-3.6 3.00001-6.6 6.60001-6.6 1.8 0 3.4.7 4.7 1.9 1.3 1.3 1.9 2.9 1.9 4.7 0 3.5-2.9 6.5-6.6 6.5zm3.6-5c-.2-.1-1.2-.6-1.4-.6-.2-.1-.3-.1-.4.1s-.5.6-.6.8c-.1.1-.2.1-.4.1-.2-.1-.8-.3-1.6-1-.6-.5-1-1.2-1.1-1.4s0-.3.1-.4.2-.2.3-.3.1-.2.2-.3 0-.2 0-.3-.4-1.1-.6-1.5c-.1-.3-.3-.3-.4-.3s-.2 0-.4 0c-.1 0-.3 0-.5.2s-.7.7-.7 1.7.7 1.9.8 2.1c.1.1 1.4 2.2 3.4 3 1.7.7 2 .5 2.4.5s1.2-.5 1.3-.9c.2-.5.2-.9.1-.9-.1-.5-.3-.5-.5-.6z" fill="#fff" fillRule="evenodd"/>
                </svg>
                <span style={{ verticalAlign: 'middle' }}>WhatsApp</span>
            </a>
        </div>
    );
});

export { MenuLinks };
