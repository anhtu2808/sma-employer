import { api, API_VERSION } from "./baseApi";

export const companyApiKeyApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getCompanyApiKeys: builder.query({
            query: () => ({
                url: `${API_VERSION}/company-api-keys`,
                method: "GET",
            }),
            providesTags: (result) => {
                const items = Array.isArray(result?.data) ? result.data : [];
                return [
                    { type: "CompanyApiKeys", id: "LIST" },
                    ...items.map((item) => ({ type: "CompanyApiKeys", id: item.id })),
                ];
            },
        }),
        getCompanyApiKey: builder.query({
            query: (id) => ({
                url: `${API_VERSION}/company-api-keys/${id}`,
                method: "GET",
            }),
            providesTags: (_, __, id) => [{ type: "CompanyApiKeys", id }],
        }),
        createCompanyApiKey: builder.mutation({
            query: (data) => ({
                url: `${API_VERSION}/company-api-keys`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: [{ type: "CompanyApiKeys", id: "LIST" }],
        }),
        updateCompanyApiKey: builder.mutation({
            query: ({ id, data }) => ({
                url: `${API_VERSION}/company-api-keys/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (_, __, { id }) => [
                { type: "CompanyApiKeys", id },
                { type: "CompanyApiKeys", id: "LIST" },
            ],
        }),
        deleteCompanyApiKey: builder.mutation({
            query: (id) => ({
                url: `${API_VERSION}/company-api-keys/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: (_, __, id) => [
                { type: "CompanyApiKeys", id },
                { type: "CompanyApiKeys", id: "LIST" },
            ],
        }),
    }),
});

export const {
    useGetCompanyApiKeysQuery,
    useGetCompanyApiKeyQuery,
    useCreateCompanyApiKeyMutation,
    useUpdateCompanyApiKeyMutation,
    useDeleteCompanyApiKeyMutation,
} = companyApiKeyApi;
