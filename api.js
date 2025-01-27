const API_BASE_URL = `http://vibin-env.eba-cqjrsm82.ap-south-1.elasticbeanstalk.com`;

// Fetch chat messages for a match
export const fetchMessagesAPI = async (matchId, limit = 20) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/chat/messages?matchId=${matchId}&limit=${limit}`
    );
    const data = await response.json();

    if (response.ok && data.messages) {
      return data.messages;
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
    console.log('Sending message to backend:', message);
    const response = await fetch(`${API_BASE_URL}/api/chat/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      const data = await response.json();
      console.error('Backend response error:', data);
      throw new Error(data.message || 'Failed to send message');
    }

    console.log('Message successfully sent to backend');
  } catch (error) {
    console.error('Error in sendMessageAPI:', error.message);
    throw error;
  }
};

export const actionPingAPI = async (userId, targetUserId, action) => {
  // Build the request body dynamically
  const requestBody = {
    userId,
    targetUserId,
    action,
  };
  const response = await fetch(`${API_BASE_URL}/api/match/pingAction`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });
  console.log('response is ', response);
  if (!response) {
    const errorDetails = await response.json();
    console.error('Response Error:', response);
    throw new Error(
      errorDetails?.message || 'Failed to send ping action to backend'
    );
  }

  return await response.json();
};

// Existing APIs
export const fetchMatchesForProfileAPI = async (emailId, gender) => {
  const queryParams = new URLSearchParams({ emailId, gender }).toString();
  console.log('emailId, gender', emailId, gender);
  try {
    const response = await fetch(`${API_BASE_URL}/api/match?${queryParams}`);
    const data = await response.json();
    // console.log(data)
    if (response.ok && data.matches) {
      // Fetch signed read URLs for photos only if photos exist and are not empty
      const updatedMatches = await Promise.all(
        data.matches.map(async (match) => {
          if (
            match.photos &&
            Array.isArray(match.photos) &&
            match.photos.length > 0
          ) {
            const signedUrls = await Promise.allSettled(
              match.photos.map((key) => getPresignedReadUrlAPI(key))
            );

            // Filter fulfilled promises and ignore failed ones
            const filteredUrls = signedUrls
              .filter((result) => result.status === 'fulfilled')
              .map((result) => result.value);

            return { ...match, photos: filteredUrls }; // Replace keys with valid URLs
          }
          // Return match as-is if photos is empty or invalid
          return match;
        })
      );

      return updatedMatches;
    } else {
      throw new Error(data.message || 'Failed to fetch profiles');
    }
  } catch (error) {
    console.error('Error in fetchMatchesForProfileAPI:', error.message);
    throw error;
  }
};

export const sendActionToBackendAPI = async (
  userId,
  targetUserId,
  action,
  pingNote = null
) => {
  console.log(
    'userId, targetUserId, action, pingNote',
    userId,
    targetUserId,
    action,
    pingNote
  );

  // Build the request body dynamically
  const requestBody = {
    userId,
    targetUserId,
    action,
  };

  if (action === 'pinged' && pingNote) {
    requestBody.pingNote = pingNote; // Include pingNote only if the action is 'pinged'
  }

  const response = await fetch(`${API_BASE_URL}/api/match/action`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });
  console.log(response);
  if (!response.ok) {
    console.log('!response.ok', !response.ok, response);
    const errorDetails = await response.json();
    console.error('Response Error:', response);
    throw new Error(
      errorDetails?.message || 'Failed to send action to backend'
    );
  }

  return await response.json();
};

export const fetchCurrentMatchesAPI = async (emailId) => {
  console.log('fetchCurrentMatchesAPI', emailId);

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/match/currentMatches?emailId=${emailId}`
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch current matches');
    }

    const data = await response.json();

    if (data.matches) {
      console.log('log is ', data.matches);

      // Iterate over each match and update the photo with a pre-signed URL
      const matchesWithSignedPhotos = await Promise.all(
        data.matches.map(async (match) => {
          if (match.photos) {
            try {
              // Fetch the pre-signed URL for the single photo
              const presignedUrl = await getPresignedReadUrlAPI(match.photos);

              return {
                matchId: match?.matchId,
                userId: match?.userId,
                name: match?.name,
                photo: presignedUrl || null, // Replace the key with the signed URL
                lastMessage: match?.lastMessage,
                isUnread: match?.isUnread,
                senderId: match?.senderId,
              };
            } catch (error) {
              console.error(
                `Error fetching pre-signed URL for photo: ${match.photos}`,
                error.message
              );

              // Return the match with the original photo key in case of an error
              return {
                matchId: match?.matchId,
                userId: match?.userId,
                name: match?.name,
                photo: match?.photos || null,
                lastMessage: match?.lastMessage,
                isUnread: match?.isUnread,
                senderId: match?.senderId,
              };
            }
          }

          // If no photo is available, return the match as-is
          return {
            matchId: match?.matchId,
            userId: match?.userId,
            name: match?.name,
            photo: null,
            lastMessage: match?.lastMessage,
            isUnread: match?.isUnread,
            senderId: match?.senderId,
          };
        })
      );

      return matchesWithSignedPhotos;
    } else {
      throw new Error('No matches data available');
    }
  } catch (error) {
    console.error('Error fetching current matches:', error.message);
    throw error;
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
    console.log('Data received:', data);

    if (data?.pings) {
      // Iterate over each ping and update the photo with a pre-signed URL if available
      const pingsWithPresignedUrls = await Promise.all(
        data.pings.map(async (ping) => {
          if (ping?.photo) {
            try {
              const presignedUrl = await getPresignedReadUrlAPI(ping.photo);
              return {
                ...ping,
                photo: presignedUrl, // Replace the photo with the pre-signed URL
              };
            } catch (error) {
              console.error(
                `Error fetching pre-signed URL for photo: ${ping.photo}`,
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
    } else {
      throw new Error('No pings data available');
    }
  } catch (error) {
    console.error('Error fetching pings:', error.message);
    throw error;
  }
};

export const fetchNewLikesAPI = async (emailId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/match/newLikes?emailId=${emailId}`
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch new likes');
    }

    const data = await response.json();

    if (data.likes) {
      // Iterate over each profile and update the photos with pre-signed URLs
      const likesWithPresignedUrls = await Promise.all(
        data.likes.map(async (profile) => {
          if (profile.photos && profile.photos.length > 0) {
            const updatedPhotos = await Promise.all(
              profile.photos.map(async (photoKey) => {
                try {
                  const presignedUrl = await getPresignedReadUrlAPI(photoKey);
                  return presignedUrl; // Replace the key with the URL
                } catch (error) {
                  console.error(
                    `Error fetching pre-signed URL for photo: ${photoKey}`,
                    error.message
                  );
                  return photoKey; // Return the original key in case of an error
                }
              })
            );

            return {
              ...profile,
              photos: updatedPhotos, // Replace photos with updated URLs
            };
          }

          return profile; // Return the profile as-is if no photos
        })
      );

      return likesWithPresignedUrls;
    } else {
      throw new Error('No likes data available');
    }
  } catch (error) {
    console.error('Error fetching new likes:', error.message);
    throw error;
  }
};

export const fetchUserProfileUsingEmailAPI = async (email) => {
  const response = await fetch(`${API_BASE_URL}/api/profiles/email/${email}`);
  if (response.status === 200) {
    return await response.json();
  } else if (response.status === 404) {
    throw new Error('Profile not found');
  } else {
    throw new Error(`Unexpected response: ${response.status}`);
  }
};

export const createUserProfileAPI = async (profileData) => {
  const response = await fetch(`${API_BASE_URL}/api/profiles`, {
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
  const response = await fetch(`${API_BASE_URL}/api/profiles/${userId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete profile');
  }
};

export const markMessagesReadAPI = async (matchId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/chat/messages/mark-as-read`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ matchId }), // Ensure matchId is passed here
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

export const likeMessageAPI = async (matchId, createdAt, messageId, liked) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/chat/messages/like`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ matchId, createdAt, messageId, liked }),
    });

    if (!response.ok) {
      throw new Error('Failed to like message');
    }

    // Parse and return the response data
    const responseData = await response.json();
    return responseData.data; // Assuming the "data" field contains the updated message
  } catch (error) {
    console.error('Error in likeMessageAPI:', error);
    throw error;
  }
};

/**
 * Generate a pre-signed URL for uploading an image to S3.
 */
export const generatePresignedUrlAPI = async (fileName, fileType) => {
  try {
    const response = await fetch(`${API_BASE_URL}/generate-presigned-url`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fileName, fileType }),
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

/**
 * Upload an image to S3 using the pre-signed URL.
 */
export const uploadImageToS3API = async (uploadUrl, imageUri) => {
  try {
    const file = await fetch(imageUri);
    const fileBlob = await file.blob();

    const response = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': fileBlob.type,
      },
      body: fileBlob,
    });

    if (!response.ok) {
      throw new Error('Failed to upload image to S3');
    }

    return true; // Upload successful
  } catch (error) {
    console.error('Error in uploadImageToS3API:', error.message);
    throw error;
  }
};

/**
 * Fetch pre-signed URL for reading an image from S3.
 */
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
    const response = await fetch(`${API_BASE_URL}/api/profiles/${userId}`, {
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
