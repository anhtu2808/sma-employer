import { api } from "./baseApi";
import { API_VERSION } from "./baseApi";

export const masterDataApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getExpertise: builder.query({
      query: ({ page = 0, size = 30 } = {}) => ({
        url: `${API_VERSION}/expertises`,
        method: "GET",
        params: {
          page,
          size,
        },
      }),
      transformResponse: (response) => response?.data?.content ?? [],
    }),
    getDomain: builder.query({
      query: ({ page = 0, size = 30 } = {}) => ({
        url: `${API_VERSION}/domains`,
        method: "GET",
        params: {
          page,
          size,
        },
      }),
      transformResponse: (response) => response?.data?.content ?? [],
    }),
    getBenefit: builder.query({
      query: ({ page = 0, size = 30 } = {}) => ({
        url: `${API_VERSION}/benefits`,
        method: "GET",
        params: {
          page,
          size,
        },
      }),
      transformResponse: (response) => {
        if (Array.isArray(response?.data)) return response.data;
        return response?.data?.content ?? [];
      },
      providesTags: ["Benefit"],
    }),
    createBenefit: builder.mutation({
      query: (data) => ({
        url: `${API_VERSION}/benefits`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Benefit"],
    }),
    updateBenefit: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `${API_VERSION}/benefits/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Benefit"],
    }),
    deleteBenefit: builder.mutation({
      query: (id) => ({
        url: `${API_VERSION}/benefits/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Benefit"],
    }),
  }),
});

export const { 
  useGetExpertiseQuery, 
  useGetDomainQuery, 
  useGetBenefitQuery,
  useCreateBenefitMutation,
  useUpdateBenefitMutation,
  useDeleteBenefitMutation
} = masterDataApi;
