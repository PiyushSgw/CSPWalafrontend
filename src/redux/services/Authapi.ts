// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
// import { RegisterData, LoginData, User } from '../../utils/types';

// export interface AuthResponse {
//   success: boolean;
//   token?: string;
//   userId?: string;
//   otp?: string;
// }

// export const authApi = createApi({
//   reducerPath: 'authApi',
//   baseQuery: fetchBaseQuery({
//     baseUrl: 'http://localhost:3001/api',
//   }),
//   tagTypes: ['User'],
//   endpoints: (builder) => ({
//     register: builder.mutation<AuthResponse, RegisterData>({
//       query: (data) => ({
//         url: '/auth/register',
//         method: 'POST',
//         body: data,
//       }),
//     }),
//     verifyOTP: builder.mutation<AuthResponse, { userId: string; otp: string }>({
//       query: (data) => ({
//         url: '/auth/verify-otp',
//         method: 'POST',
//         body: data,
//       }),
//     }),
//     login: builder.mutation<{ token: string; user: User }, LoginData>({
//       query: (data) => ({
//         url: '/auth/login',
//         method: 'POST',
//         body: data,
//       }),
//     }),
//   }),
// });

// export const { 
//   useRegisterMutation, 
//   useVerifyOTPMutation, 
//   useLoginMutation 
// } = authApi;
