import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import Text from '../text/text';
import './styles.css';

export type TLoadingProps = React.HTMLProps<HTMLDivElement> & {
    is_fullscreen: boolean;
    is_slow_loading: boolean;
    status: string[];
    theme: string;
};

const Loading = ({ className, id, is_fullscreen = true, is_slow_loading, status, theme }: Partial<TLoadingProps>) => {
    const [speed, setSpeed] = useState<string>('Checking speed...');
    const theme_class = theme ? `barspinner-${theme}` : 'barspinner-light';

    // Function to check internet speed
    const checkInternetSpeed = (callback: (speed: number) => void) => {
        const image = new Image();
        const startTime = new Date().getTime();
        const imageUrl = 'https://example.com/large-image.jpg'; // Replace with a URL to a large file

        image.onload = () => {
            const endTime = new Date().getTime();
            const duration = (endTime - startTime) / 1000; // time in seconds
            const fileSize = 5000000; // Size of the file in bytes (replace with actual size)

            const speed = fileSize / duration / 1024 / 1024; // Speed in Mbps
            callback(speed);
        };

        image.onerror = () => {
            callback(0);
        };

        image.src = `${imageUrl}?cacheBuster=${new Date().getTime()}`;
    };

    // Update speed state on component mount
    useEffect(() => {
        checkInternetSpeed(speed => {
            const speedText = speed > 0 ? `${speed.toFixed(2)} Mbps` : 'Unable to determine speed';
            setSpeed(`Internet Speed: ${speedText}`);
        });
    }, []);

    return (
        <div
            data-testid='dt_initial_loader'
            className={classNames(
                'initial-loader',
                {
                    'initial-loader--fullscreen': is_fullscreen,
                },
                className
            )}
        >
            <div id={id} className={classNames('initial-loader__barspinner', 'barspinner', theme_class)}>
                <div className='container-loader'>
                    <div className='loader'>
                        Loading
                        <span />
                    </div>
                    <div className='text-loader'>app.binarytool.site/bot</div>
                    <div id='speed-indicator'>{speed}</div>
                </div>
            </div>
            {is_slow_loading &&
                status?.map((text, inx) => (
                    <Text as='h3' color='prominent' size='xs' align='center' key={inx}>
                        {text}
                    </Text>
                ))}
        </div>
    );
};

export default Loading;
