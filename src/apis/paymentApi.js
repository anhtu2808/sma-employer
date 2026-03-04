import { api, API_VERSION } from "@/apis/baseApi";

export const paymentApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getPaymentStatus: builder.query({
            query: (paymentId) => ({
                url: `${API_VERSION}/payments/${paymentId}/status`,
                method: "GET",
            }),
        }),
        confirmPayment: builder.mutation({
            query: (body) => ({
                url: `${API_VERSION}/payments/confirm`,
                method: "POST",
                body,
            }),
        }),
    }),
});

export const { useGetPaymentStatusQuery, useConfirmPaymentMutation } = paymentApi;
