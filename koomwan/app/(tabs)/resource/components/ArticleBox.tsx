import {
    View,
    Text,
    Image,
    ImageSourcePropType,
    Pressable,
} from "react-native";
import React from "react";
import CategoryBox from "./CategoryBox";
import Card from "../../../../global/components/Card";
import { useRouter } from "expo-router";

export interface articleBoxProps {
    title: string,
    imageSource: ImageSourcePropType,
    author: string,
    categories: Array<string>
}

export default function ArticleBox({ title,
    imageSource,
    author,
    categories
}: articleBoxProps) {
    const router = useRouter();

    return (
        <Pressable onPress={(() => router.push("/resource/context/1", { relativeToDirectory: true }))}>
            <Card>
                <View className="mx-3 w-full h-36">
                    <Image
                        className="w-full h-full"
                        source={imageSource}
                    />
                </View>
                <View className="mx-3 justify-start flex w-full">
                    <Text
                        className="font-sans text-body text-secondary"
                        numberOfLines={1}
                        ellipsizeMode="tail"
                    >
                        {title}
                    </Text>
                    <Text className="font-sans text-tag text-secondary">
                        เขียนโดย : {author}
                    </Text>
                </View>
                <View className="justify-start mx-3 flex flex-wrap flex-row w-full">
                    {
                        categories.map((category, index) => (
                            <CategoryBox key={index} category={category} />
                        ))
                    }
                </View>
            </Card>
        </Pressable>
    )
}
