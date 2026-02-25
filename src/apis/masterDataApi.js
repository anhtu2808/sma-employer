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
      transformResponse: (response) => response?.data?.content ?? [],
    }),
  }),
});

export const { useGetExpertiseQuery, useGetDomainQuery, useGetBenefitQuery } =
  masterDataApi;
