import React from 'react';
import { MobileTabs } from '@/components';
import { useQueryString } from '@/hooks';
import { MyProfileAdDetails } from '../MyProfileAdDetails';
import { MyProfileContent } from '../MyProfileContent';
import { MyProfileCounterparties } from '../MyProfileCounterparties';
import MyProfileStatsMobile from '../MyProfileStats/MyProfileStatsMobile';
import { PaymentMethods } from '../PaymentMethods';

const MyProfileMobile = () => {
    const { queryString, setQueryString } = useQueryString();
    const currentTab = queryString.get('tab');

    if (currentTab === 'Stats') {
        return <MyProfileStatsMobile />;
    }
    if (currentTab === 'Ad details') {
        return <MyProfileAdDetails />;
    }
    if (currentTab === 'My counterparties') {
        return <MyProfileCounterparties />;
    }
    if (currentTab === 'Payment methods') {
        return <PaymentMethods />;
    }

    return (
        <>
            <MyProfileContent />
            <MobileTabs
                onChangeTab={clickedTab =>
                    setQueryString({
                        tab: clickedTab,
                    })
                }
                tabs={['Stats', 'Payment methods', 'Ad details', 'My counterparties']}
            />
        </>
    );
};

export default MyProfileMobile;
