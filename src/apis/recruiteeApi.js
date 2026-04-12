import { api, API_VERSION } from "./baseApi";

const RECRUITEE_URL = `${API_VERSION}/recruitee-config`;

export const recruiteeApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getRecruiteeConfig: builder.query({
            query: () => ({
                url: RECRUITEE_URL,
                method: "GET",
            }),
            providesTags: ["Webhooks"],
        }),

        saveRecruiteeConfig: builder.mutation({
            query: (body) => ({
                url: RECRUITEE_URL,
                method: "POST",
                body,
            }),
            invalidatesTags: ["Webhooks"],
        }),

        testConnection: builder.mutation({
            query: (body) => ({
                url: `${RECRUITEE_URL}/test-connection`,
                method: "POST",
                body,
            }),
        }),

        getRecruiteeOffers: builder.query({
            query: ({ apiToken, recruiteeCompanyId }) => ({
                url: `${RECRUITEE_URL}/offers`,
                method: "GET",
                params: { apiToken, recruiteeCompanyId },
            }),
            keepUnusedDataFor: 0,
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetRecruiteeConfigQuery,
    useSaveRecruiteeConfigMutation,
    useTestConnectionMutation,
    useLazyGetRecruiteeOffersQuery,
} = recruiteeApi;