// import useGetMe from '@/components/hooks/useGetProfile';
// import { ERole } from '@/types/user';
// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';

// const rolePermissions: {
//   [key: string]: ERole[];
// } = {
//   '/admin': [ERole.ADMIN],
//   '/user': [ERole.USER],
// };

// export function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl;
//   const { user } = useGetMe();

//   const allowedRoles = rolePermissions[pathname];
//   if (allowedRoles && !allowedRoles.includes(userRole)) {
//     return NextResponse.redirect(new URL('/unauthorized', request.url));
//   }

//   return NextResponse.next();
// }

// // Áp dụng middleware cho các đường dẫn cần kiểm tra
// export const config = {
//   matcher: ['/admin', '/user'],
// };
