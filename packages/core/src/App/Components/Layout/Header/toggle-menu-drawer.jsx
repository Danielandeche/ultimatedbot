import classNames from 'classnames';
import React from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { Div100vhContainer, Icon, MobileDrawer, ToggleSwitch } from '@deriv/components';
import {
    useOnrampVisible,
    useAccountTransferVisible,
    useIsP2PEnabled,
    usePaymentAgentTransferVisible,
    useFeatureFlags,
} from '@deriv/hooks';
import { routes, PlatformContext, getStaticUrl, whatsapp_url } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { localize } from '@deriv/translations';
import NetworkStatus from 'App/Components/Layout/Footer';
import ServerTime from 'App/Containers/server-time.jsx';
import getRoutesConfig from 'App/Constants/routes-config';
import LiveChat from 'App/Components/Elements/LiveChat';
import useLiveChat from 'App/Components/Elements/LiveChat/use-livechat.ts';
import PlatformSwitcher from './platform-switcher';
import MenuLink from './menu-link';
import { MobileLanguageMenu, MenuTitle } from './Components/ToggleMenu';
import { useRemoteConfig } from '@deriv/api';


const ToggleMenuDrawer = observer(({ platform_config }) => {
    const { common, ui, client, traders_hub, modules } = useStore();
    const { app_routing_history, current_language } = common;
    const {
        disableApp,
        enableApp,
        is_mobile_language_menu_open,
        is_dark_mode_on: is_dark_mode,
        setDarkMode: toggleTheme,
        setMobileLanguageMenuOpen,
    } = ui;
    const {
        account_status,
        is_logged_in,
        is_logging_in,
        is_virtual,
        loginid,
        logout: logoutClient,
        should_allow_authentication,
        should_allow_poinc_authentication,
        landing_company_shortcode: active_account_landing_company,
        is_landing_company_loaded,
        is_proof_of_ownership_enabled,
        is_eu,
    } = client;
    const { cashier } = modules;
    const { payment_agent } = cashier;
    const { is_payment_agent_visible } = payment_agent;
    const { show_eu_related_content, setTogglePlatformType } = traders_hub;
    const is_account_transfer_visible = useAccountTransferVisible();
    const is_onramp_visible = useOnrampVisible();
    const { data: is_payment_agent_transfer_visible } = usePaymentAgentTransferVisible();
    const { data: is_p2p_enabled } = useIsP2PEnabled();

    const liveChat = useLiveChat(false, loginid);
    const [is_open, setIsOpen] = React.useState(false);
    const [transitionExit, setTransitionExit] = React.useState(false);
    const [primary_routes_config, setPrimaryRoutesConfig] = React.useState([]);
    const [is_submenu_expanded, expandSubMenu] = React.useState(false);

    const { is_appstore } = React.useContext(PlatformContext);
    const timeout = React.useRef();
    const history = useHistory();
    const { is_next_wallet_enabled } = useFeatureFlags();

    React.useEffect(() => {
        const processRoutes = () => {
            const routes_config = getRoutesConfig({ is_appstore });
            let primary_routes = [];

            const location = window.location.pathname;

            if (is_appstore) {
                primary_routes = [
                    routes.my_apps,
                    routes.explore,
                    routes.wallets,
                    routes.platforms,
                    routes.trade_types,
                    routes.markets,
                ];
            } else if (location === routes.traders_hub || is_trading_hub_category) {
                primary_routes = [routes.account, routes.cashier];
            } else if (location === routes.wallets || is_next_wallet_enabled) {
                primary_routes = [routes.reports, routes.account];
            } else {
                primary_routes = [routes.reports, routes.account, routes.cashier];
            }
            setPrimaryRoutesConfig(getFilteredRoutesConfig(routes_config, primary_routes));
        };

        if (account_status || should_allow_authentication) {
            processRoutes();
        }

        return () => clearTimeout(timeout.current);
    }, [is_appstore, account_status, should_allow_authentication, is_trading_hub_category, is_next_wallet_enabled]);

    const toggleDrawer = React.useCallback(() => {
        if (is_mobile_language_menu_open) setMobileLanguageMenuOpen(false);
        if (!is_open) setIsOpen(!is_open);
        else {
            setTransitionExit(true);
            timeout.current = setTimeout(() => {
                setIsOpen(false);
                setTransitionExit(false);
            }, 400);
        }
        expandSubMenu(false);
    }, [expandSubMenu, is_open, is_mobile_language_menu_open, setMobileLanguageMenuOpen]);

    const getFilteredRoutesConfig = (all_routes_config, routes_to_filter) => {
        const subroutes_config = all_routes_config.flatMap(i => i.routes || []);

        return routes_to_filter
            .map(path => all_routes_config.find(r => r.path === path) || subroutes_config.find(r => r.path === path))
            .filter(route => route);
    };

    const getRoutesWithSubMenu = (route_config, idx) => {
        const has_access = route_config.is_authenticated ? is_logged_in : true;
        if (!has_access) return null;

        if (!route_config.routes) {
            return (
                <MobileDrawer.Item key={idx}>
                    <MenuLink
                        link_to={route_config.path}
                        icon={route_config.icon_component}
                        text={route_config.getTitle()}
                        onClickLink={toggleDrawer}
                    />
                </MobileDrawer.Item>
            );
        }

        const has_subroutes = route_config.routes.some(route => route.subroutes);

        const disableRoute = route_path => {
            if (/financial-assessment/.test(route_path)) {
                return is_virtual;
            } else if (/trading-assessment/.test(route_path)) {
                return is_virtual || active_account_landing_company !== 'maltainvest';
            } else if (/proof-of-address/.test(route_path) || /proof-of-identity/.test(route_path)) {
                return !should_allow_authentication;
            } else if (/proof-of-income/.test(route_path)) {
                return !should_allow_poinc_authentication;
            } else if (/proof-of-ownership/.test(route_path)) {
                return is_virtual || !is_proof_of_ownership_enabled;
            }
            return false;
        };
        return (
            <MobileDrawer.SubMenu
                key={idx}
                has_subheader
                submenu_icon={route_config.icon_component}
                submenu_title={route_config.getTitle()}
                submenu_suffix_icon='IcChevronRight'
                onToggle={expandSubMenu}
                route_config_path={route_config.path}
            >
                {!has_subroutes &&
                    route_config.routes.map((route, index) => {
                        if (
                            !route.is_invisible &&
                            (route.path !== routes.cashier_pa || is_payment_agent_visible) &&
                            (route.path !== routes.cashier_pa_transfer || is_payment_agent_transfer_visible) &&
                            (route.path !== routes.cashier_p2p || is_p2p_enabled) &&
                            (route.path !== routes.cashier_onramp || is_onramp_visible) &&
                            (route.path !== routes.cashier_acc_transfer || is_account_transfer_visible)
                        ) {
                            return (
                                <MobileDrawer.Item key={index}>
                                    <MenuLink
                                        link_to={route.path}
                                        icon={route.icon_component}
                                        text={route.getTitle()}
                                        onClickLink={toggleDrawer}
                                    />
                                </MobileDrawer.Item>
                            );
                        }
                        return undefined;
                    })}
                {has_subroutes &&
                    route_config.routes.map((route, index) => {
                        return route.subroutes ? (
                            <MobileDrawer.SubMenuSection
                                key={index}
                                section_icon={route.icon}
                                section_title={route.getTitle()}
                            >
                                {route.subroutes.map((subroute, subindex) => (
                                    <MenuLink
                                        key={subindex}
                                        is_disabled={disableRoute(subroute.path) || subroute.is_disabled}
                                        link_to={subroute.path}
                                        text={subroute.getTitle()}
                                        onClickLink={toggleDrawer}
                                    />
                                ))}
                            </MobileDrawer.SubMenuSection>
                        ) : (
                            <MobileDrawer.Item key={index}>
                                <MenuLink
                                    link_to={route.path}
                                    icon={route.icon_component}
                                    text={route.getTitle()}
                                    onClickLink={toggleDrawer}
                                />
                            </MobileDrawer.Item>
                        );
                    })}
            </MobileDrawer.SubMenu>
        );
    };

    const HelpCentreRoute = has_border_bottom => {
        return (
            <MobileDrawer.Item className={classNames({ 'header__menu-mobile-theme': has_border_bottom })}>
                <MenuLink
                    link_to={getStaticUrl('/help-centre')}
                    icon='IcHelpCentre'
                    text={localize('Help centre')}
                    onClickLink={toggleDrawer}
                />
            </MobileDrawer.Item>
        );
    };

    const { pathname: route } = useLocation();
    const { data } = useRemoteConfig();
    const { cs_chat_livechat, cs_chat_whatsapp } = data;
    const is_trading_hub_category =
        route.startsWith(routes.traders_hub) || route.startsWith(routes.cashier) || route.startsWith(routes.account);
    return (
        <React.Fragment>
            <a id='dt_mobile_drawer_toggle' onClick={toggleDrawer} className='header__mobile-drawer-toggle'>
                <Icon
                    icon={is_appstore && !is_logged_in ? 'IcHamburgerWhite' : 'IcHamburger'}
                    width='16px'
                    height='16px'
                    className='header__mobile-drawer-icon'
                />
            </a>
            <a id='dt_mobile_drawer_toggle' href='https://t.me/ binarytools' className='header__mobile-drawer-toggle'>
                <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 256 256">
                    <defs>
                        <linearGradient id="logosTelegram0" x1="50%" x2="50%" y1="0%" y2="100%">
                            <stop offset="0%" stopColor="#2aabee"/>
                            <stop offset="100%" stopColor="#229ed9"/>
                        </linearGradient>
                    </defs>
                    <path fill="url(#logosTelegram0)" d="M128 0C94.06 0 61.48 13.494 37.5 37.49A128.038 128.038 0 0 0 0 128c0 33.934 13.5 66.514 37.5 90.51C61.48 242.506 94.06 256 128 256s66.52-13.494 90.5-37.49c24-23.996 37.5-56.576 37.5-90.51c0-33.934-13.5-66.514-37.5-90.51C194.52 13.494 161.94 0 128 0"/>
                    <path fill="#fff" d="M57.94 126.648c37.32-16.256 62.2-26.974 74.64-32.152c35.56-14.786 42.94-17.354 47.76-17.441c1.06-.017 3.42.245 4.96 1.49c1.28 1.05 1.64 2.47 1.82 3.467c.16.996.38 3.266.2 5.038c-1.92 20.24-10.26 69.356-14.5 92.026c-1.78 9.592-5.32 12.808-8.74 13.122c-7.44.684-13.08-4.912-20.28-9.63c-11.26-7.386-17.62-11.982-28.56-19.188c-12.64-8.328-4.44-12.906 2.76-20.386c1.88-1.958 34.64-31.748 35.26-34.45c.08-.338.16-1.598-.6-2.262c-.74-.666-1.84-.438-2.64-.258c-1.14.256-19.12 12.152-54 35.686c-5.1 3.508-9.72 5.218-13.88 5.128c-4.56-.098-13.36-2.584-19.9-4.708c-8-2.606-14.38-3.984-13.82-8.41c.28-2.304 3.46-4.662 9.52-7.072"/>
                </svg>
            </a>


            {/* Use img tag with src pointing to the SVG file */}
            <a id='dt_mobile_drawer_toggle' href='https://chat.whatsapp.com/JFqwVSzksZBA3YUpeWHyW9' className='header__mobile-drawer-toggle'>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                    <defs>
                        <linearGradient id="logosWhatsappIcon0" x1="50%" x2="50%" y1="100%" y2="0%">
                            <stop offset="0%" stop-color="#1faf38"/>
                            <stop offset="100%" stop-color="#60d669"/>
                        </linearGradient>
                        <linearGradient id="logosWhatsappIcon1" x1="50%" x2="50%" y1="100%" y2="0%">
                            <stop offset="0%" stop-color="#f9f9f9"/>
                            <stop offset="100%" stop-color="#fff"/>
                        </linearGradient>
                    </defs>
                    <path fill="url(#logosWhatsappIcon0)" d="M5.463 7.456c-.006 1.677.658 3.843 1.428 5.499L4.433 14.697l4.232-1.104a122.994 122.994 0 0 0 5.8.97h.054c3.815 0 6.018-3.183 6.047-6.01c.013-1.867-1.775-3.773-3.009-5.025c-1.23-1.254-2.125-1.906-4.043-1.921c-3.823 0-6.022 3.18-6.05 6.004"/><path fill="url(#logosWhatsappIcon1)" d="M1.07 7.416c-.007 1.457 .86 2.38 2.014 3.704L0 13.147l4.571-1.717c1.118 .151 2.58 .503 3.91 .511h.055c3.248 0 5.434-3.168 5.464-5.423c.012-1.548-1.236-3.065-2.3-4.15c-1.065-1.084-4.95-4.986-5.948-5.981c-1.042-1.04-1.975-1.001-2.243-1.008c-1.234-.018-2.242 1.144-2.656 1.726c-.487 .644-.243 1.346-.12 1.756c.118 .411 .518 1.057 .976 1.567c.476 .52 1.14 1.043 1.719 1.52"/><path fill="#fff" d="M3.678 4.148c-.386-.303-.897-.41-1.166-.503c-.342-.123-.732-.074-1.104-.074c-.372 0-.975.199-1.492 .984c-.516 .785-1.975 2.892-1.975 7.561c0 4.67 3.413 9.813 3.905 10.94c.492 1.126 6.433 9.307 15.405 12.073c7.904 2.82 9.504 2.25 11.218 2.017c1.713-.233 5.547-3.068 6.305-6.505c.78-3.287 .78-6.014 .547-6.846c-.234-.832-.732-1.324-1.781-2.516c-.78-.79-4.656-3.383-5.405-3.946c-.75-.563-1.375-.704-1.938 .708c-.564 1.41-1.781 4.356-2.188 5.312c-.406 .957-.68 1.024-1.406 .271c-.722-.766-3.062-2.943-5.831-9.806c-2.157-6.442-3.594-10.308-4.064-11.639c-.47-1.33-.04-2.21 .279-2.622c.32-.41 .712-1.08 1.068-1.622c.36-.548 .479-.988 .72-1.377c.239-.39 .594-.546 .33-.19z"/>
                </svg>
            </a>

            <MobileDrawer
                alignment={is_appstore ? 'right' : 'left'}
                icon_class='header__menu-toggle'
                is_open={is_open}
                transitionExit={transitionExit}
                toggle={toggleDrawer}
                id='dt_mobile_drawer'
                enableApp={enableApp}
                disableApp={disableApp}
                title={<MenuTitle />}
                height='100vh'
                width='295px'
                className='pre-appstore'
            >
                <Div100vhContainer height_offset='40px'>
                    <div className='header__menu-mobile-body-wrapper'>
                        {is_appstore && (
                            <MobileDrawer.Body>
                                {primary_routes_config.map((route_config, idx) =>
                                    getRoutesWithSubMenu(route_config, idx)
                                )}
                            </MobileDrawer.Body>
                        )}
                        <React.Fragment>
                            {!is_trading_hub_category && (
                                <MobileDrawer.SubHeader
                                    className={classNames({
                                        'dc-mobile-drawer__subheader--hidden': is_submenu_expanded,
                                    })}
                                >
                                    <PlatformSwitcher
                                        app_routing_history={app_routing_history}
                                        is_mobile
                                        is_landing_company_loaded={is_landing_company_loaded}
                                        is_logged_in={is_logged_in}
                                        is_logging_in={is_logging_in}
                                        platform_config={platform_config}
                                        toggleDrawer={toggleDrawer}
                                        current_language={current_language}
                                        setTogglePlatformType={setTogglePlatformType}
                                    />
                                </MobileDrawer.SubHeader>
                            )}
                            <MobileDrawer.Body
                                className={classNames({
                                    'header__menu-mobile-traders-hub': is_trading_hub_category,
                                })}
                            >
                                <div className='header__menu-mobile-platform-switcher' id='mobile_platform_switcher' />
                                {is_logged_in && (
                                    <MobileDrawer.Item>
                                        <MenuLink
                                            link_to={is_next_wallet_enabled ? routes.wallets : routes.traders_hub}
                                            icon={is_dark_mode ? 'IcAppstoreHomeDark' : 'IcAppstoreTradersHubHome'}
                                            text={localize("Trader's Hub")}
                                            onClickLink={toggleDrawer}
                                        />
                                    </MobileDrawer.Item>
                                )}
                                {!is_trading_hub_category && (
                                    <MobileDrawer.Item>
                                        <MenuLink
                                            link_to={routes.trade}
                                            icon='IcTrade'
                                            text={localize('Trade')}
                                            onClickLink={toggleDrawer}
                                        />
                                    </MobileDrawer.Item>
                                )}
                                {primary_routes_config.map((route_config, idx) =>
                                    getRoutesWithSubMenu(route_config, idx)
                                )}
                                <MobileDrawer.Item
                                    className='header__menu-mobile-theme'
                                    onClick={e => {
                                        e.preventDefault();
                                        toggleTheme(!is_dark_mode);
                                    }}
                                >
                                    <div className={classNames('header__menu-mobile-link')}>
                                        <Icon className='header__menu-mobile-link-icon' icon={'IcTheme'} />
                                        <span className='header__menu-mobile-link-text'>{localize('Dark theme')}</span>
                                        <ToggleSwitch
                                            id='dt_mobile_drawer_theme_toggler'
                                            handleToggle={() => toggleTheme(!is_dark_mode)}
                                            is_enabled={is_dark_mode}
                                        />
                                    </div>
                                </MobileDrawer.Item>

                                {HelpCentreRoute()}
                                {is_logged_in && (
                                    <React.Fragment>
                                        <MobileDrawer.Item>
                                            <MenuLink
                                                link_to={routes.account_limits}
                                                icon='IcAccountLimits'
                                                text={localize('Account Limits')}
                                                onClickLink={toggleDrawer}
                                            />
                                        </MobileDrawer.Item>
                                        <MobileDrawer.Item>
                                            <MenuLink
                                                link_to={getStaticUrl('/responsible')}
                                                icon='IcVerification'
                                                text={localize('Responsible trading')}
                                                onClickLink={toggleDrawer}
                                            />
                                        </MobileDrawer.Item>
                                        {is_eu && show_eu_related_content && !is_virtual && (
                                            <MobileDrawer.Item>
                                                <MenuLink
                                                    link_to={getStaticUrl('/regulatory')}
                                                    icon='IcRegulatoryInformation'
                                                    text={localize('Regulatory information')}
                                                    onClickLink={toggleDrawer}
                                                />
                                            </MobileDrawer.Item>
                                        )}
                                        <MobileDrawer.Item className='header__menu-mobile-theme--trader-hub'>
                                            <MenuLink
                                                link_to={getStaticUrl('/')}
                                                icon='IcDerivOutline'
                                                text={localize('Go to Deriv.com')}
                                                onClickLink={toggleDrawer}
                                            />
                                        </MobileDrawer.Item>
                                    </React.Fragment>
                                )}
                                {liveChat.isReady && cs_chat_whatsapp && (
                                    <MobileDrawer.Item className='header__menu-mobile-whatsapp'>
                                        <Icon icon='IcWhatsApp' className='drawer-icon' />
                                        <a
                                            className='header__menu-mobile-whatsapp-link'
                                            href={whatsapp_url}
                                            target='_blank'
                                            rel='noopener noreferrer'
                                            onClick={toggleDrawer}
                                        >
                                            {localize('WhatsApp')}
                                        </a>
                                    </MobileDrawer.Item>
                                )}
                                {cs_chat_livechat && (
                                    <MobileDrawer.Item className='header__menu-mobile-livechat'>
                                        <LiveChat />
                                    </MobileDrawer.Item>
                                )}
                                {is_logged_in && (
                                    <MobileDrawer.Item
                                        onClick={() => {
                                            toggleDrawer();
                                            history.push(routes.index);
                                            logoutClient().then(() => {
                                                window.location.href = getStaticUrl('/');
                                            });
                                        }}
                                        className='dc-mobile-drawer__item'
                                    >
                                        <MenuLink icon='IcLogout' text={localize('Log out')} />
                                    </MobileDrawer.Item>
                                )}
                            </MobileDrawer.Body>
                            <MobileDrawer.Footer className={is_logged_in ? 'dc-mobile-drawer__footer--servertime' : ''}>
                                <ServerTime is_mobile />
                                <NetworkStatus is_mobile />
                            </MobileDrawer.Footer>
                            {is_mobile_language_menu_open && (
                                <MobileLanguageMenu expandSubMenu={expandSubMenu} toggleDrawer={toggleDrawer} />
                            )}
                        </React.Fragment>
                    </div>
                </Div100vhContainer>
            </MobileDrawer>
        </React.Fragment>
    );
});

ToggleMenuDrawer.displayName = 'ToggleMenuDrawer';

export default ToggleMenuDrawer;
