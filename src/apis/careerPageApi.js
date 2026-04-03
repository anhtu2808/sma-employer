import { api, API_VERSION } from "./baseApi";

export const careerPageApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createCareerPage: builder.mutation({
      query: (body) => ({
        url: `${API_VERSION}/career-pages/manage`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["CareerPages"],
    }),
    getCareerPageManage: builder.query({
      query: () => ({
        url: `${API_VERSION}/career-pages/manage`,
        method: "GET",
      }),
      providesTags: ["CareerPages"],
    }),
    getCareerPage: builder.query({
      query: (slug) => ({
        url: `${API_VERSION}/career-pages/${slug}`,
        method: "GET",
      }),
      providesTags: (result, error, slug) => [{ type: "CareerPages", id: slug }],
    }),
    archiveCareerPage: builder.mutation({
      query: () => ({
        url: `${API_VERSION}/career-pages/manage/archive`,
        method: "DELETE",
      }),
      invalidatesTags: ["CareerPages"],
    }),
  }),
});

export const {
  useCreateCareerPageMutation,
  useGetCareerPageManageQuery,
  useGetCareerPageQuery,
  useArchiveCareerPageMutation,
} = careerPageApi;
