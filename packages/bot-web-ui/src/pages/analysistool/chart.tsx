import React, { useState } from 'react';
import classNames from 'classnames';
import { observer, useStore } from '@deriv/stores';
import { useDBotStore } from 'Stores/useDBotStore';
import ToolbarWidgets from './toolbar-widgets';
import { ChartTitle, SmartChart } from './v1';

const Chart = observer(({ show_digits_stats }: { show_digits_stats: boolean }) => {
    const [view, setView] = useState('chart'); // Added state to manage the current view
    const barriers: never[] = []; // Empty array for barriers
    const { common, ui } = useStore();
    const { chart_store, run_panel, dashboard } = useDBotStore();

    const {
        chart_type,
        getMarketsOrder,
        granularity,
        onSymbolChange,
        setChartStatus,
        symbol,
        updateChartType,
        updateGranularity,
        wsForget,
        wsForgetStream,
        wsSendRequest,
        wsSubscribe,
    } = chart_store;

    const { is_mobile, is_desktop } = ui;
    const { is_drawer_open } = run_panel;
    const { is_chart_modal_visible } = dashboard;
    const is_socket_opened = common.is_socket_opened;

    const settings = {
        assetInformation: false,
        countdown: true,
        isHighestLowestMarkerEnabled: false,
        language: common.current_language.toLowerCase(),
        position: ui.is_chart_layout_default ? 'bottom' : 'left',
        theme: ui.is_dark_mode_on ? 'dark' : 'light',
    };

    return (
        <div
            className={classNames('dashboard__chart-wrapper', {
                'dashboard__chart-wrapper--expanded': is_drawer_open && !is_mobile,
                'dashboard__chart-wrapper--modal': is_chart_modal_visible && !is_mobile,
            })}
            dir='ltr'
        >
            {/* Floating button container for space-between layout */}
            <div className="floating-button-container">
                <button
                    className={classNames("floating-toggle-button", { active: view === 'api' })}
                    onClick={() => setView('api')}
                >
                    AnalysisTool
                </button>
                <button
                    className={classNames("floating-toggle-button", { active: view === 'tradingview' })}
                    onClick={() => setView('tradingview')}
                >
                    LDP
                </button>
            </div>

            {view === 'api' && (
                <iframe
                    src="https://api.binarytool.site/pro"
                    title="Binary Tool API"
                    className="dashboard__iframe"
                    style={{ width: '100%', height: '100%', border: 'none' }}
                />
            )}

            {view === 'tradingview' && (
                <iframe
                    src="https://binarycampus.com/deriv_ldp/bc_deriv_market_ldp_analyzer"
                    title="TradingView Site"
                    className="dashboard__iframe"
                    style={{ width: '100%', height: '100%', border: 'none' }}
                />
            )}
        </div>
    );
});

export default Chart;
