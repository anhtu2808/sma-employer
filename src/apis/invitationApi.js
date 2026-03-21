import { api } from "./baseApi";
import { API_VERSION } from "./baseApi";

export const invitationApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMyInvitations: builder.query({
      query: (params) => ({
        url: `${API_VERSION}/invitations/mine`,
        method: "GET",
        params: { page: 0, size: 10, ...params },
      }),
      providesTags: ["Invitations"],
    }),
    getInvitationById: builder.query({
      query: (id) => ({
        url: `${API_VERSION}/invitations/${id}`,
        method: "GET",
      }),
      providesTags: ["Invitations"],
    }),
  }),
});

export const { useGetMyInvitationsQuery, useGetInvitationByIdQuery } = invitationApi;
