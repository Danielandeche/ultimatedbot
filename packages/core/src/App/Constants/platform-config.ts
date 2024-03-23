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
        icon: getPlatformSettings('trader').icon,
        title: () => getPlatformSettings('trader').name,
        name: getPlatformSettings('trader').name,
        description: () => localize('Binarytool Trader.'),
        link_to: routes.trade,
    },
    {
        icon: getPlatformSettings('dbot').icon,
        title: () => getPlatformSettings('dbot').name,
        name: getPlatformSettings('dbot').name,
        description: () => localize('Binarytool DBOT.'),
        link_to: routes.bot,
    },
    {
        icon: getPlatformSettings('smarttrader').icon,
        title: () => getPlatformSettings('smarttrader').name,
        name: getPlatformSettings('smarttrader').name,
        description: () => localize('Binarytool Blocks'),
        href: 'https://block.binarytool.site', 
    }
];

export default platform_config;
