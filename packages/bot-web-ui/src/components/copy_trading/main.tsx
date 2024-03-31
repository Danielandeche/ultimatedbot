import React from 'react';
import { FaRegPlusSquare, FaTrash } from 'react-icons/fa';
import { observer, useStore } from '@deriv/stores';
import {
    api_base,
    removeCopyTradingTokens,
    updateCopyTradingTokens,
    newListTokens,
    reCallTheTokens,
    retrieveListItem,
    saveListItemToStorage,
    deleteItemFromStorage,
    config,
    retrieveCopyTradingTokens,
    getToken
} from '@deriv/bot-skeleton';
import { Dialog } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import './style.css';

const MainCopyTrader = observer(({ onClose }) => {
    const store = useStore();
    const {
        ui: { is_dark_mode_on },
    } = store;
    const [tokens, setTokens] = React.useState<string[]>([]);
    const [tokenInputValue, setTokenInputValue] = React.useState<string>('');
    const [animatingIds, setAnimatingIds] = React.useState<string[]>([]);
    const [tokenType, setTokenType] = React.useState('');
    const [shouldShowError, setShouldShowError] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState('');
    const [wasTokens, setWasTokens] = React.useState(false);
    const [enableCP, setEnableCP] = React.useState(false);
    const [syncing, setSyncing] = React.useState(false);

    React.useEffect(() => {
        getSavedTokens();
    }, []);
    React.useEffect(() => {
        getSavedTokens();
    }, [is_dark_mode_on]);

    const getSavedTokens = async () => {
        retrieveListItem().then(list_item => {
            const login_id = getToken().account_id!;
            if (login_id.includes('VRTC')) {
                setTokenType('Demo Tokens');
            } else if (login_id.includes('CR')) {
                setTokenType('Live Tokens');
            }

            if (list_item !== undefined && list_item !== null) {
                const cleanList = Array.isArray(list_item[0]) ? list_item[0] : list_item;
                if (cleanList.length > 0) {
                    setTokens(cleanList as string[]);
                    setWasTokens(true);
                } else {
                    setTokens([]);
                }
            } else {
                setTokens([]);
            }
        });
    };

    const handleTokenInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTokenInputValue(event.target.value);
    };

    const addToken = async () => {
        if(getToken().account_id){
            try {
                const newToken = tokenInputValue.trim();
                const response = await updateCopyTradingTokens(tokenInputValue.trim());
    
                if (response === 'VRTC' || response === 'CR') {
                    saveListItemToStorage(newToken);
                    tokens.unshift(newToken);
                } else {
                    setErrorMessage(response!);
                    setShouldShowError(true);
                }
            } catch (error: any) {
                if (typeof error.error !== 'undefined') {
                    setErrorMessage(error.error.message);
                    setShouldShowError(true);
                } else {
                    // console.log(error);
                }
            } finally {
                setTokenInputValue('');
            }
        } else {
            setErrorMessage(localize("It seems you haven't logged in, please login in and try adding the token again."));
            setShouldShowError(true);
        }
        
    };

    const deleteToken = (token: string) => {
        deleteItemFromStorage(token);
        removeCopyTradingTokens(token);
        setAnimatingIds((prevIds: any) => [...prevIds, token]);
    };

    const handleTransitionEnd = (check_token: string) => {
        setTokens(tokens.filter(token => token !== check_token));
        setAnimatingIds((prevIds: any) => prevIds.filter((i: any) => i !== check_token));
    };

    const handleShouldShowError = () => {
        setShouldShowError(false);
    };

    const handleCPChange = () => {
        setEnableCP(!enableCP);
        config.copy_trading.is_active = !enableCP;
    };

    const handleSynceData = async () => {
        setSyncing(true);
        const login_id = getToken().account_id!;
        const new_tokens = await reCallTheTokens();
        if (typeof new_tokens !== 'undefined') {
            setTokens(new_tokens);
        } else {
            setTokens([]);
        }

        if (login_id.includes('VRTC')) {
            setTokenType('Demo Tokens');
        } else if (login_id.includes('CR')) {
            setTokenType('Live Tokens');
        }
        setSyncing(false);
    };

    return (
        <div className='main_copy'>
            <button className='close-button' onClick={onClose}>Close</button>
            {shouldShowError && (
                <Dialog
                    title={localize('Error while adding new token!')}
                    confirm_button_text={localize('OK')}
                    onConfirm={handleShouldShowError}
                    is_visible={shouldShowError}
                >
                    {errorMessage}
                </Dialog>
            )}

            <header className={`title ${is_dark_mode_on && 'dark_active'}`}>
                <h1>{localize('Copy Trading List')}</h1>
            </header>
            <div className={`input_content ${is_dark_mode_on && 'dark_active'}`}>
                <div>
                    <input type='text' value={tokenInputValue} onChange={handleTokenInputChange} />
                    <button onClick={() => addToken()}>
                        <FaRegPlusSquare />
                    </button>
                </div>
                <div className='enable_sync'>
                    <div className='enable_disable'>
                        <input type='checkbox' checked={config.copy_trading.is_active} onChange={handleCPChange} />
                        <Localize i18n_default_text='Enable' />
                    </div>
                    <div className='sync_data'>
                        <button onClick={() => handleSynceData()}>{syncing ? 'Syncing...' : 'Sync Tokens'}</button>
                    </div>
                </div>
            </div>
            <div className='tokens-container'>
                <ul className='tokens-list'>
                    {tokens.length > 0 ? (
                        tokens.map((token) => (
                            <li
                                key={token}
                                className={`token ${animatingIds.includes(token) ? 'fall' : ''}`}
                                onTransitionEnd={() => handleTransitionEnd(token)}
                            >
                                <span className='token-item'>{token}</span>
                                <button className='trash-btn' onClick={() => deleteToken(token)}>
                                    <FaTrash />
                                </button>
                            </li>
                        ))
                    ) : (
                        <div className={`token_info ${is_dark_mode_on && 'dark_active'}`}>
                            {localize('No tokens available, add new tokens')}
                        </div>
                    )}
                </ul>
            </div>
        </div>
    );
});

export default MainCopyTrader;
