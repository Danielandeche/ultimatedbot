import React from 'react';

interface RDConfigProps {
    showRdConfig: boolean;
    takeProfit: number;
    stopLoss: number;
    stake: string | number;
    martingale: number;
    optionsList: any[];
    martingaleValueRef: React.MutableRefObject<number>;
    take_profit: React.MutableRefObject<number>;
    stop_loss: React.MutableRefObject<number>;
    handleSelectChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    setTakeProfit: React.Dispatch<React.SetStateAction<number>>;
    setStopLoss: React.Dispatch<React.SetStateAction<number>>;
    setShowRdConfig: React.Dispatch<React.SetStateAction<boolean>>;
    setStake: React.Dispatch<React.SetStateAction<number>>;
    setMartingale: React.Dispatch<React.SetStateAction<number>>;
}

const RdConfig = ({
    setShowRdConfig,
    showRdConfig,
    martingale,
    setMartingale,
    setStake,
    setStopLoss,
    setTakeProfit,
    handleSelectChange,
    martingaleValueRef,
    stop_loss,
    take_profit,
    optionsList,
    stake,
    stopLoss,
    takeProfit,
}: RDConfigProps) => {
    return (
        <div className='rd-config'>
            <div className='rd-config-header'>
                <button className='rd-close-button' onClick={() => setShowRdConfig(!showRdConfig)}>
                    &times;
                </button>
            </div>
            <form className='rd-config-form'>
                <div className='form-group'>
                    <select name='' id='symbol_options' onChange={handleSelectChange}>
                        {optionsList.length > 0 ? (
                            optionsList.map(option => (
                                <option key={option.symbol} value={option.symbol}>
                                    {option.display_name}
                                </option>
                            ))
                        ) : (
                            <option value=''>SELECT MARKET</option>
                        )}
                    </select>
                </div>
                <div className='form-group'>
                    <label>Stake Amount</label>
                    <input type='number' value={stake} onChange={e => setStake(Number(e.target.value))} />
                </div>
                <div className='form-group'>
                    <label>Martingale</label>
                    <input
                        type='number'
                        value={martingale}
                        onChange={e => {
                            martingaleValueRef.current = Number(e.target.value);
                            setMartingale(Number(e.target.value));
                        }}
                    />
                </div>
                <div className='form-group'>
                    <label>Take Profit (TP)</label>
                    <input
                        type='number'
                        value={takeProfit}
                        onChange={e => {
                            take_profit.current = Number(e.target.value);
                            setTakeProfit(Number(e.target.value));
                        }}
                    />
                </div>
                <div className='form-group'>
                    <label>Stop Loss (SL)</label>
                    <input
                        type='number'
                        value={stopLoss}
                        onChange={e => {
                            stop_loss.current = Number(e.target.value);
                            setStopLoss(Number(e.target.value));
                        }}
                    />
                </div>
            </form>
        </div>
    );
};

export default RdConfig;
