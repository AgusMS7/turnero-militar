import { ProfessionalDegree, ProfessionalDegreeGet, TokenWithEntity } from "@/app/definitions/definitions";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const professionalDegreeApi = createApi({
    reducerPath: "professionalDegree",
        tagTypes:["ProfessionalDegree"],
        baseQuery: fetchBaseQuery({
            baseUrl: process.env.NEXT_PUBLIC_API_URL,
            prepareHeaders: (headers) => {
                headers.set("Content-Type", "application/json");
            },
        }),
    endpoints: (builder) => ({
        getProfessionaDegree: builder.
        query<ProfessionalDegree[],string>({
            query: (token)=>({
                url: `professional-degree`,
                headers: {
                Authorization: `Bearer ${token}`,
                }
            }),
            providesTags: ["ProfessionalDegree"]
        }),
        getProfessionaDegreePaginated: builder.
        query<ProfessionalDegreeGet,TokenWithEntity>({
            query: ({token,entity})=>({
                url: `professional-degree/paginated?page=${entity.page}&limit=${entity.limit}`,
                headers: {
                Authorization: `Bearer ${token}`,
                }
            }),
            providesTags: ["ProfessionalDegree"]
        })
    })
})
export const{
    useGetProfessionaDegreeQuery,
    useGetProfessionaDegreePaginatedQuery
}= professionalDegreeApi

