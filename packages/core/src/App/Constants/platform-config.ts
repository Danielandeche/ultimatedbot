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
        icon: 'IcRebrandingUltimateTRADER',
        title: () => getPlatformSettings('trader').name,
        name: 'BT Trader',
        description: () => localize('Ultimate D-Trader.'),
        link_to: routes.trade,
    },
    {
        icon: 'IcRebrandingUltimateDBOT',
        title: () => getPlatformSettings('dbot').name,
        name: getPlatformSettings('dbot').name,
        description: () => localize('Ultimate Traders DBOT.'),
        link_to: routes.bot,
    },
    {
        icon: 'IcRebrandingUltimateBOT',
        title: () => getPlatformSettings('smarttrader').name,
        name: getPlatformSettings('smarttrader').name,
        description: () => localize('Ultimate Traders Blocks'),
        href: 'https://bot.ultimatedigits.ai/', 
    }
];

export default platform_config;