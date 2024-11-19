import React, { useState } from 'react';
import classNames from 'classnames';
import { observer, useStore } from '@deriv/stores';
import { useDBotStore } from 'Stores/useDBotStore';

const Chart = observer(() => {
    const [view, setView] = useState('tradingview'); // Added state to manage the current view
    const { ui } = useStore();
    const { run_panel, dashboard } = useDBotStore();


    const { is_mobile } = ui;
    const { is_drawer_open } = run_panel;
    const { is_chart_modal_visible } = dashboard;


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
