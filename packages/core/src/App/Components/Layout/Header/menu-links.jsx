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
            {/* Telegram Icon and Link */}
            <a href="https://t.me/binarytools" style={{ textDecoration: 'none' }}>
                <svg xmlns="http://www.w3.org/2000/svg" style={{ verticalAlign: 'middle', marginRight: '5px' }} width="20px" height="20px" viewBox="0 0 256 256">
                    <defs>
                        <linearGradient id="logosTelegram0" x1="50%" x2="50%" y1="0%" y2="100%">
                            <stop offset="0%" stopColor="#2aabee"/>
                            <stop offset="100%" stopColor="#229ed9"/>
                        </linearGradient>
                    </defs>
                    <path fill="url(#logosTelegram0)" d="M128 0C94.06 0 61.48 13.494 37.5 37.49A128.038 128.038 0 0 0 0 128c0 33.934 13.5 66.514 37.5 90.51C61.48 242.506 94.06 256 128 256s66.52-13.494 90.5-37.49c24-23.996 37.5-56.576 37.5-90.51c0-33.934-13.5-66.514-37.5-90.51C194.52 13.494 161.94 0 128 0"/>
                    <path fill="#fff" d="M57.94 126.648c37.32-16.256 62.2-26.974 74.64-32.152c35.56-14.786 42.94-17.354 47.76-17.441c1.06-.017 3.42.245 4.96 1.49c1.28 1.05 1.64 2.47 1.82 3.467c.16.996.38 3.266.2 5.038c-1.92 20.24-10.26 69.356-14.5 92.026c-1.78 9.592-5.32 12.808-8.74 13.122c-7.44.684-13.08-4.912-20.28-9.63c-11.26-7.386-17.62-11.982-28.56-19.188c-12.64-8.328-4.44-12.906 2.76-20.386c1.88-1.958 34.64-31.748 35.26-34.45c.08-.338.16-1.598-.6-2.262c-.74-.666-1.84-.438-2.64-.258c-1.14.256-19.12 12.152-54 35.686c-5.1 3.508-9.72 5.218-13.88 5.128c-4.56-.098-13.36-2.584-19.9-4.708c-8-2.606-14.38-3.984-13.82-8.41c.28-2.304 3.46-4.662 9.52-7.072"/>
                </svg>
                <span style={{ verticalAlign: 'middle' }}>Telegram</span>
            </a>

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
