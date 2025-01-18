import { Stack } from "expo-router";
import { Image, TouchableOpacity } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { ImageSourcePropType } from 'react-native';
import { RelativePathString } from "expo-router";

export interface navTopConfig {
    targetRoute: string,
    profileIconPath: ImageSourcePropType,
    profileRoute: RelativePathString,
    logoIconPath: ImageSourcePropType,
    homeRoute: RelativePathString,
    notificationsIconPath: ImageSourcePropType,
    notificationsRoute: RelativePathString,
    role: string,
}

// ข้างล่างนี้ Run จริงแล้วไม่แสดงผล
// ขึ้นเตือนประมาณนี้
//
// (NOBRIDGE) WARN  Layout children must be of type Screen, 
// all other children are ignored. To use custom children, 
// create a custom <Layout />. Update Layout Route at: "app/_layout" [Component Stack]
// 
// export default function NavBarTop({
//     targetRoute,
//     profileIconPath,
//     profileRoute,
//     logoIconPath,
//     homeRoute,
//     notificationsIconPath,
//     notificationsRoute
// }: navTopConfig) { // ได้แล้ว แต่โดน Typescript
//     const router = useRouter();
//     return (
//         <Stack.Screen
//             name={targetRoute}
//             options={{
//                 headerShown: true,
//                 headerLeft: () => (
//                     <TouchableOpacity onPress={(() => router.push(profileRoute))}>
//                         <Image
//                             source={profileIconPath}
//                             style={{ width: 48, height: 48, marginTop: 14, marginBottom: 13 }}
//                         />
//                     </TouchableOpacity>
//                 ),
//                 headerTitle: () => (
//                     <TouchableOpacity onPress={(() => router.push(homeRoute))}>
//                         <Image
//                             source={logoIconPath}
//                             style={{ width: 40, height: 40 }}
//                         />
//                     </TouchableOpacity>
//                 ),
//                 headerRight: () => (
//                     <TouchableOpacity onPress={(() => router.push(notificationsRoute))}>
//                         <Image
//                             source={notificationsIconPath}
//                             style={{ width: 24, height: 24 }}
//                         />
//                     </TouchableOpacity>
//                 ),
//                 headerTitleAlign: "center",
//             }} 
//         />
//     );
// }
