import { STRATEGIES } from 'src/pages/bot-builder/quick-strategy/config';

type TTabsTitle = {
    [key: string]: string | number;
};

type TDashboardTabIndex = {
    [key: string]: number;
};

export const tabs_title: TTabsTitle = Object.freeze({
    WORKSPACE: 'Workspace',
    CHART: 'Chart',
});

export const DBOT_TABS: TDashboardTabIndex = Object.freeze({
    DASHBOARD: 0,
    BOT_BUILDER: 1,
    BINARYTOOLS_BOTS: 2,
    ANALYSISTOOL: 3,
    LDP: 4,
    BINARYAI: 5,
    COPYTRADING: 6,
    CHART: 7,
    TRADINGVIEW: 8,
    TUTORIAL: 9,
});

export const MAX_STRATEGIES = 10;

export const TAB_IDS = [
    'dashboard',
    'bot_builder',
    'binarytools_bots',
    'analysistool',
    'ldp',
    'binaryai',
    'copytrading',
    'chart',
    'id-tradingview',
    'tutorial',
];

export const DEBOUNCE_INTERVAL_TIME = 500;
