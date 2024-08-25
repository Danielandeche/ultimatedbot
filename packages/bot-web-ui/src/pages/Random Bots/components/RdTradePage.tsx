import React from 'react';

interface RDTradeProps {
    showRdConfig: boolean;
    wonTrades: number;
    lostTrades: number;
    takeProfit: number;
    stopLoss: number;
    pnl: number;
    isTradeActive: boolean;
    isTradeActiveRef: React.MutableRefObject<boolean>;
    clearBotStats: () => void
    appendToConsole(text: string, color: string): void;
    setIsTradeActive: React.Dispatch<React.SetStateAction<boolean>>;
    setShowRdConfig: React.Dispatch<React.SetStateAction<boolean>>;
}
const RdTradePage = ({
    setShowRdConfig,
    showRdConfig,
    lostTrades,
    stopLoss,
    takeProfit,
    wonTrades,
    pnl,
    isTradeActive,
    isTradeActiveRef,
    clearBotStats,
    appendToConsole,
    setIsTradeActive,
}: RDTradeProps) => {

    function clearConsole() {
        const consoleDiv = document.querySelector('.rd-trade-page-console'); 
        consoleDiv!.innerHTML = ''; 
        clearBotStats();
    }
    return (
        <div className='rd-trade-page'>
            <div className='rd-trade-page-header'>
                <div className='win-loss'>
                    <p>W / L</p>
                    <p>
                        <span className='win'>{wonTrades}</span> / <span className='loss'>{lostTrades}</span>
                    </p>
                </div>
                <div className='tp-sl'>
                    <p>PnL</p>
                    <p>{pnl.toFixed(2)} USD</p>
                </div>
                <div className='tp-sl'>
                    <p>TP</p>
                    <p>{takeProfit} USD</p>
                </div>
                <div className='tp-sl'>
                    <p>SL</p>
                    <p className='loss'>{stopLoss} USD</p>
                </div>
            </div>
            <div className='rd-trade-page-buttons'>
                <button className='configure-button' onClick={() => setShowRdConfig(!showRdConfig)}>
                    Configure
                </button>
                <button className='configure-button' onClick={() => clearConsole()}>
                    Clear
                </button>
                <button
                    className={`${!isTradeActive ? 'start-button' : 'stop-button'}`}
                    onClick={() => {
                        setIsTradeActive(!isTradeActive);
                        isTradeActiveRef.current = !isTradeActive;
                        const status = !isTradeActive;
                        if (status) {
                            appendToConsole('Bot Started...', 'green');
                        } else {
                            appendToConsole('Bot Stopped', 'red');
                        }
                    }}
                >
                    {!isTradeActive ? 'Start' : 'Stop'}
                </button>
            </div>
            <div className='rd-trade-page-console'></div>
        </div>
    );
};

export default RdTradePage;
