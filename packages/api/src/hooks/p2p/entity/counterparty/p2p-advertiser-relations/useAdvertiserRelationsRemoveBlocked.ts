import { useCallback } from 'react';
import useAdvertiserRelations from './useAdvertiserRelations';

/** This hook unblocks advertisers of the current user by passing the advertiser id. */
const useAdvertiserRelationsRemoveBlocked = () => {
    const { mutate, data, ...rest } = useAdvertiserRelations();

    return {};
};

export default useAdvertiserRelationsRemoveBlocked;
