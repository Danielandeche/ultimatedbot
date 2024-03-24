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
            <a id='dt_mobile_drawer_toggle' href='https://t.me/binarytools' className='header__mobile-drawer-toggle'>
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
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="256" height="256" viewBox="0 0 256 256" xml:space="preserve">
                <defs></defs>
                <g style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: none; fill-rule: nonzero; opacity: 1;" transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)">
                    <circle cx="45" cy="45" r="45" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(75,174,79); fill-rule: nonzero; opacity: 1;" transform="  matrix(1 0 0 1 0 0) "></circle>
                    <path d="M 22.608 69.5 c -0.527 0 -1.041 -0.209 -1.422 -0.594 c -0.502 -0.508 -0.696 -1.245 -0.507 -1.935 l 2.949 -10.77 c -1.857 -3.498 -2.834 -7.424 -2.833 -11.406 C 20.8 31.399 31.701 20.5 45.094 20.5 c 6.498 0.002 12.603 2.533 17.189 7.126 c 4.587 4.592 7.111 10.697 7.109 17.189 c -0.005 13.398 -10.905 24.298 -24.299 24.298 c -3.79 -0.001 -7.541 -0.892 -10.906 -2.583 l -11.072 2.904 C 22.948 69.479 22.777 69.5 22.608 69.5 z M 34.429 62.399 c 0.332 0 0.662 0.083 0.958 0.244 c 2.961 1.615 6.314 2.469 9.699 2.47 c 11.197 0 20.302 -9.106 20.307 -20.3 c 0.002 -5.424 -2.107 -10.524 -5.939 -14.36 c -3.832 -3.837 -8.932 -5.951 -14.36 -5.953 c -11.188 0 -20.293 9.105 -20.298 20.298 c -0.001 3.565 0.936 7.075 2.709 10.147 c 0.267 0.463 0.337 1.013 0.197 1.528 l -2.249 8.213 l 8.47 -2.222 C 34.088 62.421 34.259 62.399 34.429 62.399 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(255,255,255); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round"></path>
                    <path d="M 36.375 45.246 c -0.285 -0.38 -2.325 -3.088 -2.325 -5.891 c 0 -2.803 1.471 -4.181 1.993 -4.751 c 0.522 -0.57 1.139 -0.712 1.519 -0.712 c 0.38 0 0.76 0.004 1.092 0.02 c 0.35 0.018 0.819 -0.133 1.281 0.978 c 0.475 1.14 1.613 3.944 1.756 4.229 c 0.143 0.285 0.237 0.617 0.048 0.998 c -0.19 0.38 -0.285 0.617 -0.569 0.95 c -0.285 0.333 -0.598 0.743 -0.855 0.998 c -0.285 0.284 -0.582 0.592 -0.25 1.162 c 0.332 0.57 1.475 2.435 3.168 3.946 c 2.175 1.941 4.01 2.542 4.58 2.827 c 0.569 0.285 0.902 0.238 1.234 -0.143 c 0.332 -0.38 1.424 -1.663 1.804 -2.233 c 0.38 -0.57 0.759 -0.475 1.281 -0.285 c 0.522 0.19 3.322 1.568 3.891 1.853 c 0.569 0.285 0.949 0.428 1.092 0.665 c 0.143 0.238 0.143 1.378 -0.332 2.708 c -0.475 1.33 -2.75 2.545 -3.844 2.708 c -0.981 0.147 -2.223 0.208 -3.587 -0.226 c -0.827 -0.262 -1.888 -0.613 -3.247 -1.2 C 40.391 51.379 36.661 45.626 36.375 45.246 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(255,255,255); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round"></path>
                </g>
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
