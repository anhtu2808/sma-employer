import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import omitBy from "lodash/omitBy";
import isNil from "lodash/isNil";

export const API_VERSION = "/v1";

const stripNullish = (obj) => {
    if (!obj || typeof obj !== "object") return obj;
    return omitBy(obj, isNil);
};

const rawBaseQuery = fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_URL,
    prepareHeaders: (headers) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            console.log("Attaching token:", token);
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                console.log("Token payload:", payload);
            } catch (e) {
                console.error("Failed to decode token", e);
            }
            headers.set('Authorization', `Bearer ${token}`);
        } else {
            console.warn("No access token found in localStorage");
        }
        return headers;
    },
    responseHandler: async (response) => {
        const text = await response.text();
        try {
            return JSON.parse(text);
        } catch (e) {
            return text;
        }
    },
});

const customBaseQuery = (args, api, extra) => {
    if (typeof args === "object") {
        const { params, body, ...rest } = args;
        console.log("Flux API Body:", body);
        const strippedParams = stripNullish(params);
        console.log("Flux API Params:", strippedParams);
        return rawBaseQuery(
            {
                ...rest,
                params: strippedParams,
                body
            },
            api,
            extra
        );
    }
    return rawBaseQuery(args, api, extra);
};

export const api = createApi({
    reducerPath: "api",
    baseQuery: customBaseQuery,
    tagTypes: ["Users", "Jobs", "Applications", "Companies", "Plans", "FeatureUsage"],
    endpoints: () => ({})
});
