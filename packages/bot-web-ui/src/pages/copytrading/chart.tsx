import React from 'react';
import classNames from 'classnames';
import { observer, useStore } from '@deriv/stores';
import { useDBotStore } from 'Stores/useDBotStore';
import ToolbarWidgets from './toolbar-widgets';
import { ChartTitle, SmartChart } from './v1';

const Chart = observer(({ show_digits_stats }: { show_digits_stats: boolean }) => {
    const barriers: [] = [];
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
    const {
        ui: { is_mobile, is_desktop },
    } = useStore();
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
        <div className='main_analysis'>
            <div className="dc-tabs__content dc-tabs__content--main__tabs">
                <div className="main_copy">
                    <header className="title false">
                        <h1>Add Copy Trading Tokens</h1>
                        <small>developed by D-Apollo</small>
                    </header>
                    <div className="input_content false">
                        <div>
                            <input type="text" value="" />
                            <button>
                                <svg
                                    stroke="currentColor"
                                    fill="currentColor"
                                    strokeWidth="0"
                                    viewBox="0 0 448 512"
                                    height="1em"
                                    width="1em"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M352 240v32c0 6.6-5.4 12-12 12h-88v88c0 6.6-5.4 12-12 12h-32c-6.6 0-12-5.4-12-12v-88h-88c-6.6 0-12-5.4-12-12v-32c0-6.6 5.4-12 12-12h88v-88c0-6.6 5.4-12 12-12h32c6.6 0 12 5.4 12 12v88h88c6.6 0 12 5.4 12 12zm96-160v352c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V80c0-26.5 21.5-48 48-48h352c26.5 0 48 21.5 48 48zm-48 346V86c0-3.3-2.7-6-6-6H54c-3.3 0-6 2.7-6 6v340c0 3.3 2.7 6 6 6h340c3.3 0 6-2.7 6-6z"></path>
                                </svg>
                            </button>
                        </div>
                        <div className="enable_sync">
                            <div className="enable_disable">
                                <input type="checkbox" />On/Off
                            </div>
                            <div className="sync_data">
                                <button>Sync Tokens</button>
                            </div>
                        </div>
                    </div>
                    <div className="tokens-container">
                        <ul className="tokens-list">
                            <div className="token_info false">No tokens available, add new tokens</div>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default Chart;
