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
        icon: 'IcRebrandingBinarytoolsLogo',
        title: () => getPlatformSettings('trader').name,
        name: 'BT Trader',
        description: () => localize('MrDuke D-Trader.'),
        link_to: routes.trade,
    },
    {
        icon: 'IcRebrandingDerivBot',
        title: () => getPlatformSettings('dbot').name,
        name: getPlatformSettings('dbot').name,
        description: () => localize('MrDuke DBOT.'),
        link_to: routes.bot,
    },
    {
        icon: 'IcRebrandingBinaryBot',
        title: () => getPlatformSettings('smarttrader').name,
        name: getPlatformSettings('smarttrader').name,
        description: () => localize('MrDuke Blocks'),
        href: 'https://block.binarytool.site', 
    }
];

export default platform_config;