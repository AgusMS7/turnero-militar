import { TokenWithEntity, TypeAppointment } from "@/app/definitions/definitions";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const typeAppointmentApi = createApi({
    reducerPath: "typeAppointment",
    tagTypes:["TypeAppointment"],
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_API_URL,
        prepareHeaders: (headers) => {
            headers.set("Content-Type", "application/json");
        },
    }),
    endpoints: (builder) => ({
        getAllAppointmentTypes: builder.query<{
            data:TypeAppointment[],
            total:number,
            page:number,
            limit:number,
            lastpage:number
        },
        TokenWithEntity
        >({
            query: ({token,entity})=>({
                url: `type-appointment?name=${entity.name}&color=${entity.color}`,
                headers: {
                Authorization: `Bearer ${token}`,
                }
            }),
            providesTags: ["TypeAppointment"]
        }),
    })
})

export const {
    useGetAllAppointmentTypesQuery 
}= typeAppointmentApi