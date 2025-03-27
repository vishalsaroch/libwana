import FeaturedViewAll from '@/components/PagesComponent/FeaturedViewAll/FeaturedViewAll'
import SEO from '@/components/SEO/SEO'
import axios from 'axios';
import React from 'react'
export const generateMetadata = async ({ params }) => {
    try {
        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_END_POINT}get-featured-section?slug=${params?.slug}`
        );

        const stopWords = ['the', 'is', 'in', 'and', 'a', 'to', 'of', 'for', 'on', 'at', 'with', 'by', 'this', 'that', 'or', 'as', 'an', 'from', 'it', 'was', 'are', 'be', 'has', 'have', 'had', 'but', 'if', 'else'];

        const generateKeywords = (description) => {
            if (!description) {
                return process.env.NEXT_PUBLIC_META_kEYWORDS
                    ? process.env.NEXT_PUBLIC_META_kEYWORDS.split(',').map(keyword => keyword.trim())
                    : [];
            }

            // Convert description to lowercase, remove punctuation, and split into words
            const words = description
                .toLowerCase()
                .replace(/[^\w\s]/g, '')
                .split(/\s+/);

            // Filter out common stop words
            const filteredWords = words.filter(word => !stopWords.includes(word));

            // Count the frequency of each word
            const wordFrequency = filteredWords.reduce((acc, word) => {
                acc[word] = (acc[word] || 0) + 1;
                return acc;
            }, {});

            // Sort words by frequency and return the top keywords
            const sortedWords = Object.keys(wordFrequency).sort((a, b) => wordFrequency[b] - wordFrequency[a]);

            // Return top 10 keywords (or less if there are fewer words)
            return sortedWords.slice(0, 10);
        }

        const title = response?.data?.data[0].title
        const description = response?.data?.data[0].title
        const keywords = generateKeywords(response?.data?.data[0].title)
        const image = response?.data?.data[0]?.image

        return {
            title: title ? title : process.env.NEXT_PUBLIC_META_TITLE,
            description: description ? description : process.env.NEXT_PUBLIC_META_DESCRIPTION,
            openGraph: {
                images: image ? [image] : [],
            },
            keywords: keywords
        };
    } catch (error) {
        console.error("Error fetching MetaData:", error);
        return null;
    }
};
const page = ({ params }) => {
    return (
        <div>
            {/* <SEO /> */}
            <FeaturedViewAll slug={params?.slug} />
        </div>
    )
}

export default page