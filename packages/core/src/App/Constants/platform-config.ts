import { getPlatformSettings, routes } from '@deriv/shared';
import { localize } from '@deriv/translations';

type TPlatformConfig = {
    description: () => string;
    href?: string;
    icon: string;
    link_to?: string;
    name: string;
    title: () => string;
};

const platform_config: TPlatformConfig[] = [
    {
        icon: 'IcRebrandingUltimateTrader',
        title: () => getPlatformSettings('trader').name,
        name: 'BT Trader',
        description: () => localize('Ultimate D-Trader.'),
        link_to: routes.trade,
    },
    {
        icon: 'IcRebrandingUltimateDbot',
        title: () => getPlatformSettings('dbot').name,
        name: getPlatformSettings('dbot').name,
        description: () => localize('Ultimate DBOT.'),
        link_to: routes.bot,
    },
    {
        icon: 'IcRebrandingUltimateBot',
        title: () => getPlatformSettings('smarttrader').name,
        name: getPlatformSettings('smarttrader').name,
        description: () => localize('Ultimate Binary Bot'),
        href: 'https://bot.ultimatedigits.ai/', 
    }
];

export default platform_config;