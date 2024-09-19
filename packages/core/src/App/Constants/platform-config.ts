
import { getPlatformSettings, routes } from '@deriv/shared';
import { localize } from '@deriv/translations';

type TPlatformConfig = {
    description: () => string;
    href?: string;
    icon: string;
    link_to?: string;
};

const platform_config: TPlatformConfig[] = [
    {
        icon: 'IcRebrandingDerivTrader',
        description: () => localize('Ultimate D-Trader.'),
        link_to: routes.trade,
    },
    {
        icon: 'IcRebrandingDerivBot',
        description: () => localize('Ultimate DBOT.'),
        link_to: routes.bot,
    },
    {
        icon: 'IcRebrandingBinaryBot',
        description: () => localize('Ultimate Bot'),
        href: 'https://bot.ultimatedigits.ai/', 
    }
];

export default platform_config;

// import { getPlatformSettings, routes } from '@deriv/shared';
// import { localize } from '@deriv/translations';

// type TPlatformConfig = {
//     description: () => string;
//     href?: string;
//     icon: string;
//     link_to?: string;
//     name: string;
//     title: () => string;
// };

// const platform_config: TPlatformConfig[] = [
//     {
//         icon: 'IcRebrandingDerivTrader',
//         title: () => getPlatformSettings('trader').name,
//         name: getPlatformSettings('trader').name,
//         description: () => localize('Ultimate D-Trader.'),
//         link_to: routes.trade,
//     },
//     {
//         icon: 'IcRebrandingDerivBot',
//         title: () => getPlatformSettings('dbot').name,
//         name: getPlatformSettings('dbot').name,
//         description: () => localize('Ultimate DBOT.'),
//         link_to: routes.bot,
//     },
//     {
//         icon: 'IcRebrandingBinaryBot',
//         title: () => getPlatformSettings('smarttrader').name,
//         name: getPlatformSettings('smarttrader').name,
//         description: () => localize('Ultimate Bot'),
//         href: 'https://bot.ultimatedigits.ai/', 
//     }
// ];

// export default platform_config;