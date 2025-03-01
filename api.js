const API_BASE_URL = `https://api.vibinconnect.com`;
import { LIKE_ACTION, DISLIKE_ACTION } from './constants/actionConstants'; // ✅ Import constants

// Fetch chat messages for a match
export const fetchMessagesAPI = async (matchId, limit = 20) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/chat/messages?matchId=${matchId}&limit=${limit}`
    );
    const data = await response.json();
    const S3_BUCKET_URL = `${API_BASE_URL}/`;

    if (response.ok && data) {
      return data.map((msg) => ({
        ...msg,
        imageUrl: msg.imageUrl ? `${msg.imageUrl}` : null, // Convert relative to full URL
      }));
    } else {
      throw new Error(data.message || 'Failed to fetch messages');
    }
  } catch (error) {
    console.error('Error in fetchMessagesAPI:', error.message);
    throw error;
  }
};
export const sendMessageAPI = async (message) => {
  try {
    console.log('📤 Sending message to backend:', message);

    const response = await fetch(`${API_BASE_URL}/api/chat/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      const data = await response.json();
      console.error('❌ Backend response error:', data);
      throw new Error(data.message || 'Failed to send message');
    }

    console.log('✅ Message successfully stored in backend');
  } catch (error) {
    console.error('❌ Error in sendMessageAPI:', error.message);
    throw error;
  }
};

export const fetchMatchesForProfileAPI = async (userhandle, gender) => {
  console.log('🔍 Fetching matches for:', userhandle, gender);

  try {
    const response = await fetch(`${API_BASE_URL}/api/profile/suggestions`, {
      method: 'POST', // ✅ Changed to POST (recommended for structured filtering)
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userhandle, gender }), // ✅ Sending structured data in the body
    });

    // ✅ Ensure response is OK before parsing JSON
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ Matched profiles:', data);

    // ✅ Ensure data is an array before processing
    if (!Array.isArray(data)) {
      throw new Error('Invalid response format: Expected an array');
    }

    // ✅ Fetch signed read URLs for photos if they exist
    const updatedMatches = await Promise.all(
      data.map(async (match) => {
        if (match.photos?.length) {
          const signedUrls = await Promise.allSettled(
            match.photos.map((key) => getPresignedReadUrlAPI(key))
          );

          // ✅ Log errors if some URLs fail to fetch
          signedUrls.forEach((result, index) => {
            if (result.status === 'rejected') {
              console.warn(
                `⚠️ Failed to fetch signed URL for ${match.photos[index]}:`,
                result.reason
              );
            }
          });

          // ✅ Keep only successful signed URLs
          const filteredUrls = signedUrls
            .filter((result) => result.status === 'fulfilled')
            .map((result) => result.value);

          return { ...match, photos: filteredUrls };
        }
        return match;
      })
    );

    console.log('✅ Processed matches:', updatedMatches);
    return updatedMatches;
  } catch (error) {
    console.error('❌ Error in fetchMatchesForProfileAPI:', error.message);
    return []; // ✅ Return empty array instead of throwing error
  }
};
export const actionPingAPI = async (endpoint, payload) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    console.log(`API response status (${endpoint}):`, response.status);

    if (!response.ok) {
      const errorText = await response.text(); // Read response as text to handle non-JSON errors
      console.error(`API Error (${endpoint}):`, errorText);
      throw new Error(errorText || `Failed to process ping action`);
    }

    return await response.json(); // Parse only if the response is valid JSON
  } catch (error) {
    console.error(`Error in actionPingAPI (${endpoint}):`, error.message);
    throw error;
  }
};
// ✅ Handles "like", "dislike", and "approve/reject" actions
export const sendActionToBackendAPI = async (
  senderHandle,
  receiverHandle,
  action // "like", "dislike", "approve", "reject"
) => {
  console.log(
    '📌 Sending interaction action:',
    action,
    'Sender:',
    senderHandle,
    'Receiver:',
    receiverHandle
  );

  // Determine the interaction type based on action
  let interactionType;

  interactionType = 'like'; // like or dislike

  // Construct request body
  const requestBody = {
    senderHandle,
    receiverHandle,
    interactionType, // like, dislike
    action, // like, dislike, approve, reject
  };
  console.log('✅ Request Body Prepared:', requestBody); // Add this log

  return callBackendAPI(requestBody);
};
// ✅ Common function to handle API calls
const callBackendAPI = async (requestBody) => {
  console.log('📡 Preparing API call...', requestBody);

  try {
    const response = await fetch(`${API_BASE_URL}/api/interactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    console.log('📌 API Response:', response.status, response.statusText);

    if (!response.ok) {
      const errorDetails = await response.json();
      console.error('🚨 Response Error:', errorDetails);
      throw new Error(
        errorDetails?.error || 'Failed to send interaction to backend'
      );
    }

    return await response.json();
  } catch (error) {
    console.error('❌ API Error:', error);
    throw error;
  }
};

// ✅ Handles "ping" interactions
export const sendPingToBackendAPI = async (
  senderHandle,
  receiverHandle,
  message
) => {
  console.log('📩 Sending ping:', { senderHandle, receiverHandle, message });

  // Construct request body
  const requestBody = {
    senderHandle,
    receiverHandle,
    interactionType: 'ping', // ✅ Always "ping"
    action: 'ping', // ✅ Indicates ping action
    message, // ✅ Optional custom message
  };

  return callBackendAPI(requestBody);
};
export const fetchConnectionsAPI = async (userHandle) => {
  try {
    console.log(`🔍 Fetching mutual matches for userHandle: ${userHandle}`);

    const response = await fetch(
      `${API_BASE_URL}/api/interactions/matches?userHandle=${userHandle}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch mutual matches');
    }

    const data = await response.json();
    console.log('✅ Data from fetchMutualMatches:', data);

    // 🛠 Ensure matches is an array (handles null gracefully)
    const matches = Array.isArray(data.matches) ? data.matches : [];

    // Fetch presigned URLs for profile photos (only if photo is present)
    const updatedMatches = await Promise.all(
      matches.map(async (match) => {
        if (
          match.photo &&
          typeof match.photo === 'string' &&
          match.photo.trim() !== ''
        ) {
          try {
            const presignedUrl = await getPresignedReadUrlAPI(match.photo);
            return {
              ...match,
              photo: presignedUrl, // ✅ Replace the photo key with the presigned URL
            };
          } catch (error) {
            console.error(
              '⚠️ Error fetching presigned URL for match photo:',
              error.message
            );
            return match; // Return the match as is if the presigned URL fetch fails
          }
        }

        return match; // Return the match as is if no photo exists
      })
    );

    console.log('✅ Matches with presigned photo URLs:', updatedMatches);

    // ✅ Process matches safely
    return updatedMatches.map((match) => ({
      userHandle: match.userHandle, // Default handle
      name: match.name, // Default name
      photo: match.photo || 'default-avatar.png', // Use presigned URL or default
      matchId: match.matchId,
      lastMessage: match.lastMessage,
      lastMessageSender: match.lastMessageSender,
      lastMessageIsRead: match.lastMessageIsRead,
    }));
  } catch (error) {
    console.error('❌ Error fetching mutual matches:', error.message);
    return []; // ✅ Return an empty array instead of crashing
  }
};

export const fetchPingsAPI = async (emailId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/match/pings?emailId=${emailId}`
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch pings');
    }

    const data = await response.json();
    console.log('Data received from fetchPingsAPI:', data);

    // Handle case where `pings` is null, undefined, or not an array
    if (!data?.pings || !Array.isArray(data.pings)) {
      console.warn(`No pings data found for emailId: ${emailId}`);
      return []; // Return an empty array instead of throwing an error
    }

    // Iterate over each ping and update the photo with a pre-signed URL if available
    const pingsWithPresignedUrls = await Promise.all(
      data.pings.map(async (ping) => {
        if (ping?.senderPhoto) {
          try {
            const presignedUrl = await getPresignedReadUrlAPI(
              ping.senderPhoto[0]
            );
            console.log('presignedUrl', presignedUrl);
            return {
              ...ping,
              senderPhoto: presignedUrl, // Replace the photo with the pre-signed URL
            };
          } catch (error) {
            console.error(
              `Error fetching pre-signed URL for photo for fetchPingsAPI: ${ping.senderPhoto}`,
              error.message
            );
            // Return the ping with the original photo if fetching pre-signed URL fails
            return ping;
          }
        }
        return ping; // Return the ping as-is if no photo is available
      })
    );

    return pingsWithPresignedUrls;
  } catch (error) {
    console.error('Error fetching pings:', error.message);
    return []; // Return an empty array instead of throwing an error
  }
};
export const fetchInteractionsForUserHandle = async (userHandle) => {
  try {
    console.log(`🔍 Fetching interactions for userHandle: ${userHandle}`);

    const response = await fetch(
      `${API_BASE_URL}/api/interactions/received?userHandle=${userHandle}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch interactions');
    }

    const data = await response.json();
    console.log('✅ Data from fetchInteractionsForUserHandle:', data);

    // ✅ Extract interactions from data, ensuring it's always an array
    const interactions = Array.isArray(data.interactions)
      ? data.interactions
      : [];

    if (interactions.length === 0) {
      console.warn(`⚠️ No interactions found for userHandle: ${userHandle}`);
      return [];
    }

    // ✅ Process interactions and update photo URLs
    const processedInteractions = await Promise.all(
      interactions.map(async (interaction) => {
        let updatedPhotos = [];

        if (interaction.photos && Array.isArray(interaction.photos)) {
          updatedPhotos = await Promise.all(
            interaction.photos.map(async (photoKey) => {
              try {
                const presignedUrl = await getPresignedReadUrlAPI(photoKey);
                return presignedUrl; // ✅ Replace the key with the URL
              } catch (error) {
                console.error(
                  `⚠️ Error fetching pre-signed URL for photo: ${photoKey}`,
                  error.message
                );
                return photoKey; // ✅ Return the original key in case of an error
              }
            })
          );
        }

        return {
          ...interaction,
          photos: updatedPhotos, // ✅ Attach updated photos
          isMatch: interaction.status === 'match', // ✅ Mark mutual matches
        };
      })
    );

    return processedInteractions;
  } catch (error) {
    console.error('❌ Error fetching interactions:', error.message);
    return []; // ✅ Return an empty array instead of crashing
  }
};

export const fetchMatchesForUserHandle = async (userHandle) => {
  try {
    console.log(`🔍 Fetching matches for userHandle: ${userHandle}`);

    const response = await fetch(`${API_BASE_URL}/api/match/get`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userHandle }), // ✅ Send userHandle in request body
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch matches');
    }

    const data = await response.json();
    console.log('✅ Data from fetchMatchesForUserHandle:', data);

    // ✅ Ensure data is always an array (default to empty array if null)
    if (!Array.isArray(data)) {
      console.warn(`⚠️ No matches found for userHandle: ${userHandle}`);
      return []; // ✅ Return an empty array instead of crashing
    }

    // ✅ Process matches and update photo URLs if they exist
    const matchesWithPresignedUrls = await Promise.all(
      data.map(async (match) => {
        if (
          match.photos &&
          Array.isArray(match.photos) &&
          match.photos.length > 0
        ) {
          const updatedPhotos = await Promise.all(
            match.photos.map(async (photoKey) => {
              try {
                const presignedUrl = await getPresignedReadUrlAPI(photoKey);
                return presignedUrl; // ✅ Replace the key with the URL
              } catch (error) {
                console.error(
                  `⚠️ Error fetching pre-signed URL for photo: ${photoKey}`,
                  error.message
                );
                return photoKey; // ✅ Return the original key in case of an error
              }
            })
          );

          return {
            ...match,
            photos: updatedPhotos, // ✅ Replace photos with updated URLs
          };
        }

        return match; // ✅ Return the match as-is if no photos
      })
    );

    return matchesWithPresignedUrls;
  } catch (error) {
    console.error('❌ Error fetching matches:', error.message);
    return []; // ✅ Return an empty array instead of crashing
  }
};

export const checkUserHandleAPI = async (userhandle) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/profile/check-userhandle?userhandle=${encodeURIComponent(userhandle)}`,
      {
        method: 'GET', // ✅ GET method (correct)
        headers: { 'Content-Type': 'application/json' },
      }
    );

    // Handle 409 Conflict (Userhandle is taken)
    if (response.status === 409) {
      return { available: false }; // ❌ Userhandle is already taken
    }

    // Handle 200 OK response
    if (response.ok) {
      const data = await response.json();
      return { available: data.available }; // ✅ Userhandle is available
    }

    // Fallback for unexpected errors
    console.error('Unexpected response:', response);
    return { available: false, error: 'Unexpected response from server' };
  } catch (error) {
    console.error('❌ API error while checking user handle:', error);
    return { available: false, error: 'Network or server error' }; // Assume taken on failure
  }
};

export const fetchUserProfileUsingEmailAPI = async (
  email,
  targetEmail = null
) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/profile/by-email`, {
      method: 'POST', // Use POST to send JSON body
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        emailId: email,
        ...(targetEmail && { targetEmailId: targetEmail }), // Only include targetEmailId if it's provided
      }),
    });

    if (response.ok) {
      return await response.json();
    } else if (response.status === 404) {
      return undefined;
    } else {
      throw new Error(`Unexpected response: ${response.status}`);
    }
  } catch (error) {
    console.error('Error fetching user profile:', error.message);
    throw error;
  }
};

export const createUserProfileAPI = async (profileData) => {
  const response = await fetch(`${API_BASE_URL}/api/profile`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profileData),
  });

  if (response.ok) {
    return await response.json();
  } else {
    throw new Error('Failed to create profile');
  }
};

export const deleteUserProfileAPI = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/api/profile/${userId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete profile');
  }
};

export const markMessagesReadAPI = async (matchId, userHandle) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/chat/messages/mark-as-read`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ matchId, userHandle }), // Ensure matchId is passed here
      }
    );

    if (!response.ok) {
      console.error('Response status:', response.status);
      const errorResponse = await response.json();
      throw new Error(
        errorResponse.error || `HTTP error! status: ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error('Error in markMessagesReadAPI:', error.message);
    throw error;
  }
};

export const likeMessageAPI = async (matchId, createdAt, liked) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/chat/messages/like`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ matchId, createdAt, liked }), // ✅ Send `createdAt`
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(errorResponse.error || 'Failed to update like status');
    }

    return await response.json();
  } catch (error) {
    console.error('❌ Error in likeMessageAPI:', error.message);
    throw error;
  }
};

export const generatePresignedUrlAPI = async (fileName, fileType, path) => {
  console.log('generatePresignedUrlAPI', fileName, fileType, path);
  try {
    const response = await fetch(`${API_BASE_URL}/generate-presigned-url`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileName, fileType, path }), // Pass the path parameter
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to generate pre-signed URL');
    }

    return await response.json(); // Returns { url, fileName }
  } catch (error) {
    console.error('Error in generatePresignedUrlAPI:', error.message);
    throw error;
  }
};

export const uploadImageToS3API = async (uploadUrl, imageUri, path) => {
  try {
    console.log(`Uploading image to S3: ${imageUri} with path: ${path}`);

    // 1️⃣ Fetch the image as a blob
    const response = await fetch(imageUri);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    const fileBlob = await response.blob();

    // 2️⃣ Ensure Content-Type is correct
    const fileType = fileBlob.type || 'image/jpeg'; // Default to JPEG if missing

    // 3️⃣ Upload to S3
    const uploadResponse = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': fileType,
      },
      body: fileBlob,
    });

    if (!uploadResponse.ok) {
      throw new Error(
        `S3 Upload Failed: ${uploadResponse.status} ${uploadResponse.statusText}`
      );
    }

    console.log('✅ Image successfully uploaded to S3.');
    return true; // Upload successful
  } catch (error) {
    console.error('❌ Error in uploadImageToS3API:', error.message);
    throw error;
  }
};

export const getPresignedReadUrlAPI = async (key) => {
  try {
    const response = await fetch(`${API_BASE_URL}/get-presigned-read-url`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ key }), // Pass only the key
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch pre-signed URL');
    }

    const { url } = await response.json();
    return url;
  } catch (error) {
    console.error('Error fetching pre-signed URL:', error.message);
    throw error;
  }
};

export const updateUserProfileAPI = async (userId, profileData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/profile/${userId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update user profile');
    }

    return await response.json(); // Return the updated profile data
  } catch (error) {
    console.error('Error in updateUserProfileAPI:', error.message);
    throw error;
  }
};
