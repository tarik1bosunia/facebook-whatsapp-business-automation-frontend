import { SocialMediaUser } from "@/types/conversation";
import { apiSlice } from "./../api/apiSlice";
import type { Conversation, Message } from "@/types";

const CONVERSATION_URL = "messaging/conversations/";
const MESSAGES_URL = "messaging/messages/";
const SEND_MESSAGE_URL = "messaging/send-message/";

function getAutoReplyUrl(conversationId: string) {
  return `messaging/conversations/${conversationId}/auto-reply/`;
}

export interface ConversationAutoReplyType {
  id: string;
  auto_reply: boolean;
}

export const conversationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    
    getConversations: builder.query<Conversation[], void>({
      query: () => CONVERSATION_URL,
      providesTags: ["Conversation"],
    }),

    getMessages: builder.query<Message[], string>({
      query: (conversationId) =>
        `${MESSAGES_URL}?conversation=${conversationId}`,
      providesTags: ["Messages"],
    }),

    sendMessage: builder.mutation<
      { detail: string }, // Response type
      { conversation: number; message: string } // Request body type
    >({
      query: (body) => ({
        url: SEND_MESSAGE_URL,
        method: "POST",
        body,
      }),
    }),

    toggleAutoReply: builder.mutation<
      ConversationAutoReplyType,
      { id: string; auto_reply: boolean }
    >({
      query: ({ id, auto_reply }) => ({
        url: getAutoReplyUrl(id),
        method: "PATCH",
        body: { auto_reply },
      }),
      invalidatesTags: ["Conversation"],
    }),

    getUsersByPlatform: builder.query<
      SocialMediaUser[],
      {
        platform: string;
        search?: string;
        exclude_customers?: boolean;
      }
    >({
      query: (params) => {
        const { platform, ...queryParams } = params;
        const searchParams = new URLSearchParams();

        Object.entries(queryParams).forEach(([key, value]) => {
          if (value !== undefined) {
            searchParams.append(key, String(value));
          }
        });

        return {
          url: `messaging/social-media-users/by-platform/${platform}/?${searchParams.toString()}`,
          method: "GET",
        };
      },
    }),
  }),
});

export const {
  useGetConversationsQuery,
  useGetMessagesQuery,
  useSendMessageMutation,
  useToggleAutoReplyMutation,
  useGetUsersByPlatformQuery,
} = conversationApi;
