import {
    View,
    Text,
    Image,
    ImageSourcePropType,
    Pressable,
} from "react-native";
import React, { useState, useEffect } from "react";
import axios from "axios";
import BASE_URL from "../../../../config";
import CategoryBox from "./CategoryBox";
import Card from "../../../../global/components/Card";
import { useRouter } from "expo-router";

export interface articleBoxProps {
    title: string,
    imageSource: string,
    categories: string,
    articleId: string,
}

export default function ArticleBox({ 
    title,
    imageSource,
    categories,
    articleId,
}: articleBoxProps) {
    const router = useRouter();
    const split_Categories = categories.split(", ");
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    useEffect(() => {
        async function fetchImage() {
            try {
                const [folder, fileName] = imageSource.includes("/") ? imageSource.split("/") : ["blogImage", imageSource];
                
                setImageUrl(imageSource.includes("http") ? imageSource : `${BASE_URL}/api/image/${folder}/${fileName}`);
            } catch (error) {
                setImageUrl("");
            }
        }

        fetchImage();
    }, [imageSource]);

    return (
        <Pressable onPress={(() => router.push(`/resource/(context)/${articleId}`, { relativeToDirectory: true }))}>
            <Card>
                <View className="mx-3 w-full h-36">
                    {imageUrl && (
                        <Image
                            className="w-full h-full"
                            source={{ uri: imageUrl } as ImageSourcePropType}
                        />
                    )}
                </View>
                <View className="mx-3 justify-start flex w-full">
                    <Text
                        className="font-sans text-body text-secondary"
                        numberOfLines={1}
                        ellipsizeMode="tail"
                    >
                        {title}
                    </Text>
                </View>
                <View className="justify-start mx-3 flex flex-wrap flex-row w-full">
                    {
                        split_Categories.map((category, index) => (
                            <CategoryBox key={index} category={category} />
                        ))
                    }
                </View>
            </Card>
        </Pressable>
    )
}